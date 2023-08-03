import React, { useEffect, useRef } from 'react';
import "./MessageMenu.css";
import ClickAwayListener from 'react-click-away-listener';

function MessageMenu({setShowMenu,self,showMenu,deletePopuphandler,setEditMessage}) {


  const ref = useRef() ;

  
  useEffect(() => {
    {
      ref?.current?.scrollIntoViewIfNeeded();
    }
  }, [showMenu]);

  const handleClickAway = () => {
    setShowMenu(false);
  }
  return (


   <ClickAwayListener onClickAway={handleClickAway}>
    <div className='messageMenu' ref={ref}>
     
     
      <ul>
       {self && <li onClick={(e) => {setShowMenu(false); setEditMessage()}} className="dropdown-menu">Edit message</li>} 
        <li onClick={() => deletePopuphandler(true)} className="dropdown-menu">Delete message</li>
      </ul>
   
    </div>
    </ClickAwayListener>
   
  )
}

export default MessageMenu
