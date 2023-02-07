import React from "react";
import Picker from "emoji-picker-react";
import './styles.css'

const EmojiPicker = ({onEmojiClick}) => (
  <div className="emoji-picker">
    <Picker onEmojiClick={onEmojiClick} />
  </div>
);

export default EmojiPicker;