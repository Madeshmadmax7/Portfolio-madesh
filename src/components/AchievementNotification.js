import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

const AchievementNotification = ({ title, description, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
    <div className={`fixed left-1/2 z-[10000] transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] ${visible ? 'bottom-10 opacity-100 [transform:translateX(-50%)_translateY(0)]' : 'bottom-[-100px] opacity-0 [transform:translateX(-50%)_translateY(20px)]'}`}>
      <div className="flex items-center gap-4 bg-[#111] text-[#f5f5f5] py-4 px-[1.4rem] rounded-[10px] [box-shadow:0_0_15px_rgba(255,255,255,0.1)] min-w-[280px] border border-[#333]">
        <div className="text-[1.4rem] text-white">
          <FontAwesomeIcon icon={faTrophy} />
        </div>
        <div>
          <h3 className="text-base m-0 font-semibold text-white">{title}</h3>
          <p className="text-[0.85rem] m-0 text-[#aaa]">{description}</p>
        </div>
        <button className="bg-transparent border-none text-[#888] text-[1.1rem] cursor-pointer ml-auto transition-colors duration-200 hover:text-white" onClick={handleClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default AchievementNotification;
