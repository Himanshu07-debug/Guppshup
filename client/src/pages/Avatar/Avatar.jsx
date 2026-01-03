import React, { useEffect, useState } from 'react'
import './Avatar.scss'
import Header from '../../components/Header/Header'
import { avatarApi } from '../../apis/restapis'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoRefresh } from 'react-icons/io5'


const Avatar = () => {

  const Navigate = useNavigate();
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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user-data'));
    setUser(userData);
  }, [])

  const generateAvatars = () => {
    if (!user.userName) return;
    
    const getAvatar = (index) => {
      // Generate unique avatars using dicebear.com with different styles
      const styles = ['avataaars', 'micah', 'open-peeps', 'bottts', 'personas', 'fun-emoji'];
      const style = styles[index % styles.length];
      // Generate a unique seed using username, index, timestamp, and random number
      const randomSeed = Math.random().toString(36).substring(2, 15);
      const timestamp = Date.now();
      const seed = `${user.userName}-${index}-${timestamp}-${randomSeed}`;
      const imgUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
      return imgUrl;
    };

    const newAvatars = [];
    for (let i = 0; i < 3; i++) {
      const imgUrl = getAvatar(i);
      newAvatars.push(imgUrl);
    }
    setAvatarArr(newAvatars);
  };

  useEffect(() => {
    generateAvatars();
  }, [user]);

  const handleSetAvatar = async (e) => {
    try{
        const id = user._id;

        const url = avatarApi + id;

        const response = await axios.put(url, {
          avatarPath : e.target.src
        })

        if(response.status === 200){
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
          <button className="refresh-btn" onClick={generateAvatars} title="Generate new avatars">
            <IoRefresh /> Generate New Avatars
          </button>
        </div>
        <div className="avatars">
          {
            avatarArr.map((item, index) => {
              return (
                <img src={item} alt="avatar-img" className='avatar-img' draggable = {false} onClick = {handleSetAvatar} key={index}/>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default Avatar
