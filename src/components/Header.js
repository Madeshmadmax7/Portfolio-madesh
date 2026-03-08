import React, { useState, useEffect } from "react";
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
    const [visitorCount, setVisitorCount] = useState(null);

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

    useEffect(() => {
        fetch('https://api.countapi.xyz/hit/madeshdev/portfolio')
            .then(r => r.json())
            .then(d => setVisitorCount(d.value))
            .catch(() => {});
    }, []);

    const handleHover = () => {
        if (!blurUnlocked) {
            setIsBlurred(false);
            setBlurUnlocked(true);
            const isNew = unlockAchievement(3);
            if (isNew) setShowBlurNotif(true);
            localStorage.setItem("blurCleared", "true");
        }
    };

    const handleResumeClick = () => {
        if (!resumeUnlocked) {
            setResumeUnlocked(true);
            const isNew = unlockAchievement(2);
            if (isNew) setShowResumeNotif(true);
        }
    };

    const handleLinkedinVisit = () => {
        if (!linkedinVisited) {
            setLinkedinVisited(true);
            const isNew = unlockAchievement(8);
            if (isNew) setShowLinkedinNotif(true);
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
                const isNew = unlockAchievement(10);
                if (isNew) setShowMusicNotif(true);
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
        <header>
            <section className="min-h-screen pt-[80px] flex items-center">
                <div className="w-full px-[60px] flex items-center justify-between flex-wrap gap-8">
                    <div className="flex-1 min-w-[300px]">
                        <h1 className="text-[2.5rem] leading-[1.4] mb-4 font-bold">
                            Hello I'm{" "}
                            <span className="font-bold">
                                Madesh.
                                <span
                                    onClick={handleMusicClick}
                                    style={{
                                        marginLeft: "20px",
                                        cursor: "pointer",
                                        color: isPlaying ? "blue" : "#ccc",
                                        display: "inline-block",
                                        verticalAlign: "middle",
                                    }}
                                    title="Play / Pause music"
                                >
                                    <Music4 size={30} />
                                </span>
                            </span>
                            <br />
                            <span
                                className="font-bold cursor-pointer relative transition-colors duration-300"
                                onClick={() => setIsHighlighted(!isHighlighted)}
                            >
                                Full Stack{" "}
                                <span
                                    className="[-webkit-text-stroke:1.7px_rgb(17,0,255)] text-transparent font-bold"
                                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                                >
                                    Developer
                                </span>
                            </span>
                            <br />
                        </h1>

                        <p className={`hero-description text-[#aaaaaa] mb-6 max-w-[500px] leading-[23px] ${isHighlighted ? "highlighted" : ""}`}>
                            I'm a passionate <span className="desc-key">engineering student</span> with a focus on <span className="desc-key">creating</span>,
                            seamless, <span className="desc-key">full-stack solutions</span>. I bridge the gap between <span className="desc-key">great
                            design</span> and <span className="desc-key"> robust functionality</span> ,
                            <span className="desc-key">  building user-centered</span> applications that are both
                            intuitive and efficient.
                        </p>

                        <div className="flex gap-2">
                            <a href="https://github.com/Madeshmadmax7" target="_blank" rel="noopener noreferrer">
                                <button className="bg-transparent border border-[#888] p-[6px] rounded-[6px] cursor-pointer hover:bg-[#1f1f1f] transition-colors duration-200 text-white">
                                    <img src="/logos/githubw.svg" alt="GitHub" className="w-5 h-5 object-contain" />
                                </button>
                            </a>
                            <a href="https://linkedin.com/in/MadeshA" target="_blank" rel="noopener noreferrer" onClick={handleLinkedinVisit}>
                                <button className="bg-transparent border border-[#888] p-[6px] rounded-[6px] cursor-pointer hover:bg-[#1f1f1f] transition-colors duration-200 text-white">
                                    <img src="/logos/linkedinw.svg" alt="LinkedIn" className="w-5 h-5 object-contain" />
                                </button>
                            </a>
                            <a href="https://discord.com/users/1331216531362811968" target="_blank" rel="noopener noreferrer">
                                <button className="bg-transparent border border-[#888] p-[6px] rounded-[6px] cursor-pointer hover:bg-[#1f1f1f] transition-colors duration-200 text-white">
                                    <img src="/logos/discordw.svg" alt="Discord" className="w-5 h-5 object-contain" />
                                </button>
                            </a>
                            <a href="https://www.reddit.com/user/Madesh_A/" target="_blank" rel="noopener noreferrer">
                                <button className="bg-transparent border border-[#888] p-[6px] rounded-[6px] cursor-pointer hover:bg-[#1f1f1f] transition-colors duration-200 text-white">
                                    <img src="/logos/redditw.svg" alt="Reddit" className="w-5 h-5 object-contain" />
                                </button>
                            </a>
                            <a href="https://instagram.com/_mad_max_clicks_" target="_blank" rel="noopener noreferrer">
                                <button className="bg-transparent border border-[#888] p-[6px] rounded-[6px] cursor-pointer hover:bg-[#1f1f1f] transition-colors duration-200 text-white">
                                    <img src="/logos/instagramw.svg" alt="Instagram" className="w-5 h-5 object-contain" />
                                </button>
                            </a>
                            <a href="https://www.facebook.com/share/1HhfoL82CT/" target="_blank" rel="noopener noreferrer">
                                <button className="bg-transparent border border-[#888] p-[6px] rounded-[6px] cursor-pointer hover:bg-[#1f1f1f] transition-colors duration-200 text-white">
                                    <img src="/logos/facebookw.svg" alt="Facebook" className="w-5 h-5 object-contain" />
                                </button>
                            </a>
                        </div>

                        <div className="mt-4">
                            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" onClick={handleResumeClick}>
                                <button className="bg-[#1a1a1a] text-white mt-5 px-6 py-[10px] rounded-lg border border-[#555] cursor-pointer font-bold hover:bg-[#2a2a2a] transition-colors duration-200">
                                    <i className="fas fa-download mr-2"></i>
                                    Resume
                                </button>
                            </a>
                        </div>
                        {visitorCount && (
                            <div className="mt-4 inline-flex items-center gap-[6px] text-[11px] text-[#555] border border-[#2a2a2a] px-3 py-[5px] rounded-full">
                                <span className="w-[5px] h-[5px] rounded-full bg-[#444] animate-pulse inline-block"></span>
                                {visitorCount.toLocaleString()} visits
                            </div>
                        )}
                    </div>

                    {/* --- LEGO IMAGE --- */}
                    <div
                        className={`hero-image flex-1 min-w-[280px] flex justify-center items-center ${isBlurred ? "blurred" : ""}`}
                        onMouseEnter={handleHover}
                    >
                        <img src={meLego} alt="Madesh LEGO" className="w-full max-w-[420px] h-auto rounded-[12px]" />
                    </div>
                </div>
            </section>

            {/* --- Notifications --- */}
            {showBlurNotif && (
                <AchievementNotification title="Achievement Unlocked" description="Curious Explorer" onClose={() => setShowBlurNotif(false)} />
            )}
            {showResumeNotif && (
                <AchievementNotification title="Achievement Unlocked" description="Recruiter's Eye" onClose={() => setShowResumeNotif(false)} />
            )}
            {showLinkedinNotif && (
                <AchievementNotification title="Achievement Unlocked" description="Network Builder" onClose={() => setShowLinkedinNotif(false)} />
            )}
            {showMusicNotif && (
                <AchievementNotification title="Achievement Unlocked" description="Noise Creator" onClose={() => setShowMusicNotif(false)} />
            )}
        </header>
    );
};

export default Header;
