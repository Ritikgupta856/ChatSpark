import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Avatar from "./Avatar";
import ImageViewer from 'react-simple-image-viewer';
import { formateDate, wrapEmojisInHtmlTag } from "../helper";
import { GoChevronDown } from "react-icons/go";
import "../pages/home.css"
import MessageMenu from "./MessageMenu";
import DeleteMsgpopup from "./DeleteMsgpopup";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

import { db } from "../firebase";
import { DELETE_FOR_EVERYONE, DELETE_FOR_ME } from "../constants";




const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { users, data, imageViewer,
    setImageViewer, setEditMessage } = useContext(ChatContext);
  const user = users[data.user.uid];


  const self = message.senderId === currentUser.uid;
  const [showMenu, setShowMenu] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  const deletePopuphandler = () => {
    setShowDeletePopUp(true);
    setShowMenu(false);
  }
  const deleteMessage = async (action) => {
    try {
      const messageId = message.id;
      const chatRef = doc(db, "chats", data.chatId);
      const chatDoc = await getDoc(chatRef);

      const updateMessages = chatDoc.data().messages.map((message) => {
        if (message.id === messageId) {
          if (action === DELETE_FOR_ME) {
            message.deletedInfo = {
              [currentUser.uid]: DELETE_FOR_ME
            }
          }
          if (action === DELETE_FOR_EVERYONE) {
            message.deletedInfo = {
              deletedForEveryone: true
            }
          }
        }
        return message;
      }

      )

      await updateDoc(chatRef, { messages: updateMessages })
      setShowDeletePopUp(false);

    } catch (error) {
      console.error(error)
    }
  }



  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const timestamp = new Timestamp(
    message.date?.seconds,
    message.date?.nanoseconds,
  );
  const date = timestamp.toDate();
  

  return (
    <div
      ref={ref}
      className={`message ${self && "owner"}`}
    >
      {showDeletePopUp && <DeleteMsgpopup noheader={true} shortHeight={true} onHide={() => setShowDeletePopUp(false)} self={self} deleteMessage={deleteMessage} />}


      <div className="messageInfo">

        <Avatar size="small" user={self ? currentUser : user} />


        <span>
       {formateDate(date)}
        </span>


      </div>
      <div className="messageContent">
        {message.text && <p dangerouslySetInnerHTML={{ __html: wrapEmojisInHtmlTag(message.text) }}></p>}



        {message.img && (
          <img onClick={() => setImageViewer({ msgId: message.id, url: message.img })} src={message.img} alt="not found" />
        )}
        {imageViewer && imageViewer.msgId === message.id &&
          <ImageViewer
            src={[imageViewer.url]}
            currentIndex={0}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={() => setImageViewer(false)}
          />}
      </div>

      <div className={`message-dropdown ${self ? "" : "not-owner"}`}>

        <GoChevronDown onClick={() => setShowMenu(true)} />
      </div>
      {showMenu && <MessageMenu
        deletePopuphandler={deletePopuphandler}
        setShowMenu={setShowMenu}
        showMenu={showMenu}
        self={self} 
        setEditMessage={()=>setEditMessage(message)}
        />}



    </div>
  )
};

export default Message;

