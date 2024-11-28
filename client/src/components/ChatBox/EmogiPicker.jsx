import React from 'react'
import './EmogiPicker.scss';
import EmojiPicker from 'emoji-picker-react'



const EmogiPicker = ({onSelect}) => {

  const handleClick = (emoji) => {
    onSelect(emoji);
  }
  return (
    <div className='emogi-keyboard' >
      <EmojiPicker onEmojiClick = {handleClick}/>
    </div>
  )
}

export default EmogiPicker