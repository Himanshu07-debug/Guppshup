import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { FaPlus } from 'react-icons/fa'
import './SearchBar.scss'
import { addContactApi, searchApi } from '../../apis/restapis';
import { toast } from 'react-toastify';

const SearchBar = () => {

    const modalRef = useRef(null);

    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchedResult, setSearchedResult] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [user, setUser] = useState({});

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

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user-data'));
        setUser(userData);
    }, [])

    const handleChange = (e) => {
        setSearchModalOpen(true);
        setSearchKeyword(e.target.value);
    }

    const search = async () => {
        try {
            const response = await axios.get(`${searchApi}${searchKeyword}`);
            setSearchedResult(response.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (searchKeyword.length >= 3) {
            search();
        }
        else {
            setSearchedResult([]);
        }
    }, [searchKeyword]);

    const handleAddContact = async (contactId, userName) => {
        try {

            const response = await axios.put(`${addContactApi}${user._id}/${contactId}`);
            // console.log(response);
            if (response.status === 200) {
                localStorage.setItem('user-data', JSON.stringify(response.data));
                toast.success(`${userName} added to contacts.`, toastOptions);
            }
        }catch (err) {
            if(err.response){
                if (err.response.status === 400) {
                    toast.warn(`${userName} is already in contact list!!`);
                }
            }
        }
    }

    const OutSideClickHandler = (ref) => {
        useEffect(() => {
            const handleOutSideClick = (e) => {
                if (ref.current && !ref.current.contains(e.target)) {
                    setSearchModalOpen(false);
                }
            }
            document.addEventListener('click', handleOutSideClick);

            return () => document.removeEventListener('click', handleOutSideClick);
        }, [ref])
    }

    OutSideClickHandler(modalRef);

    // console.log(user);
    return (
        <div className='search-bar'>
            <div className="search-input">
                <input type="search" placeholder='Enter User Name' onChange={handleChange} value={searchKeyword} />
            </div>
            {
                searchModalOpen
                &&
                <div className="search-modal" ref={modalRef}>
                    {
                        searchedResult.length === 0
                        &&
                        <div className="item">
                            <p>No User Found!!</p>
                        </div>
                    }
                    {
                        searchedResult.map((item) => {
                            return (
                                <div className="item" key={item._id}>
                                    <img src={item.avatarPath} alt="avatar" />
                                    <p>{item.userName}</p>
                                    <span onClick={() => handleAddContact(item._id, item.userName)}><FaPlus /></span>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

export default SearchBar