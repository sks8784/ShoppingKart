import React, { Fragment, useRef, useState, useEffect } from 'react';
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { login,register, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const LoginSignUp = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate=useNavigate();
    const location=useLocation();

    const { error, loading, isAuthenticated } = useSelector((state) => state.user);

    const loginTab = useRef(null);// this is basically used to access the particular element becoz in react we can't use DOM
    const registerTab = useRef(null);
    const switcherTab = useRef(null);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState("https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=");
    const [avatarPreview, setAvatarPreview] = useState("https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=");


    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
    }

    const registerSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("avatar", avatar);


        dispatch(register(myForm));
    };


    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) { //reader has only three states...state 0 - initial State, state 1- processing State, state 2-Done State
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    }

    const redirect=location.search ? location.search.split("=")[1] : "/account"; //for this refer to the link inside checkouthandler func in Cart.js
    

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(isAuthenticated){
            navigate(redirect);
        }
    }, [dispatch, error, alert,navigate,isAuthenticated,redirect]);

    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }

        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }

    };

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <div className='LoginSignUpContainer'>
                        <div className='LoginSignUpBox'>
                            <div>
                                <div className='login_signUp_toggle'>
                                    <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                                    <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                                </div>
                                <button ref={switcherTab}></button>
                            </div>
                            <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>

                                <div className='loginEmail'>
                                    <MailOutlineIcon />
                                    <input type="email" placeholder='Email' required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                                </div>

                                <div className='loginPassword'>
                                    <LockOpenIcon />
                                    <input type="password" placeholder='Password' required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                                </div>

                                <Link to="/password/forgot">Forget Password ?</Link>
                                <input type="submit" value="login" className='loginBtn' />

                            </form>

                            {/* in order to upload image in form tag we have to use encType */}
                            <form className='signUpForm' ref={registerTab} encType='multipart/form-data' onSubmit={registerSubmit}>

                                <div className='signUpName'>
                                    <FaceIcon />
                                    <input type="text" placeholder='Name' required name="name" value={name} onChange={registerDataChange} />
                                </div>

                                <div className='signUpEmail'>
                                    <MailOutlineIcon />
                                    <input type="email" placeholder='Email' required name="email" value={email} onChange={registerDataChange} />
                                </div>

                                <div className='signUpPassword'>
                                    <LockOpenIcon />
                                    <input type="password" placeholder='Password' required name="password" value={password} onChange={registerDataChange} />
                                </div>

                                <div id="registerImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*" // to accept all types of images
                                        onChange={registerDataChange}

                                    />
                                </div>

                                <input type="submit" value="Register" className='signUpBtn' />

                            </form>

                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

export default LoginSignUp
