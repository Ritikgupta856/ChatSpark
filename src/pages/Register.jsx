import React, { useContext, useEffect, useState } from "react";
import {IoLogoGoogle,IoLogoFacebook} from "react-icons/io";
import { createUserWithEmailAndPassword, updateProfile ,signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,} from "firebase/auth";
import { auth, db} from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../img/logo.jpg"
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
const gprovider = new GoogleAuthProvider();
const fprovider = new FacebookAuthProvider();

const profileColors = [
  "#E95F56",
  "#C490D1",
  "#897E95",
  "#A6AB95",
  "#E46000",
  "#1090D8",
  "#E86D8A",
  "#1F7551",
  "#9DC2B7",
  "#FFE177",
  "#A9D2FD",
  "#FFCDA5",
  "#4AAC67",
  "#FFE5A5",
  "#CD413C",
];


const Register = () => {
  const [setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    
  });

  const { currentUser, isloading } = useContext(AuthContext);


  useEffect(() => {
    if (!isloading && currentUser) {
      navigate("/");
    }
  }, [currentUser, isloading]);


  const colorIndex = Math.floor(Math.random() * profileColors.length );
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  


  const notify = () =>{
    toast.error('Invalid Credientials', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
  }

  const fill = () =>{
    toast.error('Please fill out all fields.', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
  }
 
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, gprovider);
    } catch (error) {
      console.error(error);
    }
  }
  const signInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, fprovider);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { displayName, email, password} = formData;
  
    if (!displayName || !email || !password) {
      setErr(true);
      fill();
      return;
    }
  
    try {
  
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName});
  
    
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        color:profileColors[colorIndex]
      });
  
      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
      setLoading(false);
    } catch (err) {
      setErr(true);
      setLoading(false);
      notify();
    }
  };
  

  return isloading || (!isloading && currentUser) ? (
    <Loader/>
  ) : (

    <div>
      <ToastContainer/>
      <div className="main-title">
          <img className='logo' src={logo}alt="" />
          <h3 className="web-name">ChatSpark</h3>
          </div>
           

  
    <div className="register-container ">

      <span className="heading-1">Create Your Account</span>
      <span className="heading-2">Connect and chat with anyone,anywhere</span>

      <div className="social-media">
    
    
      <span onClick={signInWithGoogle}>
            <IoLogoGoogle size="24" />
            Login with Google
          </span>

          <span onClick={signInWithFacebook}>
            <IoLogoFacebook size="24" />
            Login with Facebook
          </span>

       
      </div>

      <div className="option">
     
      <span>—OR—</span>
    
   </div>

      <form className="form" method="POST" onSubmit={handleSubmit}>
        <div>
          <input type="text" name="displayName" className="input-field" placeholder="Display Name" onChange={handleChange} />
          <input type="email" name="email" className="input-field" placeholder="Email Id" onChange={handleChange} />
          <input type="password" name="password" className="input-field" placeholder="Enter Password" onChange={handleChange} />
          

        </div>

        <button className="register-submit" disabled={loading}>Sign up</button>
      

      </form>

      <p className="login-cta">Already have an account? <Link to="/login">Login</Link> </p>

    </div>
    </div>

  );


}


export default Register;
