import React, { useContext } from "react";

import Messages from "./Messages";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import { AuthContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";


const ChatPanel = () => {

  
  const { currentUser} = useContext(AuthContext);
  const { data,users} = useChatContext();


const isUserBlocked = users[currentUser.uid]?.blockedUsers?.find((u) => u === data.user.uid);
const IamBlocked = users[data.user.uid]?.blockedUsers?.find((u) => u === currentUser.uid);




  return (
    <div className="ChatPanel">
      <ChatHeader/>
      <Messages />
     {!isUserBlocked &&  !IamBlocked && <ChatFooter/> } 

      {isUserBlocked && <div className="blocked-by-me">This user has been blocked</div> }
  
     {IamBlocked && <div className="blocked-by-other">{`${data.user.displayName} has blocked you`}</div> }
   
    </div>
  );
};

export default ChatPanel;
