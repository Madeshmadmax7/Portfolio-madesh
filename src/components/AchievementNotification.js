import React, { useEffect, useState } from "react";
import "./AchievementNotification.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

const AchievementNotification = ({ title, description, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // small delay for animation trigger
    const showTimer = setTimeout(() => setVisible(true), 100);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 3500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  return (
    <div className={`achievement-noti ${visible ? "show" : "hide"}`}>
      <div className="noti-content">
        <div className="noti-icon">
          <FontAwesomeIcon icon={faTrophy} />
        </div>
        <div className="noti-text">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <button className="noti-close" onClick={handleClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default AchievementNotification;
