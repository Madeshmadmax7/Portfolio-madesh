import React, { useState } from 'react';

const ReactionTimer = () => {
const [message, setMessage] = useState('Tap to start');
const [start, setStart] = useState(null);
const [reactionTime, setReactionTime] = useState(null);
const [waiting, setWaiting] = useState(false);

const handleStart = () => {
    setMessage('Wait for green...');
    setWaiting(true);
    setReactionTime(null);

    const timeout = Math.floor(Math.random() * 5000) + 1000;

    setTimeout(() => {
    setMessage('Tap now!');
    setStart(Date.now());
    setWaiting(false);
    }, timeout);
};

const handleClick = () => {
    if (!start && !waiting) {
    handleStart();
    } else if (waiting) {
    setMessage('Start again.');
    setWaiting(false);
    } else if (start) {
    const end = Date.now();
    setReactionTime(end - start);
    setStart(null);
    setMessage('Tap to start');
    }
};

return (
    <div
        className="flex-1 max-w-[40%] bg-[#1a1a1a] text-[#e0e0e0] py-[50px] px-[30px] rounded-[15px] text-center cursor-pointer select-none transition-colors duration-300 flex flex-col justify-center"
        onClick={handleClick}
    >
    <h2 className="font-['Exo_2',sans-serif] text-[28px] font-bold mb-60 text-white">Reaction <span>Timer</span></h2>
    <div
        className={`py-10 px-5 border-2 rounded-[10px] transition-colors duration-300 text-[20px] min-h-[80px] flex items-center justify-center ${
            waiting ? 'border-[#444] bg-[#2a2a2a] text-[#f0f0f0]'
            : start  ? 'border-[#444] bg-[#28a745] text-white'
            :          'border-[#444] bg-[#2a2a2a] text-[#f0f0f0]'
        }`}
    >
        <p className="m-0 text-[18px] text-[#ccc]">{reactionTime ? `Your time: ${reactionTime} ms` : message}</p>
    </div>
    </div>
);
};

export default ReactionTimer;
