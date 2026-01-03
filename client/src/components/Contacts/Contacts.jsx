import React, { useEffect, useState } from 'react'
import './Contacts.scss'
import axios from 'axios';
import Loader from '../Loader.jsx'
import { getAllContactsApi } from '../../apis/restapis.js';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedContact } from '../../store/contactSlice.js'

const Contacts = () => {
    
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [contactList, setContactList] = useState([]);


    const onlineContacts = useSelector((state)=>state.contact.onlineContacts);
    const selectedContact = useSelector((state)=>state.contact.selectedContact);

    const user = JSON.parse(localStorage.getItem('user-data'));

    const getAllContacts = async () => {
        try {
            const id = user._id;
            const url = getAllContactsApi + id;
            const response = await axios.get(url);
            setContactList(response.data);
            setIsLoading(false);
        }
        catch (err) {
            // console.log(err);
        }
    }

    useEffect(() => {
        getAllContacts();
    }, []);

    // console.log(contactList);
    // console.log(onlineContacts);


    const handleContactChange = (item) => {
        dispatch(setSelectedContact(item));
    }

    return (
        <>
            <div className="contacts-container">
                <div className="user-contacts">
                    {
                        isLoading
                            ?
                            <div className="loading">
                                <Loader />
                            </div>
                            :
                            contactList.length === 0
                            ?
                            <div className="loading">
                                <h3>Empty Contact List</h3>
                            </div>
                            :
                            contactList.map((item) => {
                                return (
                                    <div className={selectedContact!==undefined && selectedContact._id === item._id ? "contact active" : "contact"} key={item._id} onClick={()=>handleContactChange(item)}>
                                        <img src={item.avatarPath} alt="avatar"/>
                                        <p>{item.userName}</p>
                                        <span className='online' style ={{display : onlineContacts.includes(item._id) ? "block" : "none"}}></span>
                                    </div>
                                )
                            })
                    }
                </div>
                <div className="user">
                    <img src={user.avatarPath} alt="" />
                    <div className="details">
                        <p>{user.userName}</p>
                        <span>{user.email}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contacts