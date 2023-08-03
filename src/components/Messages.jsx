import React, { useContext, useEffect, useState } from 'react';
import Message from './Message';
import "../pages/home.css"
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { DELETE_FOR_ME } from '../constants';
import { AuthContext } from '../context/AuthContext';

function Messages() {
const [messages,setMessages] = useState([]);
const {data,setisTyping} = useContext(ChatContext);
const {currentUser} = useContext(AuthContext);

useEffect(()=>{
  const unSub = onSnapshot(doc(db,"chats",data.chatId),(doc)=>{
doc.exists() && setMessages(doc.data().messages)
setisTyping(doc.data()?.typing?.[data.user.uid] || false)
  })
  
  return ()=>{
    unSub();
  }
},[data.chatId])


  return (
    <div className="messages">
   
      {messages?.filter((m) =>{
         return (
          m?.deletedInfo?.[currentUser.uid] !==
          DELETE_FOR_ME && !m?.deletedInfo?.deletedForEveryone && !m?.deletedChatInfo?.[currentUser.uid]
         )
      })?.map((m)=>(
        
        <Message message={m} key={m.id} onDelete={m} />
      ))}
      
      
    </div>
  )
}

export default Messages;
