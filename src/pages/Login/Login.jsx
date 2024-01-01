import "./Login.css"
import React, { useContext, useEffect, useState } from "react";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail

} from "firebase/auth";
import { auth } from "../../firebase";
import 'react-toastify/dist/ReactToastify.css';

import logo from "../../img/logo.jpg"
import { AuthContext } from "../../context/AuthContext";

import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";

const gprovider = new GoogleAuthProvider();
const fprovider = new FacebookAuthProvider();


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(false);
  const { currentUser, isloading } = useContext(AuthContext);


  useEffect(() => {
    if (!isloading && currentUser) {
          navigate("/home");
    }
  }, [currentUser,isloading,navigate]);

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
    e.preventDefault()
    const email = e.target[0].value;
    const password = e.target[1].value;


    if (!email || !password) {
       toast.error("Please fill out all fields")
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

    } catch (err) {

    
      toast.error("Invalid Credentials")
    
    }
  };

  const resetPassword = async () => {
    try {
      await toast.promise(async () => {
        await sendPasswordResetEmail(auth, email)
      }, {
        loading: 'Wait for a second',
        success: 'Link is sent to your email ',
        error: 'Promise rejected '
      }
      )
    } catch (error) {
      console.error(error);
    }
  }


  return isloading || (!isloading && currentUser) ? (
    <Loader/>
  ) : (

    <div>

    

      <div className="main-title">
        <img className='logo' src={logo} alt="" />
        <h3 className="web-name">ChatSpark</h3>
      </div>

      <div className="login-container">


        <span className="heading-1">Login to Your Account</span>
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

            <input type="email" className="input-field" placeholder="Email Id" onChange={(e) => setEmail(e.target.value)}></input>

            <input type="password" className="input-field" placeholder="Enter Password" ></input>

          </div>

          <div className="forgot-password">
            <span onClick={resetPassword}>Forgot password?</span>
          </div>

          <button type="submit" className="login-submit">Login</button>


        </form>

        <p className="register-cta" >Don't have an account yet?  <Link to="/register">Register Now</Link></p>

      </div>
    </div>


  );
};

export default Login;