import React from 'react'
import './Logo.css'
import logo from "../../img/logo.jpg"

const Logo = () => {
  return (
    <div>
        <div className="logo-container">
        <img className='logo' src={logo} alt="logo" />
        <h3 className="site-name">ChatSpark</h3>
      </div>
    </div>
  )
}

export default Logo
