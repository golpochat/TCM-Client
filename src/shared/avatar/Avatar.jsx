import React from "react";
import './Avatar.css'

function Avatar(props) {
  return <img className="circle-img" src={`${process.env.REACT_APP_API}/uploads/images/${props.img}`} alt="profile" />;
}
export default Avatar;
