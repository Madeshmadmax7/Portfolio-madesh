import React, { useState, useEffect, useRef } from "react";
import "./TypingChallenge.css";
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
        <div className="typing-page">
            <div className="gif-container">
                {gifSrc && (
                    <img
                        src={gifSrc}
                        alt="reaction"
                        className={`reaction-gif ${isCongrats ? "stay" : ""} ${getGifClass(gifSrc)}`}
                    />
                )}
                <div className="typing-box">
                    <div className="typing-header">
                        <small className="reset-hint">
                            Press <strong>Shift + A</strong> to restart
                        </small>
                        <div className="timer">{elapsed}s</div>
                    </div>
                    <p className="sentence">{sentence}</p>
                    <textarea
                        value={input}
                        onChange={handleChange}
                        onPaste={handlePaste}
                        placeholder="Start typing here..."
                        className="typing-input"
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
