import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './ChatBox.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsFillSendFill, BsFillEmojiSmileFill } from 'react-icons/bs'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedContact } from '../../store/contactSlice';
import EmogiPicker from './EmogiPicker'
import ChatContainer from './ChatContainer';
import { addMessageApi, host } from '../../apis/restapis';
import { io } from 'socket.io-client';
import { setMessageArr } from '../../store/messageSlice';
const CryptoJS = require("crypto-js");


const ChatBox = (props) => {
    const socket = useRef(null);
    const { avatarPath, userName } = props.contact;
    const [openEmogiKeyboard, setOpenEmogiKeyboard] = useState(false);
    const [message, setMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const dispatch = useDispatch();

    const CurrentUser = JSON.parse(localStorage.getItem('user-data'));
    const SelectedUser = useSelector((state) => state.contact.selectedContact);
    const messageArr = useSelector((state) => state.messages.messageArr);

    useEffect(() => {
        if (CurrentUser) {
            socket.current = io(`${host}`);
            socket.current.emit('add-user', CurrentUser._id);
            // console.log(socket);
        }
        
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [CurrentUser]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (message.length !== 0) {
            try {

               
                const secretKey = 'qweyrgwtwuigu';

                const ciphertext = CryptoJS.AES.encrypt(message, secretKey).toString();



                // console.log('Encrypted:', ciphertext);

                const token1 = sessionStorage.getItem('accessToken'); 
                const token = token1 && token1.split(' ')[1];
                
                if (!token) {
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
                    toast.error("Please login again", toastOptions);
                    return;
                }
                // console.log("MY TOKEN");
                // console.log(token)

                const response = await axios.post(addMessageApi, {
                    from: CurrentUser._id,
                    to: SelectedUser._id,
                    message: ciphertext,
                    token:token
                });

                if (response.status === 200) {
                    setMessage("");
                }
                

                socket.current.emit('msg-send', {
                    to: SelectedUser._id,
                    from: CurrentUser._id,
                    message: message
                })

                const msg = [...messageArr];
                msg.push({ fromSelf: true, message: { message: { text: message} } });
                dispatch(setMessageArr(msg));
            }
            catch (err) {
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
                
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    toast.error("Session expired. Please login again", toastOptions);
                } else {
                    toast.error(err.response?.data?.msg || "Failed to send message. Please try again", toastOptions);
                }
            }
        }
    }


    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-receive', (msg) => {
                setArrivalMessage({ fromSelf: false, message: { message: { text: msg } } });
            })
        }
    }, []);

    useEffect(() => {
        const msg = [...messageArr];
        msg.push(arrivalMessage);
        dispatch(setMessageArr(msg));
    }, [arrivalMessage]);

    const handleClose = () => {
        dispatch(setSelectedContact(undefined));
    }

    const handleToggleEmogiKeyboard = () => {
        setOpenEmogiKeyboard((prevVal) => {
            return !prevVal;
        })
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    }

    const handleEmojiClick = (emoji) => {
        let msg = message;
        msg += emoji.emoji;
        setMessage(msg);
    }

    return (
        <div className='chat-box'>
            <div className="top">
                <div className="details">
                    <img src={avatarPath} alt="" />
                    <p>{userName}</p>
                </div>
                <div className="btns" onClick={handleClose}>
                    <RxCross2 />
                </div>
            </div>
            <div className="mid">
                <ChatContainer message={message} ref={socket} />
            </div>
            <div className="bottom">
                {openEmogiKeyboard && <EmogiPicker onSelect={handleEmojiClick} />}

                <div className="emogi" onClick={handleToggleEmogiKeyboard}>
                    <BsFillEmojiSmileFill />
                </div>

                <form onSubmit={handleSend} className="message-form">
                    <input type="text" className="message-input" placeholder='Enter Message' onChange={handleMessageChange} value={message} />
                    <button type='submit'><BsFillSendFill /></button>
                </form>

            </div>
        </div>
    )
}

export default ChatBox