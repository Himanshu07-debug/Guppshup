import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Header.scss'
import { Comment } from 'react-loader-spinner'
import { useDispatch } from 'react-redux'
import { setIsLoggedIn } from '../../store/userSlice'
import SearchBar from '../SearchBar/SearchBar'

const Header = (props) => {

    const modalRef = useRef(null);
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const [user, setUser] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();


    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user-data'));
        setUser(userData);
    }, [])

    const handleLogOut = () => {
        if (props.btnText === 'Sign Out') {
            localStorage.removeItem('user-data');
            dispatch(setIsLoggedIn(false));
        }
        Navigate(`${props.linkTo}`)
        return;
    }

    const toggleModal = () => {
        setIsModalOpen((prevVal) => {
            return !prevVal;
        })
    }

    // this ensures that the model is closed, whenever we click anywhere outside the model
    const OutSideClickHandler = (ref) => {
        useEffect(() => {
            const handleOutSideClick = (e) => {
                if (ref.current && !ref.current.contains(e.target)) {  // !ref.current.contains(e.target) -> click model pe nhi hua hai
                    setIsModalOpen(false);
                }
            }
            document.addEventListener('click', handleOutSideClick);

            // Cleanup: 
            // This line removes the event listener that was added to the document when the component either unmounts or re-renders with a 
            // different ref.
            // ensures that memory leak is not there
            return () => document.removeEventListener('click', handleOutSideClick);
            
        }, [ref])
    }


    // use of ref ?
    // 1. The ref is used to point to the DOM element (e.g., the modal). The event listener checks if the click happened outside this element 
    // using ref.current.
    // 2. ref is essential when you need to directly interact with a DOM element, especially in cases like modals, dropdowns, or input focus.

    

    OutSideClickHandler(modalRef);

    return (
        <div className='header'>
            <div  className="brand">
                <Link to='/' className="logo">
                    <Comment
                        visible={true}
                        height="60"
                        width="60"
                        ariaLabel="comment-loading"
                        wrapperStyle={{}}
                        wrapperClass="comment-wrapper"
                        color="#fff"
                        backgroundColor="#7838b4"
                    />
                    <h1>Gup<span>Shup</span></h1>
                </Link>
                {
                    props.btnText === 'Sign Out' && location.pathname !== '/avatar'
                    &&
                    <SearchBar />
                }
            </div>
            <div className="btns">
                {
                    props.btnText === 'Sign Out'
                    &&
                    <div className="avatar" onClick={toggleModal} ref={modalRef}>
                        <img src={user.avatarPath} alt="" />
                        {
                            isModalOpen
                            &&
                            <div className="modal">
                                <Link to='/avatar' className='modal-link'>Avatars</Link>
                                <span className='modal-link' onClick={handleLogOut}>Sign Out</span>
                            </div>
                        }
                    </div>
                }
                {/* {props.btnText === 'Sign Out' && <Link className="video-icon" to='/video'><FaVideo /></Link>} */}
                {props.btnText !== 'Sign Out' && <Link className='link' to={props.linkTo}>{props.btnText}</Link>}
            </div>


        </div>
    )
}

export default Header;