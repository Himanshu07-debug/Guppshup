import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import './Login.scss'
import Header from '../../components/Header/Header'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginApi } from '../../apis/restapis';
import { setIsLoggedIn } from '../../store/userSlice'


const Login = () => {

    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const [userData, setUserData] = useState({
        email: "",
        password: "",
    })

    const handleChange = (event) => {
        setUserData((prevData) => {
            return {
                ...prevData,
                [event.target.name]: event.target.value
            }
        })
    }

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

    const handleValidation = () => {
        const { email, password } = userData;

        if(email.length === 0){
            toast.warn('Email Is Not Provided!!', toastOptions);
            return false;
        }

        if(password.length === 0){
            toast.warn('Password Is Not Provided!!', toastOptions);
            return false;
        }

        if(!email.includes("@")){
            toast.warn('Email is invalid!!', toastOptions);
            return false;
        }
        
        return true;
    }
    

    const handleSubmit = async(event) => {
        event.preventDefault();
        // console.log(loginApi);
        if(handleValidation()){
            try{
                const response = await axios.post(loginApi, userData);
                if(response.status === 200){
                    toast.success('Logged In Successfully!!', toastOptions);
                    localStorage.setItem('user-data', JSON.stringify(response.data.user));
                    sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
                    sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
                    dispatch(setIsLoggedIn(true));
                    Navigate('/')
                }
            }
            catch(err){
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
                toast.error(err.message, toastOptions);
            }
        }
    }

    return (
        <>
            <Header linkTo={'/register'} btnText={'Sign Up'} />
            <div className='login-container'>
                <form onSubmit={handleSubmit} className='form-container'>
                    <div className="heading">
                        <h3>Sign In</h3>
                    </div>
                    <input type="text" placeholder='Email' name='email' onChange={handleChange} value={userData.email} />
                    <input type="password" placeholder='Password' name='password' onChange={handleChange} value={userData.password} />
                    <button type="Submit"> SIGN IN </button>
                    <span>Don't have an account? <Link className='link' to='/register'>Sign Up</Link></span>
                </form>
            </div>
        </>
    )
}



export default Login ;