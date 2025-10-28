import React, { useEffect, useState } from "react";
import { Award, Map, Search, Type, Zap, Eye , Linkedin } from "lucide-react";
import "./Achievements.css";
import AchievementNotification from "./AchievementNotification";

const achievementsData = [
    { id: 1, icon: <Search size={26} />, title: "Hidden Seeker", description: "Discovered the secret achievements page.", difficulty: "Medium" },
    { id: 2, icon: <Eye size={26} />, title: "Recruiter’s Eye", description: "You downloaded the resume.", difficulty: "Easy" },
    { id: 4, icon: <Type size={26} />, title: "I Can Type", description: "Completed the typing challenge.", difficulty: "Easy" },
    { id: 3, icon: <Map size={26} />, title: "Curious Explorer", description: "Explored my profile.", difficulty: "Easy" },
    { id: 5, icon: <Zap size={26} />, title: "Like the Wind", description: "Completed typing challenge under 9 seconds.", difficulty: "Hard" },
    { id: 8, icon: <Linkedin size={26} />, title: "Network Builder", description: "Visited my LinkedIn page.", difficulty: "Medium" },
    { id: 6, icon: <Award size={26} />, title: "Master Collector", description: "Unlocked all achievements.", difficulty: "Hard" },

];

export const unlockAchievement = (id) => {
    const data = JSON.parse(localStorage.getItem("achievements")) || {
        unlocked: [],
        lastUpdated: Date.now(),
    };

    if (!data.unlocked.includes(id)) {
        data.unlocked.push(id);
        data.lastUpdated = Date.now();
        localStorage.setItem("achievements", JSON.stringify(data));
        return true;
    }
    return false;
};



const Achievements = () => {
    const [unlocked, setUnlocked] = useState([]);
    const [showNoti, setShowNoti] = useState(false);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("achievements"));
        if (data) {
            const now = Date.now();
            const days30 = 30 * 24 * 60 * 60 * 1000;
            if (now - data.lastUpdated > days30) {
                localStorage.removeItem("achievements");
            } else {
                setUnlocked(data.unlocked || []);
            }
        }
    }, []);

    useEffect(() => {
        // unlock when visiting page
        const isNew = unlockAchievement(1);
        const data = JSON.parse(localStorage.getItem("achievements"));
        setUnlocked(data?.unlocked || []);

        // show notification only if newly unlocked
        if (isNew) {
            setTimeout(() => setShowNoti(true), 400);
            const hideTimer = setTimeout(() => setShowNoti(false), 4000);
            return () => clearTimeout(hideTimer);
        }
    }, []);

    // 🏆 ADD THIS EFFECT HERE
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("achievements"));
        if (data) {
            const allUnlocked = achievementsData
                .map(a => a.id)
                .every(id => data.unlocked.includes(id));

            if (allUnlocked && !data.unlocked.includes(6)) {
                unlockAchievement(6);
                setShowNoti(true);
                const updated = JSON.parse(localStorage.getItem("achievements"));
                setUnlocked(updated?.unlocked || []);
            }
        }
    }, [unlocked]);

    return (
        <div className="achievements-page">
            <h1>Achievements</h1>
            <p className="achievements-intro">
                Welcome, explorer! Here are some challenges and milestones to unlock as
                you interact with this portfolio. Can you collect them all?
            </p>

            <div className="achievements-grid">
                {achievementsData.map((a) => {
                    const isUnlocked = unlocked.includes(a.id);
                    return (
                        <div
                            key={a.id}
                            className={`achievement-card ${isUnlocked ? "unlocked" : "locked"}`}
                            title={isUnlocked ? "Unlocked!" : "Locked"}
                        >
                            <div className="achievement-icon">{a.icon}</div>
                            <h3>{a.title}</h3>
                            <p>{a.description}</p>
                            <span className={`difficulty ${a.difficulty.toLowerCase()}`}>
                                {a.difficulty}
                            </span>
                            {!isUnlocked && (
                                <div className="lock-overlay">
                                    <i className="fa-solid fa-lock"></i>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showNoti && (
                <AchievementNotification
                    title="Achievement Unlocked"
                    description="Hidden Seeker"
                    onClose={() => setShowNoti(false)}
                />
            )}
        </div>
    );
};

export default Achievements;
