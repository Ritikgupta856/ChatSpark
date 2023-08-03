import React, { useContext, useEffect, useState } from "react";


import { AuthContext } from "../context/AuthContext";
import { ChatContext, useChatContext } from "../context/ChatContext";

import { BsEmojiSmile } from 'react-icons/bs';
import { TbSend } from 'react-icons/tb';
import { MdDeleteForever } from 'react-icons/md';
import { RiAttachment2 } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import typingSvg from '../img/typing.svg';


import {
  arrayUnion,
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ClickAwayListener from 'react-click-away-listener';
let typingTimeout = null;

const ChatFooter = () => {


  const { text, setText, setAttachment, setAttachmentPreview, attachmentPreview, attachment, editMessage, setEditMessage, isTyping } = useChatContext();

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [emoji, setEmoji] = useState(false);


  useEffect(() => {
    setText(editMessage?.text || "")
  }, [editMessage]);


  const handleTyping = async (e) => {
    setText(e.target.value)
    await updateDoc(doc(db, "chats", data.chatId), {
      [`typing.${currentUser.uid}`]: true
    })

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    typingTimeout = setTimeout(async () => {
      await updateDoc(doc(db, "chats", data.chatId), {
        [`typing.${currentUser.uid}`]: false,
      });

      typingTimeout = null;

    }, 500);
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      editMessage ? handleEdit() : handleSend()

    }
  }

  const onEmojiClick = (emojiData, event) => {
    const { emoji } = emojiData;
    setText((prevText) => prevText + emoji);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);

    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setAttachmentPreview(blobUrl);
    }
  }



  const handleSend = async () => {

    if (attachment) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, attachment);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                read: false,
                img: downloadURL,
              }),
            });

            const lastMessage = { img: downloadURL };
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [data.chatId + ".lastMessage"]: lastMessage,
              [data.chatId + ".date"]: serverTimestamp(),
            });
            await updateDoc(doc(db, "userChats", data.user.uid), {
              [data.chatId + ".lastMessage"]: lastMessage,
              [data.chatId + ".date"]: serverTimestamp(),
            });
          } catch (error) {
            console.error(error);
          }
        }
      );
    }
    else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          read: false
        }),
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
        [data.chatId + ".chatDeleted"]: deleteField()
      });
    }


    setEmoji(false);
    setText("");
    setAttachment(null);
    setAttachmentPreview(null);
  };

  const handleEdit = async () => {

    const messageId = editMessage.id;
    const chatRef = doc(db, "chats", data.chatId);

    const chatDoc = await getDoc(chatRef);

    if (attachment) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, attachment);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const updatedMessages = chatDoc.data().messages.map((message) => {
              if (message.id === messageId) {
                message.text = text;
                message.img = downloadURL;
              }
              return message;
            });
            await updateDoc(chatRef, {
              messages: updatedMessages,
            });
          } catch (error) {
            console.error(error);
          }
        }
      );
    } else {
      const updatedMessages = chatDoc.data().messages.map((message) => {
        if (message.id === messageId) {
          message.text = text;
        }
        return message;
      });
      await updateDoc(chatRef, {
        messages: updatedMessages,
      });
    }


    setEmoji(false);
    setText("");
    setAttachment(null);
    setAttachmentPreview(null);
    setEditMessage(null);
  }


  return (
    <div className="ChatFooter">

      {isTyping &&
        <div className="istyping">
          <div className="typing-content"></div>
          {`${data?.user?.displayName} is typing`}
          <img src={typingSvg} alt="not found" />
        </div>
      }


      {attachmentPreview &&
        <div className="attachment-preview"
          onClick={() => {
            setAttachment(null),
              setAttachmentPreview(null)
          }}
        >

          <img src={attachmentPreview} alt="" />
          <MdDeleteForever className="delete-image-preview" size={14} />
        </div>
      }


      <input
        type="file"
        style={{ display: "none" }}
        onChange={onFileChange}
        id="file"

      />
      <label htmlFor="file">
        <div className="attachment"><RiAttachment2 /></div>
      </label>

      <input
        type="text"
        placeholder="Write a message"
        onChange={handleTyping}
        value={text}
        onKeyDown={handleKeyDown}
      />


      {emoji && (
        <ClickAwayListener onClickAway={() => setEmoji(false)}>
          <div className="emoji-picker">
            <EmojiPicker
              EmojiStyle="twitter"
              autoFocus={false}
              theme="light"
              onEmojiClick={onEmojiClick} />
          </div>
        </ClickAwayListener>
      )
      }



      <div className="emoji-send-container">
        <div className="emoji-btn">

          <BsEmojiSmile onClick={() => setEmoji(true)} />

        </div>

        <TbSend className={`send-message ${text.trim().length > 0 ? "typing" : ""}`} onClick={editMessage ? handleEdit : handleSend} />

      </div>

    </div>
  );
};

export default ChatFooter;