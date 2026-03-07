import React, { useState, useEffect, useRef } from "react";
import { unlockAchievement } from "./Achievements";
import AchievementNotification from "./AchievementNotification";

import fearGif from "../gif/fear.gif";
import cheatGif from "../gif/cheat.gif";
import shockGif from "../gif/shock.gif";
import congratulateGif from "../gif/congratulate.gif";

const cheatMessages = [
    "Hey! That's pasting, not typing.",
    "Congratulations, you know how to Ctrl+V.",
    "Error 418: I'm a teapot. Now, type the data!",
    "No achievement for pasting! Try typing.",
    "Access Denied: Manual keystrokes required.",
];

function getGifClass(gifSrc) {
    if (gifSrc === fearGif) return "gif-fear";
    if (gifSrc === cheatGif) return "gif-cheat";
    if (gifSrc === shockGif) return "gif-shock";
    if (gifSrc === congratulateGif) return "gif-congrats";
    return "";
}

const TypingChallenge = () => {
    const sentence =
        "Quickly execute the fuzzy POST request, avoiding all zero-day jabs.";

    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [finished, setFinished] = useState(false);
    const [showNotif, setShowNotif] = useState(null);
    const [pasted, setPasted] = useState(false);
    const [gifSrc, setGifSrc] = useState(null);
    const [isCongrats, setIsCongrats] = useState(false);

    const intervalRef = useRef(null);

    useEffect(() => {
        if (startTime && !finished) {
            intervalRef.current = setInterval(() => {
                setElapsed(((Date.now() - startTime) / 1000).toFixed(2));
            }, 50);
        }
        return () => clearInterval(intervalRef.current);
    }, [startTime, finished]);

    const handlePaste = (e) => {
        e.preventDefault();
        setPasted(true);
        const message = cheatMessages[Math.floor(Math.random() * cheatMessages.length)];
        setInput(message);
        setGifSrc(cheatGif);
        setIsCongrats(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if (!startTime && !pasted) {
            setStartTime(Date.now());
            setGifSrc(fearGif);
            setIsCongrats(false);
        }
        setInput(value);
        if (value === sentence && !finished && !pasted) {
            clearInterval(intervalRef.current);
            setFinished(true);
            const timeTaken = (Date.now() - startTime) / 1000;
            if (timeTaken <= 9) {
                unlockAchievement(5);
                setShowNotif("Like the Wind");
                setGifSrc(shockGif);
            } else {
                unlockAchievement(4);
                setShowNotif("I Can Type");
                setGifSrc(congratulateGif);
                setIsCongrats(true);
            }
        }
    };

    useEffect(() => {
        const handleReset = (e) => {
            if (e.shiftKey && e.key.toLowerCase() === "a") resetGame();
        };
        window.addEventListener("keydown", handleReset);
        return () => window.removeEventListener("keydown", handleReset);
    });

    const resetGame = () => {
        clearInterval(intervalRef.current);
        setInput("");
        setStartTime(null);
        setElapsed(0);
        setFinished(false);
        setPasted(false);
        setShowNotif(null);
        setGifSrc(null);
        setIsCongrats(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-['Poppins',sans-serif]">
            <h6 className="font-['Exo_2',sans-serif] text-[2rem] text-white font-bold text-center mb-8 mt-2">Start Typing</h6>
            <div className="relative w-full max-w-[600px] pt-[100px]">
                {gifSrc === fearGif && (
                    <img src={gifSrc} alt="reaction" className="reaction-gif gif-fear absolute top-3 left-4 z-[0] pointer-events-none w-[110px] h-auto" />
                )}
                {gifSrc === cheatGif && (
                    <img src={gifSrc} alt="reaction" className="reaction-gif gif-cheat absolute top-3 left-60 z-[0] pointer-events-none w-[110px] h-auto" />
                )}
                {gifSrc === shockGif && (
                    <img src={gifSrc} alt="reaction" className="reaction-gif gif-shock absolute top-2 left-60 z-[0] pointer-events-none w-[150px] h-[100px]" />
                )}
                {gifSrc === congratulateGif && (
                    <img src={gifSrc} alt="reaction" className="reaction-gif gif-congrats stay absolute top-[-10px] right-4 z-[0] pointer-events-none w-[110px] h-auto" />
                )}
                <div className="relative bg-[rgba(20,20,20,0.8)] border-2 border-[rgba(0,102,255,0.6)] rounded-[14px] z-[2] p-8 w-full [box-shadow:0_0_25px_rgba(0,102,255,0.25)] [backdrop-filter:blur(6px)]">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <small className="text-[0.85rem] text-[#bbb]">
                            Press <strong>Shift + A</strong> to restart
                        </small>
                        <div className="text-base text-[#00b7ff] font-semibold">{elapsed}s</div>
                    </div>
                    <p className="text-[1.1rem] font-medium mb-4 text-[#eee] leading-[1.6]">{sentence}</p>
                    <textarea
                        value={input}
                        onChange={handleChange}
                        onPaste={handlePaste}
                        placeholder="Start typing here..."
                        className="typing-input w-full h-[120px] bg-[#111] text-white border-2 border-[rgba(0,102,255,0.5)] rounded-[10px] p-[10px] text-base resize-none outline-none transition-[border,box-shadow] duration-300 font-['Poppins',sans-serif]"
                        spellCheck="false"
                        disabled={finished && !pasted}
                    />
                </div>
            </div>
            {showNotif && (
                <AchievementNotification
                    title="Achievement Unlocked"
                    description={showNotif}
                    onClose={() => setShowNotif(null)}
                />
            )}
        </div>
    );
};

export default TypingChallenge;
