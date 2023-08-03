import "./home.css";
import Sidebar from '../components/Sidebar';
import ChatPanel from '../components/ChatPanel';
import React, { useContext, useEffect, useState } from "react";
import LeftNav from "../components/LeftNav";
import { AuthContext } from "../context/AuthContext";
import logo from "../img/logo.jpg"


import Loader from "../components/Loader";
import { useChatContext } from "../context/ChatContext";


function Home() {

  const { currentUser } = useContext(AuthContext);
  const {selectedChat } = useChatContext();



  return (!currentUser) ? (
    <Loader />
  ) : (
    <div className="home">
      <div className="container">

        <LeftNav />
        <Sidebar />
        {selectedChat 
        ? <ChatPanel /> :
         <div className="welcome-container">
            <div>
            <img className="welcome-logo" src={logo} alt="" />
            </div>
            <h1>Welcome To ChatSpark</h1>
          <p>Join the conversation and connect with others.</p>
    


          </div> }
    


      </div>
    </div>
  );
}

export default Home;
