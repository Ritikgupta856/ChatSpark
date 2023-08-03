import React, { useContext, useState } from 'react';
import Avatar from "./Avatar";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import ChatMenu from "./ChatMenu";
import { ChatContext } from '../context/ChatContext';

function ChatHeader() {
    const { users, data } = useContext(ChatContext);
    const online = users[data.user.uid]?.isOnline;
    const user = users[data.user.uid]; 
    const[showMenu,setShowMenu] = useState(false);
  

  return (
    <div>
      
      <div className="chatInfo">

        < Avatar size="large" user={user} />

        <div className="lol">

          <div className="name">{user?.displayName}</div>
          <p className="user-status">{online ? "online" : "offline"}</p>
        </div>


        <IoEllipsisVerticalSharp className="dropdown" size={20} onClick={() => setShowMenu(true) }/>
        {showMenu && <ChatMenu setShowMenu={setShowMenu}/> }

      </div>
    </div>
  )
}

export default ChatHeader
