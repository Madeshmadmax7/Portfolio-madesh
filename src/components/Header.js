import React, { useState, useEffect } from "react";
import "./Header.css";
import meLego from "../profile-images/menewblue.jpg";
import { unlockAchievement } from "./Achievements";
import AchievementNotification from "./AchievementNotification";
import { Music4 } from "lucide-react";


const Header = () => {
    const [showBlurNotif, setShowBlurNotif] = useState(false);
    const [showResumeNotif, setShowResumeNotif] = useState(false);
    const [showLinkedinNotif, setShowLinkedinNotif] = useState(false);
    const [showMusicNotif, setShowMusicNotif] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    const [isBlurred, setIsBlurred] = useState(true);
    const [blurUnlocked, setBlurUnlocked] = useState(false);
    const [resumeUnlocked, setResumeUnlocked] = useState(false);
    const [linkedinVisited, setLinkedinVisited] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [songUnlocked, setSongUnlocked] = useState(false);

    const songs = [
        "/songs/song1.mp3",
        "/songs/song2.mp3"
    ];

    useEffect(() => {
        const blurCleared = localStorage.getItem("blurCleared");
        if (blurCleared === "true") {
            setIsBlurred(false);
            setBlurUnlocked(true);
        }

        if (window.globalAudio) {
            setIsPlaying(!window.globalAudio.paused);
        }
    }, []);

    const handleHover = () => {
        if (!blurUnlocked) {
            setIsBlurred(false);
            setBlurUnlocked(true);
            unlockAchievement(3);
            setShowBlurNotif(true);
            localStorage.setItem("blurCleared", "true");
        }
    };

    const handleResumeClick = () => {
        if (!resumeUnlocked) {
            setResumeUnlocked(true);
            unlockAchievement(2);
            setShowResumeNotif(true);
        }
    };

    const handleLinkedinVisit = () => {
        if (!linkedinVisited) {
            setLinkedinVisited(true);
            unlockAchievement(8);
            setShowLinkedinNotif(true);
        }
    };

    const handleMusicClick = () => {
        if (!window.globalAudio) {
            window.globalAudio = new Audio(songs[0]);
            window.globalAudio.volume = 0.5;
            window.globalAudio.currentIndex = 0;
            window.globalAudio.onended = () => (setIsPlaying(false));
        }

        const player = window.globalAudio;

        if (!isPlaying) {
            // ▶️ Play next song in the list
            player.currentIndex = (player.currentIndex + 1) % songs.length;
            player.src = songs[player.currentIndex];
            player.play();
            setIsPlaying(true);

            if (!songUnlocked) {
                setSongUnlocked(true);
                unlockAchievement(10);
                setShowMusicNotif(true);
            }
        } else {
            // ⏸️ Pause current song
            player.pause();
            setIsPlaying(false);
        }
    };

    // 🕒 Auto-hide notifications
    useEffect(() => {
        if (showBlurNotif || showResumeNotif || showLinkedinNotif || showMusicNotif) {
            const timer = setTimeout(() => {
                setShowBlurNotif(false);
                setShowResumeNotif(false);
                setShowLinkedinNotif(false);
                setShowMusicNotif(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [showBlurNotif, showResumeNotif, showLinkedinNotif, showMusicNotif]);

    return (
        <header className="header-wrapper">
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-text">
                        <h1>
                            Hello I’m{" "}
                            <span className="bold">
                                Madesh.
                                <span
                                    className="music-icon"
                                    onClick={handleMusicClick}
                                    style={{
                                        marginLeft: "20px",
                                        cursor: "pointer",
                                        color: isPlaying ? "blue" : "#ccc",
                                    }}
                                    title="Play / Pause music"
                                >
                                    <Music4 size={30} />
                                </span>
                            </span>
                            <br />
                            <span
                                className="bold highlight-trigger"
                                onClick={() => setIsHighlighted(!isHighlighted)}
                            >
                                Full Stack <span className="stroke-text">Developer</span>
                            </span>

                            <br />
                        </h1>

                        <p className={`hero-description ${isHighlighted ? "highlighted" : ""}`}>
                            I’m a passionate <span className="desc-key">engineering student</span> with a focus on <span className="desc-key">creating</span>, 
                            seamless, <span className="desc-key">full-stack solutions</span>. I bridge the gap between <span className="desc-key">great
                            design</span> and <span className="desc-key"> robust functionality</span> ,
                            <span className="desc-key">  building user-centered</span> applications that are both
                            intuitive and efficient.
                        </p>


                        <div className="social-icons">
                            <a
                                href="https://github.com/Madeshmadmax7"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button>
                                    <img
                                        src="/logos/githubw.svg"
                                        alt="GitHub"
                                        className="social-icon"
                                    />
                                </button>
                            </a>

                            <a
                                href="https://linkedin.com/in/MadeshA"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleLinkedinVisit}
                            >
                                <button>
                                    <img
                                        src="/logos/linkedinw.svg"
                                        alt="LinkedIn"
                                        className="social-icon"
                                    />
                                </button>
                            </a>

                            <a
                                href="https://discord.com/users/1331216531362811968"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button>
                                    <img
                                        src="/logos/discordw.svg"
                                        alt="Discord"
                                        className="social-icon"
                                    />
                                </button>
                            </a>

                            <a
                                href="https://www.reddit.com/user/Madesh_A/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button>
                                    <img
                                        src="/logos/redditw.svg"
                                        alt="Reddit"
                                        className="social-icon"
                                    />
                                </button>
                            </a>

                            <a
                                href="https://instagram.com/_mad_max_clicks_"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button>
                                    <img
                                        src="/logos/instagramw.svg"
                                        alt="Instagram"
                                        className="social-icon"
                                    />
                                </button>
                            </a>

                            <a
                                href="https://www.facebook.com/share/1HhfoL82CT/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button>
                                    <img
                                        src="/logos/facebookw.svg"
                                        alt="Facebook"
                                        className="social-icon"
                                    />
                                </button>
                            </a>
                        </div>

                        <div className="resume-section">
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleResumeClick}
                            >
                                <button className="resume-btn">
                                    <i className="fas fa-download resume-icon"></i>
                                    Resume
                                </button>
                            </a>
                        </div>
                    </div>

                    {/* --- LEGO IMAGE --- */}
                    <div
                        className={`hero-image ${isBlurred ? "blurred" : ""}`}
                        onMouseEnter={handleHover}
                    >
                        <div className="image-wrapper">
                            <img src={meLego} alt="Madesh LEGO" className="lego-img" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Notifications --- */}
            {showBlurNotif && (
                <AchievementNotification
                    title="Achievement Unlocked"
                    description="Curious Explorer"
                    onClose={() => setShowBlurNotif(false)}
                />
            )}
            {showResumeNotif && (
                <AchievementNotification
                    title="Achievement Unlocked"
                    description="Recruiter’s Eye"
                    onClose={() => setShowResumeNotif(false)}
                />
            )}
            {showLinkedinNotif && (
                <AchievementNotification
                    title="Achievement Unlocked"
                    description="Network Builder"
                    onClose={() => setShowLinkedinNotif(false)}
                />
            )}
            {showMusicNotif && (
                <AchievementNotification
                    title="Achievement Unlocked"
                    description="Noise Creator"
                    onClose={() => setShowMusicNotif(false)}
                />
            )}
        </header>
    );
};

export default Header;
