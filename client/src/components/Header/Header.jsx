import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

    const OutSideClickHandler = (ref) => {
        useEffect(() => {
            const handleOutSideClick = (e) => {
                if (ref.current && !ref.current.contains(e.target)) {
                    setIsModalOpen(false);
                }
            }
            document.addEventListener('click', handleOutSideClick);

            return () => document.removeEventListener('click', handleOutSideClick);
        }, [ref])
    }

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
                    props.btnText === 'Sign Out'
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

export default Header