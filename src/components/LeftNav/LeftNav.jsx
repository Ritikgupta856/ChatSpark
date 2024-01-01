import "./LeftNav.css"
import React, { useContext, useState } from 'react'

import { auth, db, storage } from '../../firebase'
import { AuthContext } from '../../context/AuthContext';
import { FiPlus } from 'react-icons/fi';
import { IoLogOutOutline, IoClose } from 'react-icons/io5';

import { MdPhotoCamera, MdAddAPhoto, MdDeleteForever } from 'react-icons/md';
import UserPopup from "../UserPopup/UserPopup";
import Avatar from "../Avatar/Avatar";
import { BiEdit } from 'react-icons/bi';
import { BiCheck } from 'react-icons/bi';
import { BsFillCheckCircleFill } from "react-icons/bs";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import toast from "react-hot-toast";



const profileColors = [
    "#E95F56",
    "#800080",
    "#897E95",
    "#000000",
    "#000080",
    "#1090D8",
    "#E86D8A",
    "#1F7551",
    "#FF1493",
    "#FFD700",
    "#A9D2FD",
    "#FFCDA5",
    "#4AAC67",
    "#FFE5A5",
    "#CD413C",
];


function LeftNav() {
    const { currentUser,signOut,setCurrentUser } = useContext(AuthContext);
    const [editProfile, setEditProfile] = useState(false);
    const [nameEdited, setNameEdited] = useState(false);
    const [userPopup, setUserPopup] = useState(false);
    const authUser = auth.currentUser;

    const uploadImageToFirestore = (file) => {
        try {
            if (file) {
                const storageRef = ref(storage, currentUser.displayName);

                const uploadTask = uploadBytesResumable(storageRef, file);


                uploadTask.on('state_changed',
                    (snapshot) => {

                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        console.error(error);
                    },
                    () => {

                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                            console.log('File available at', downloadURL);
                            handleUpdateProfile("photo", downloadURL)
                            await updateProfile(authUser, {
                                photoURL: downloadURL
                            })

                        });
                    }
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdateProfile = (type, value) => {

        let obj = { ...currentUser };
        switch (type) {
            case "color":
                obj.color = value;
                break;
            case "name":
                obj.displayName = value;
                break;
            case "photo":
                obj.photoURL = value;
                break;
            case "photo-remove":
                obj.photoURL = null;
                break;
            default:
                break;
        }

        try {
            toast.promise(
                async () => {
                    const userDocRef = doc(db, "users", currentUser?.uid);
                    await updateDoc(userDocRef, obj);
                    setCurrentUser(obj);

                    if (type === "photo-remove") {
                        await updateProfile(authUser, {
                            photoURL: null,
                        });
                    }
                    if (type === "name") {
                        await updateProfile(authUser, {
                            displayName: value,
                        });
                        setNameEdited(false);
                    }
                    if (type === "photo") {
                        await updateProfile(authUser, {
                            photoURL: value
                        });

                    }
                },
                {
                    loading: "Updating profile",
                    success: "Profile updated successfully",
                    error: "Profile update failed",

                },
                {
                    autoClose: 3000,
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const onkeyup = (event) => {
        if (event.target.innerText.trim() !== currentUser?.displayName) {
         
            setNameEdited(true);
        } else {
         
            setNameEdited(false);
        }
    };
    const onkeydown = (event) => {
        if (event.key === "Enter" && event.keyCode === 13) {
            event.preventDefault();
        }
    };


    return (

        <div className={`left-nav ${editProfile ? 'expanded' : ''}`}>
    

            {editProfile &&
                <div className="close-btn">
                    <IoClose onClick={() => setEditProfile(false)} size={20} />
                </div>
            }


            <div className="avatar-container">
                
                {editProfile &&
                    <Avatar size="x-large" onClick={() => setEditProfile(true)} user={currentUser}
                    />}
                {!editProfile &&
                    <Avatar size="large" onClick={() => setEditProfile(true)} user={currentUser}
                    />}


                {editProfile &&
                    <div class="overlay">
                        <label htmlFor="fileUpload">
                            <span class="icon">
                                {currentUser?.photoURL ? (
                                    <MdPhotoCamera size={25} />
                                ) : (
                                    <MdAddAPhoto size={25} />
                                )}
                            </span>
                        </label>
                        <input
                            id="fileUpload"
                            type="file"
                            onChange={(e) => uploadImageToFirestore(e.target.files[0])}

                        />
                    </div>
                }

            </div>




            {editProfile && currentUser?.photoURL &&

                <div >
                    <MdDeleteForever className="delete-photo" onClick={() => handleUpdateProfile("photo-remove")} />

                </div>
            }




            {editProfile &&
                <div className="user-details">
                    <div className="user-name-with-icon">
                        {!nameEdited && <BiEdit />}
                        {nameEdited && <BsFillCheckCircleFill onClick={() => handleUpdateProfile("name", document.getElementById("displayNameEdit").innerText)} />}
                        <span className="user-name"
                            contentEditable
                            onKeyUp={onkeyup}
                            onKeyDown={onkeydown}
                            id="displayNameEdit"
                        >
                            {currentUser?.displayName}

                        </span>
                    </div>
                    <span className="user-email">{currentUser?.email}</span>

                </div>
            }
            {editProfile && (
                <div className="profile-colors">
                    {profileColors.map((color, index) => (
                        <span
                            key={index}
                            style={{ backgroundColor: color }}
                            className="color-box"
                            onClick={() => handleUpdateProfile("color", color)}
                        >
                            {color === currentUser?.color ? <BiCheck color="white" size={24} /> : null}

                        </span>
                    ))}
                </div>
            )}



            <div className={`buttons ${editProfile ? 'expanded' : ''}`}>


                <FiPlus className="add-users" size={24} onClick={() => setUserPopup(!userPopup)} />


                <div className="logout-btn">

                    <IoLogOutOutline size={24} onClick={signOut} />
                </div>

            </div>
            {userPopup && <UserPopup onHide={() => setUserPopup(!userPopup)} title="Find User" />}

        </div>

    )
}

export default LeftNav;