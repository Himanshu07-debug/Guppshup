import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import axios from 'axios'

import './Register.scss';
import Header from '../../components/Header/Header';
import { toast } from 'react-toastify';
import {registerApi} from '../../apis/restapis';
import 'react-toastify/dist/ReactToastify.css';
import { setIsLoggedIn } from '../../store/userSlice';



const Register = () => {
    
    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const [userData, setUserData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })


    const handleChange = (event) => {
        setUserData((prevData) => {
            return {
                ...prevData,
                [event.target.name]: event.target.value
            }
        })
    }

    
    // toast options 
    const toastOptions = {  
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    }

    // if the user is registered and its try to access register route, we have to redirect to the chat page
    // have to check this when the page gets loaded... first time sirf chalega useEffect
    // Remember : Yeah apne main wale me nhi likha hai.. useEffect
    useEffect(() => {
        if(localStorage.getItem("user-data")){
            Navigate("/");
        }
    }, []);

    // validating form validation
    const handleValidation = () => {
        const { userName, email, password, confirmPassword } = userData;

        if (confirmPassword !== password) {
            toast.warn('Password and Confirm Password Should be equal!!', toastOptions);
            return false;
        }

        if(!email.includes("@")){
            toast.warn('Email is invalid!!', toastOptions);
            return false;
        }

        if(userName.length === 0 || password.length === 0 || confirmPassword.length === 0 || email.length === 0){
            toast.warn('All fields are mandatory!!', toastOptions);
            return false;
        }

        return true;

    }


    // handling the submit part
    const handleSubmit = async (event) => {

        event.preventDefault();

        // validation done
        if(handleValidation()){
            try{

                // Making a Post request with sending userData 
                const response = await axios.post(registerApi, userData);

                if(response.status === 201){
                    toast.success('Registration Successfull!!', toastOptions);

                    // If the request is processed, store the user in the local storage for further use
                    localStorage.setItem('user-data', JSON.stringify(response.data));

                    // state variable ko set as true
                    dispatch(setIsLoggedIn(true));

                    // navigating to the avatar page to select avatar for the new guy
                    Navigate('/avatar');
                }
            }
            catch(err){
                console.log(err.message);
            }
        }
       
    }

    return (
        <>
        <Header linkTo={"/login"} btnText={"Sign In"}/>
        <div className='register-container'>
            <form className='form-container' onSubmit={handleSubmit}>
                <div className="heading">
                    <h3>Sign Up</h3>
                </div>
                <input type="text" placeholder='User Name' name='userName' onChange={handleChange} value={userData.userName} />
                <input type="email" placeholder='Email' name='email' onChange={handleChange} value={userData.email} />
                <input type="password" placeholder='Password' name='password' onChange={handleChange} value={userData.password} />
                <input type="password" placeholder='Confirm Password' name='confirmPassword' onChange={handleChange} value={userData.confirmPassword} />
                <button type="Submit"> SIGN UP </button>

                {/* LINK component used */}
                <span>Already a user? <Link className='link' to='/login'>Sign In</Link></span>
            </form>
        </div>
        </>
    )
}

export default Register