import React from "react";
import "./HomeScreen.css";
import VideoChatForm from "../videochatapp/VideoChatForm";
import PropTypes from "prop-types";
export default function HomeScreen({ onCreateNewRoom }) {
  // const createCall = (postData) => {
  //   onCreateNewRoom(postData);
  // };

  return (
    <div className="home-screen">
      <h1>Makai Video Conferencing</h1>
      <VideoChatForm onSubmit={onCreateNewRoom} />
      <p className="small">
        Select “Allow” to use your camera and mic for this call if prompted
      </p>
    </div>
  );
}
HomeScreen.propTypes = {
  onCreateNewRoom: PropTypes.func,
};
