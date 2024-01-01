import React from "react";

import Messages from "../Messages/Messages";
import ChatFooter from "../ChatFooter/ChatFooter";
import ChatHeader from "../ChatHeader/ChatHeader";
import "./ChatPanel.css"

const ChatPanel = () => {


  return (
    <div className="ChatPanel">
      <ChatHeader />
      <Messages />
      <ChatFooter />
    </div>
  );
};

export default ChatPanel;
