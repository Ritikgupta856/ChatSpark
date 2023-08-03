import React, { useContext, useState } from 'react';
import PopupWrapper from './PopupWrapper';
import "./DeleteMsgpopup.css";

import {RiErrorWarningLine } from "react-icons/ri";
import { useChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { DELETE_FOR_EVERYONE, DELETE_FOR_ME } from '../constants';






function DeleteMsgpopup(props) {

  return (
    <PopupWrapper {...props}>
  <div className='DeleteMsgpopup'>
     <div className='delete-container'>
        <RiErrorWarningLine size={20}/>
     <div className='delete-container-title'>Are you sure you want to delete this message?</div>
     </div>
   <div className="action-buttons">
       {props.self && <button onClick={()=>props.deleteMessage(DELETE_FOR_ME )} className='delete-button'>Delete for me</button>}
       <button onClick={()=>props.deleteMessage( DELETE_FOR_EVERYONE)} className='delete-button'>Delete for Everyone</button>
       <button onClick={props.onHide} className='delete-button'>Cancel</button>
   </div>

  </div>
</PopupWrapper>


  );
}



export default DeleteMsgpopup;
