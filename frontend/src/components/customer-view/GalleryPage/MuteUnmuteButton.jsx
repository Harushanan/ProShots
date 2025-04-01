import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

const MuteUnmuteButton = ({ isMuted, toggleSound }) => {
  return (
    <button
      className="sound-toggle-button"
      onClick={toggleSound}
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
    </button>
  );
};

export default MuteUnmuteButton;
