import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import './ChatContainer.scss'
import { useSelector, useDispatch } from 'react-redux';
import { setMessageArr } from '../../store/messageSlice';
import { getAllMessagesApi } from '../../apis/restapis';
import Loader from '../Loader';
const CryptoJS = require("crypto-js");


const ChatContainer = () => {
    
    const dispatch = useDispatch();
    const scrollRef = useRef();

    const CurrentUser = JSON.parse(localStorage.getItem('user-data'));
    const SelectedUser = useSelector((state) => state.contact.selectedContact);
    const messageArr = useSelector((state)=>state.messages.messageArr);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour : 'smooth'});
    }, [messageArr]);

    const getAllMessages = async () => {
        try {
            const response = await axios.post(getAllMessagesApi, {
                from: CurrentUser._id,
                to: SelectedUser._id,
            });
    
            if (response.status === 200) {
                // Decrypt and maintain the same structure
                response.data.forEach((message) => {
                    // Replace 'qweyrgwtwuigu' with your encryption secret key
                    const decryptedBytes = CryptoJS.AES.decrypt(message.message.message.text, 'qweyrgwtwuigu');
                    const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
                    
                    // Update the text field with the decrypted message
                    message.message.message.text = decryptedMessage;
                    
                    // console.log(message.message);
                    // console.log(decryptedMessage);
                });
            
    
                dispatch(setMessageArr(response.data));
                setIsLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    };
    
    // console.log(messageArr);

    useEffect(() => {
        getAllMessages()
    }, [SelectedUser]);


    return (
        <div className='chat-wrapper' >
            {
                isLoading
                    ?
                    <div className="loader">
                        <Loader />
                    </div>
                    :
                    <div className="messages">
                        {
                            messageArr.map((message) => {
                                // console.log(message.fromSelf) ;
                                return(
                                    <div className={message.fromSelf ? "message sended" : "message received"} key={message._id} ref={scrollRef}>
                                    <p>{message.message.message.text}</p>
                                </div>
                                )
                            })
                        }
                    </div>
            }
        </div>
    )
}

export default ChatContainer