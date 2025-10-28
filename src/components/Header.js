// src/components/Header.js
import React, { useState, useEffect } from "react";
import "./Header.css";
import meLego from "../profile-images/menewblue.jpg";
import { unlockAchievement } from "./Achievements";
import AchievementNotification from "./AchievementNotification";

const Header = () => {
    const [showBlurNotif, setShowBlurNotif] = useState(false);
    const [showResumeNotif, setShowResumeNotif] = useState(false);
    const [showLinkedinNotif, setShowLinkedinNotif] = useState(false);

    const [isBlurred, setIsBlurred] = useState(true);

    const [blurUnlocked, setBlurUnlocked] = useState(false);
    const [resumeUnlocked, setResumeUnlocked] = useState(false);
    const [linkedinVisited, setLinkedinVisited] = useState(false);

    useEffect(() => {
        const blurCleared = localStorage.getItem("blurCleared");
        if (blurCleared === "true") {
            setIsBlurred(false);
            setBlurUnlocked(true);
        } else {
            setIsBlurred(true); // restore blur if missing
            setBlurUnlocked(false);
        }
    }, []);

    // ✅ Handle blur unlock
    const handleHover = () => {
        if (!blurUnlocked) {
            setIsBlurred(false);
            setBlurUnlocked(true);
            unlockAchievement(3); // Curious Explorer
            setShowBlurNotif(true);
            localStorage.setItem("blurCleared", "true");
        }
    };

    // ✅ Handle resume click
    const handleResumeClick = () => {
        if (!resumeUnlocked) {
            setResumeUnlocked(true);
            unlockAchievement(2); // Recruiter’s Eye
            setShowResumeNotif(true);
        }
    };

    // ✅ Handle LinkedIn visit
    const handleLinkedinVisit = () => {
        if (!linkedinVisited) {
            setLinkedinVisited(true);
            unlockAchievement(8); // Network Builder
            setShowLinkedinNotif(true);
        }
    };

    // ✅ Hide notification automatically
    useEffect(() => {
        if (showBlurNotif || showResumeNotif || showLinkedinNotif) {
            const timer = setTimeout(() => {
                setShowBlurNotif(false);
                setShowResumeNotif(false);
                setShowLinkedinNotif(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [showBlurNotif, showResumeNotif, showLinkedinNotif]);

    return (
        <header className="header-wrapper">
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-text">
                        <h1>
                            Hello I’m <span className="bold">Madesh.</span>
                            <br />
                            <span className="bold">
                                Full Stack <span className="stroke-text">Developer</span>
                            </span>
                            <br />
                        </h1>
                        <p>
                            I’m a passionate engineering student with a focus on creating
                            seamless, full-stack solutions. I bridge the gap between great
                            design and robust functionality, building user-centered
                            applications that are both intuitive and efficient.
                        </p>

                        {/* --- Social Links --- */}
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
        </header>
    );
};

export default Header;
