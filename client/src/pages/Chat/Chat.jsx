import React, { useRef, useEffect} from 'react'
import Header from '../../components/Header/Header.jsx'
import './Chat.scss'
import Contacts from '../../components/Contacts/Contacts.jsx'
import ChatBox from '../../components/ChatBox/ChatBox.jsx'
import Welcome from '../../components/Welcome/Welcome.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { setOnlineContacts } from '../../store/contactSlice.js'
import { io } from 'socket.io-client';
import { host } from '../../apis/restapis.js'


const Chat = () => {

  const selectedContact = useSelector((state) => state.contact.selectedContact);
  const CurrentUser = JSON.parse(localStorage.getItem('user-data'));
  const socket  = useRef();
  const dispatch = useDispatch();

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
}, []);

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
              selectedContact === undefined
                ?
                <Welcome />
                :
                <ChatBox contact={selectedContact} ref={socket}/>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat