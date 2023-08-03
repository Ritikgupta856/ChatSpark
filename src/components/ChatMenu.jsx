import React, { useContext } from 'react';
import "./ChatMenu.css";
import ClickAwayListener from 'react-click-away-listener';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';

function ChatMenu({ setShowMenu }) {

  const { currentUser } = useContext(AuthContext);
  const { data, users,chats,dispatch } = useChatContext();

  const handleClickAway = () => {
    setShowMenu(false);
  }

  const isUserBlocked = users[currentUser.uid]?.blockedUsers?.find((u) => u === data.user.uid)
  const IamBlocked = users[data.user.uid]?.blockedUsers?.find((u) => u === currentUser.uid)

  const handleBlock = async (action) => {
    if (action === "Block") {
      await updateDoc(doc(db, "users", currentUser.uid), {
        blockedUsers: arrayUnion(data.user.uid)
      }
      )
    }
    if (action === "UnBlock") {
      await updateDoc(doc(db, "users", currentUser.uid), {
        blockedUsers: arrayRemove(data.user.uid)
      }
      )
    }

  }


  const handleDelete = async () => {
          try {
            const chatRef = doc(db,"chats",data.chatId);
            const chatDoc = await getDoc(chatRef);

            const updatedMessages = chatDoc.data().messages.map(message => {
              message.deleteChatInfo = {
                ...message.deleteChatInfo,
                [currentUser.uid] : true
              }
              return message;
            })

          await updateDoc(chatRef,{
            messages:updatedMessages 
          })
          await updateDoc(doc(db, "userChats", currentUser.uid), {

            [data.chatId + ".chatDeleted"]:true
          })

          const filteredChats = Object.entries(chats || {})
          .filter(([id, chat]) => id !== data.chatId)
          .sort((a,b) => b[1].date  - a[1].date)

          
          if(filteredChats.length > 0 ){
            dispatch({
              type:"CHANGE_USER",
              payload:filteredChats?.[0]?.[1]?.userInfo

            })
          }

          else{
            dispatch({type:"EMPTY"})
          }

          } catch (error) {
            console.error(error)
          }
  }

  return (


    <ClickAwayListener onClickAway={handleClickAway}>
      <div className='chatMenu'>

        <ul>
          {!IamBlocked &&
            <li onClick={() => {
              setShowMenu(false)
              handleBlock(isUserBlocked ? "UnBlock" : "Block")
            }} className="dropdown-menu">{isUserBlocked ? "Unblock" : "Block user"}</li>
          }

          <li onClick={(e) => {
            setShowMenu(false)
            handleDelete()
          }} className="dropdown-menu">Delete user</li>
        </ul>

      </div>
    </ClickAwayListener>

  )
}

export default ChatMenu
