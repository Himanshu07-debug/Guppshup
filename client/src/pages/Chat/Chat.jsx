import React, { useRef, useEffect} from 'react'
import Header from '../../components/Header/Header'
import './Chat.scss'
import Contacts from '../../components/Contacts/Contacts.jsx'
import ChatBox from '../../components/ChatBox/ChatBox'
import Welcome from '../../components/Welcome/Welcome'
import { useSelector, useDispatch } from 'react-redux'
import { setOnlineContacts } from '../../store/contactSlice'
import { io } from 'socket.io-client';
import { host } from '../../apis/restapis'


const Chat = () => {

  // selected Contact : which person from the contact list is selected for messaging 
  const selectedContact = useSelector((state) => state.contact.selectedContact);

  // Getting current User using local Storage
  const CurrentUser = JSON.parse(localStorage.getItem('user-data'));



  // Install socket.io-client npm package
  // Use useRef() hook
  const socket  = useRef();
  const dispatch = useDispatch();


  useEffect(() => {

    if (CurrentUser) {

        // host apna backend ka link hai, usase socket connection setup kar diye below line se
        socket.current = io(`${host}`);

        // Add this online user to the global Onlineusers map that we had set in the backend
        // This is to notify the server that this user with current id is now connected.
        socket.current.emit('add-user', CurrentUser._id);


        // console.log(socket);
    }
  }, []);


  // broadcasting the online users info from the backend 
  useEffect(() => {
    socket.current.on('online-users', (users) => {
      dispatch(setOnlineContacts(users));
    });
  }, [socket.current]);


  return (
    <>
      <Header linkTo={'/login'} btnText={"Sign Out"} />
      <div className='chat'>
        <div className="chat-container">
          <div className="contacts">
            <Contacts />
          </div>
          <div className="chat-box-wrapper">
            {
              selectedContact === undefined    // no contact selected for chat
                ?
                <Welcome />  
                :

                // Jaise hi left side me se Contact component ke koi bhi component pe click hua, state variable contact set ho jayega user ko..
                // and hence hume entry mil jayegi ChatBox me Jaane ki

                // Contact wla component dekhlo for clearity.. kaise onClick pe state variable change kar rhe hai

                <ChatBox contact={selectedContact} ref={socket}/> 

            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat