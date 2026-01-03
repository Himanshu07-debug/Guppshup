import React from 'react'
import './Welcome.scss'
import robot from '../../assets/robot.gif'

const Welcome = () => {

    const user = JSON.parse(localStorage.getItem('user-data'));

  return (
    <div className='welcome'>
        <div className="robot">
            <img src={robot} alt="" draggable={false}/>
            <h1>Hello <span>{user.userName}</span> !!</h1>
            <h3>Start Messaging to Your Friends!!</h3>
        </div>
    </div>
  )
}

export default Welcome