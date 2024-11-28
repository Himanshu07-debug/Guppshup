import React, { useEffect, useState } from 'react'
import './Avatar.scss'
import Header from '../../components/Header/Header'
import { avatarApi } from '../../apis/restapis'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Avatar = () => {

  const Navigate = useNavigate();

  // Open source API for getting avatar
  // sirf apko query params me iss link ke aage random number pass kro.. wo koi bhi avatar de denga
  const api = 'https://api.multiavatar.com/'

  const [user, setUser] = useState({});
  const [avatarArr, setAvatarArr] = useState([])

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }

  // setting user to authenticated user credentials from local storage
  useEffect(() => {

    // if user is not login, redirect to the login page
    if(!localStorage.getItem('user-data')){
      Navigate("/login");
    }

    const userData = JSON.parse(localStorage.getItem('user-data'));
    setUser(userData);
  }, [])

  
  // generating avatar function
  const getAvatar = () => {
    let min = 5000;
    let max = 100000;

    // generating the random number
    const random = Math.round((Math.random() * (max - min) + min));

    // returning the imageURL
    const imgUrl = api + JSON.stringify(random) + '.png';

    return imgUrl;

  }

  // useEffect to generate the random avatars for the page
  useEffect(() => {

    // Only loading avatars
    for (let i = 0; i < 3; i++) {
      const imgUrl = getAvatar();
      setAvatarArr((prevArrData) => {
        return [...prevArrData, imgUrl];
      })
    }
    getAvatar();

  }, []);

  // If the user selects an avatar
  const handleSetAvatar = async (e) => {
    try{
        const id = user._id;

        // Calling API with the user_id so that it can be find and updated with its imageUrl (avatarPath)
        const url = avatarApi + id;

        // sending PUT request to update the avatarPath in the users obj of backend which is also stored in local storage 
        const response = await axios.put(url, {
          avatarPath : e.target.src
        })

        if(response.status === 200){

          // updating in local storage with the updated user credentials
          localStorage.setItem('user-data', JSON.stringify(response.data));
          toast.success('Avatar Selected Successfully', toastOptions);
          Navigate('/');
        }
    }
    catch(err){
      toast.error(err.response.data.error, toastOptions);
    }
  }

  return (
    <>
      <Header linkTo='/login' btnText='Sign Out' />
      <div className="avatar-container">
        <div className="heading">
          <h1>Welcome <span>{user.userName} </span> !!</h1>
          <h2>Please Select Your Favourite Avatar</h2>
        </div>
        <div className="avatars">
          {
            avatarArr.map((item, index) => {
              return (
                <img src={item} alt="avatar-img" className='avatar-img' 
                draggable = {false} onClick = {handleSetAvatar} key={index}
                />
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default Avatar