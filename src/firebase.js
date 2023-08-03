
import {getAuth} from "firebase/auth";
import { getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";




import { initializeApp } from "firebase/app";




const firebaseConfig = {
  apiKey: "AIzaSyDBVnTy43Hvtpu-u_nrbBuEwB7N7S8WXxg",
  authDomain: "chat-e7e0b.firebaseapp.com",
  projectId: "chat-e7e0b",
  storageBucket: "chat-e7e0b.appspot.com",
  messagingSenderId: "999036299271",
  appId: "1:999036299271:web:fba841abe58e2688c422a2"
};



export const app = initializeApp(firebaseConfig);
export const auth  = getAuth();
export const storage = getStorage();
export const db = getFirestore();
