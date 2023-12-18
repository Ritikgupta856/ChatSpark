import React, { useContext} from 'react';
import Avatar from "./Avatar";
import { ChatContext } from '../context/ChatContext';

function ChatHeader() {
    const { users, data } = useContext(ChatContext);
    const online = users[data.user.uid]?.isOnline;
    const user = users[data.user.uid]; 

  return (
    <div>
      
      <div className="chatInfo">

        < Avatar size="large" user={user} />

        <div className="lol">

          <div className="name">{user?.displayName}</div>
          <p className="user-status">{online ? "online" : "offline"}</p>
        </div>


      </div>
    </div>
  )
}

export default ChatHeader
