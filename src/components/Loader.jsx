import React from 'react';
import Image from "../img/loader.svg";
import "../pages/home.css";


const Loader = () => {
  return (
    <div className='loader'>
     <img src={Image} alt="Loader" />
    </div>
  )
}

export default Loader;
