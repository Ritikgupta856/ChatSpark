import React from 'react';
import { PuffLoader } from "react-spinners";
import "./Loader.css"


const Loader = () => {
  return (
    <div className='loader'>
      <PuffLoader
        size={100}
        color="blue"
      />
    </div>
  )
}

export default Loader;
