import React, { useEffect, useState } from "react";
import {
    Search,
    Eye,
    Type,
    Map,
    Zap,
    Award,
    Linkedin,
    Terminal,
    MousePointer,
    Volume2,
    Brain,
    ChevronsDown,
    Moon,
    Shield,
    Gamepad2
} from "lucide-react";
import AchievementNotification from "./AchievementNotification";

// Achievement data
const achievementsData = [
    { id: 1, icon: <Search size={26} />, title: "Hidden Seeker", description: "Discovered the secret achievements page.", difficulty: "Medium" },
    { id: 2, icon: <Eye size={26} />, title: "Recruiter's Eye", description: "You downloaded the resume.", difficulty: "Easy" },
    { id: 3, icon: <Map size={26} />, title: "Curious Explorer", description: "Explored my profile.", difficulty: "Easy" },
    { id: 4, icon: <Type size={26} />, title: "I Can Type", description: "Completed the typing challenge.", difficulty: "Easy" },
    { id: 5, icon: <Zap size={26} />, title: "Like the Wind", description: "Completed typing challenge under 9 seconds.", difficulty: "Hard" },
    { id: 6, icon: <Award size={26} />, title: "Master Collector", description: "Unlocked all achievements.", difficulty: "Hard" },
    { id: 7, icon: <MousePointer size={26} />, title: "Pixel Wanderer", description: "You explored every corner of the interface.", difficulty: "Easy" },
    { id: 8, icon: <Linkedin size={26} />, title: "Network Builder", description: "Visited my LinkedIn page.", difficulty: "Medium" },
    { id: 9, icon: <Terminal size={26} />, title: "Debugger's Intuition", description: "You opened console or inspected something.", difficulty: "Medium" },
    { id: 10, icon: <Volume2 size={26} />, title: "Noise Creator", description: "You triggered every sound or effect available.", difficulty: "Medium" },
    { id: 11, icon: <Brain size={26} />, title: "Matrix Explorer", description: "You discovered the hidden Matrix terminal.", difficulty: "Hard" },
    { id: 12, icon: <ChevronsDown size={26} />, title: "Scroll Warrior", description: "Scrolled all the way to the bottom.", difficulty: "Easy" },
    { id: 13, icon: <Moon size={26} />, title: "Night Owl", description: "You visited after midnight.", difficulty: "Medium" },
    { id: 14, icon: <Shield size={26} />, title: "Triple Threat", description: "Visited the portfolio 3 times.", difficulty: "Medium" },
    { id: 15, icon: <Gamepad2 size={26} />, title: "Konami Savant", description: "You know the code. ↑↑↓↓←→←→BA", difficulty: "Hard" },
];

// Helper to unlock an achievement
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
    const [recentUnlocked, setRecentUnlocked] = useState(null);

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
        const isNew = unlockAchievement(1);
        const data = JSON.parse(localStorage.getItem("achievements"));
        setUnlocked(data?.unlocked || []);

        if (isNew) {
            setRecentUnlocked("Hidden Seeker");
            setTimeout(() => setShowNoti(true), 400);
            const hideTimer = setTimeout(() => setShowNoti(false), 4000);
            return () => clearTimeout(hideTimer);
        }
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("achievements"));
        if (data) {
            const allUnlockedExceptMaster = achievementsData
                .filter((a) => a.id !== 6)
                .map((a) => a.id)
                .every((id) => data.unlocked.includes(id));

            if (allUnlockedExceptMaster && !data.unlocked.includes(6)) {
                unlockAchievement(6);
                const updated = JSON.parse(localStorage.getItem("achievements"));
                setUnlocked(updated?.unlocked || []);
                setRecentUnlocked("Master Collector");
                setShowNoti(true);
                setTimeout(() => setShowNoti(false), 5000);
            }
        }
    }, [unlocked]);

    return (
        <div className="mt-[10px] min-h-screen bg-black text-white text-center py-16 px-8 [animation:fadeIn_0.6s_ease-in-out]">
            <h1 className="text-[2.5rem] font-bold mb-4">Achievements</h1>
            <p className="max-w-[600px] mx-auto mb-12 text-[#aaa] text-base leading-[1.6rem]">
                Welcome, explorer! Here are some challenges and milestones to unlock as
                you interact with this portfolio. Can you collect them all?
            </p>

            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] gap-[1.8rem] justify-items-center">
                {achievementsData.map((a) => {
                    const isUnlocked = unlocked.includes(a.id);
                    return (
                        <div
                            key={a.id}
                            className={`relative w-full max-w-[280px] p-6 rounded-[14px] transition-all duration-300 overflow-hidden hover:-translate-y-[2px] ${isUnlocked ? 'bg-[rgba(255,255,255,0.12)] border border-white [box-shadow:0_0_12px_rgba(255,255,255,0.25)]' : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] [filter:grayscale(0.9)] opacity-50'}`}
                            title={isUnlocked ? "Unlocked!" : "Locked"}
                        >
                            <div className={`rounded-[10px] inline-flex p-[10px] mb-4 ${isUnlocked ? 'text-white bg-[rgba(255,255,255,0.2)]' : 'text-[#ccc] bg-[rgba(255,255,255,0.08)]'}`}>{a.icon}</div>
                            <h3 className="text-[1.1rem] mb-2">{a.title}</h3>
                            <p className="text-[0.9rem] text-[#ccc] mb-4">{a.description}</p>
                            <span className="absolute top-[10px] right-[12px] text-[0.75rem] py-[2px] px-2 rounded-[6px] uppercase tracking-[0.5px] bg-[rgba(62,59,59,0.84)] text-white">
                                {a.difficulty}
                            </span>
                            {!isUnlocked && (
                                <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] flex justify-center items-center text-[1.8rem] text-[#999] rounded-[14px]">
                                    <i className="fa-solid fa-lock"></i>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showNoti && recentUnlocked && (
                <AchievementNotification
                    title="Achievement Unlocked!"
                    description={recentUnlocked}
                    onClose={() => setShowNoti(false)}
                />
            )}
        </div>
    );
};

export default Achievements;
