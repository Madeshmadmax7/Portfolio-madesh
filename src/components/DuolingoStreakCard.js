import React, { useEffect, useRef, useState } from "react";
import streakMilestoneImage from "../gif/Duolingo_streak.webp";

const AUTO_REFRESH_MS = 30 * 60 * 1000;
const DUOLINGO_ENDPOINT = import.meta.env.DEV
    ? "/api/duolingo/users"
    : "/.netlify/functions/duolingo-profile";

function useBubbleScroll(outerRef, innerRef, locked) {
    useEffect(() => {
        const PADDING  = 24;
        const LERP     = 0.010;

        let current  = 0;
        let target   = 0;
        let rafId    = null;

        const calcTarget = () => {
            if (locked) return;
            const outer = outerRef.current;
            const inner = innerRef.current;
            if (!outer || !inner) return;

            const outerRect = outer.getBoundingClientRect();
            const innerH    = inner.offsetHeight;
            const maxSlide  = Math.max(0, outerRect.height - PADDING * 2 - innerH);

            // progress: 0 while card top is visible, grows as card scrolls past viewport top
            const scrolledPast = Math.max(0, PADDING - outerRect.top);
            const progress     = Math.min(1, scrolledPast / Math.max(1, maxSlide));

            // ease-out curve
            const eased = 1 - Math.pow(1 - progress, 2);

            // hard clamp target — never beyond bottom border
            target = Math.min(eased * maxSlide, maxSlide);
        };

        const tick = () => {
            // lerp: close 6% of the gap per frame (~60fps)
            current += (target - current) * LERP;

            // stop rAF when close enough to avoid idle repaints
            const diff = Math.abs(target - current);
            if (diff < 0.05) current = target;

            const inner = innerRef.current;
            if (inner) inner.style.transform = `translateY(${current}px)`;

            if (diff > 0.05) rafId = requestAnimationFrame(tick);
            else rafId = null;
        };

        const onScroll = () => {
            calcTarget();
            if (rafId === null) rafId = requestAnimationFrame(tick);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        // initialise on mount
        calcTarget();
        rafId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [outerRef, innerRef, locked]);
}


const DuolingoStreakCard = ({ username = "MadeshA5", compact = false, showTitle = true }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const [lastUpdated, setLastUpdated] = useState(null);

    const outerRef = useRef(null);
    const innerRef = useRef(null);
    const [locked, setLocked] = useState(false);
    useBubbleScroll(outerRef, innerRef, locked);

    useEffect(() => {
        let mounted = true;

        const fetchDuolingoData = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`${DUOLINGO_ENDPOINT}?username=${encodeURIComponent(username)}`);
                if (!res.ok) {
                    throw new Error(`Request failed (${res.status})`);
                }

                const data = await res.json();
                const user = data?.user || data?.users?.[0];
                if (!user) {
                    throw new Error("Duolingo profile not found.");
                }

                if (!mounted) return;

                setProfile({
                    username: user.username || username,
                    name: user.name || user.username || username,
                    avatar: user.picture
                        ? (user.picture.startsWith("http") ? user.picture : `https:${user.picture}`)
                        : "",
                    streak: Number(user.streak || 0),
                    totalXp: Number(user.totalXp || 0),
                    learningLanguage: user.learningLanguage || "",
                });
                setLastUpdated(new Date());
            } catch (err) {
                if (!mounted) return;
                setError(err?.message || "Could not load Duolingo streak.");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchDuolingoData();
        const intervalId = setInterval(fetchDuolingoData, AUTO_REFRESH_MS);

        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, [username, reloadKey]);

    const profileUrl = `https://www.duolingo.com/profile/${username}`;

    if (loading) {
        return (
            <div className={`w-full ${compact ? "py-2" : "min-h-screen pt-[100px] pb-[40px]"} flex justify-center items-center`}>
                <div className={`w-full ${compact ? "max-w-none px-0" : "max-w-[925px] px-[2.5rem]"} animate-pulse`}>
                    <div className="h-7 w-44 bg-white/10 rounded-md mx-auto mb-10"></div>
                    <div className="rounded-[1rem] border border-[rgba(105,105,105,0.3)] bg-[rgba(0,0,0,0.76)] overflow-hidden">
                        <div className="h-14 border-b border-white/5"></div>
                        <div className="p-8 space-y-4">
                            <div className="h-4 w-48 bg-white/10 rounded"></div>
                            <div className="h-16 w-full bg-white/5 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full ${compact ? "py-2 h-full flex flex-col" : "min-h-screen pt-[100px] pb-[40px] flex justify-center items-center"} bg-transparent`}>
            <div className={`relative w-full ${compact ? "max-w-none rounded-xl px-0 pb-0 flex flex-col flex-1" : "max-w-[925px] rounded-[1.5rem] px-[2.5rem] pb-[3.5rem]"} overflow-hidden mx-auto box-border`}>
                {showTitle && !compact && (
                    <h6 className="font-['Exo_2',sans-serif] text-[2rem] text-white font-bold text-center mt-20 mb-8 tracking-[0.01em]">
                        Duolingo Streak
                    </h6>
                )}

                <div className={`relative z-[10] rounded-[1rem] border-2 border-double border-[rgba(105,105,105,0.5)] bg-[rgba(0,0,0,0.76)] text-[rgba(255,255,255,0.98)] box-border ${compact ? "flex flex-col flex-1 overflow-hidden" : "overflow-hidden"}`}>
                    <div className="relative flex items-center h-14 px-6 gap-2 border-b border-[rgba(105,105,105,0.25)]">
                        <div
                            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-between gap-2 min-w-[290px] py-1 px-2 rounded-lg border-2 border-[rgba(105,105,105,0.3)] bg-[rgba(115,115,115,0.15)]"
                            style={{ cursor: "pointer" }}
                        >
                            <svg
                                className="w-3.5 h-3.5 opacity-70"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                onClick={() => setLocked(l => !l)}
                                title={locked ? "Unlock scroll" : "Lock scroll"}
                                style={{ cursor: "pointer", opacity: locked ? 1 : 0.7 }}
                            >
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                {locked
                                    ? <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    : <path d="M7 11V7a5 5 0 1 1 9.9-1" />
                                }
                            </svg>
                            <div
                                className="text-xs opacity-70"
                                style={{ flex: 1, textAlign: "center" }}
                                onClick={() => window.open(profileUrl, "_blank")}
                            >
                                duolingo.com/profile/{username}
                            </div>
                            <svg
                                className="w-3.5 h-3.5 opacity-70"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                style={{ cursor: "pointer" }}
                                onClick={() => setReloadKey(k => k + 1)}
                            >
                                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                                <path d="M21 3v5h-5"></path>
                            </svg>
                        </div>
                    </div>


                    <div
                        ref={outerRef}
                        className={`${compact ? "flex-1 overflow-hidden px-4 py-6" : "px-6 pt-6 pb-6"}`}
                        style={compact ? {} : { position: "relative", minHeight: "520px" }}>
                        {error ? (
                            <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        ) : (
                            <div
                                ref={innerRef}
                                className="w-full rounded-[1.5rem] border border-[rgba(105,105,105,0.35)] bg-[#060606] text-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                                style={{ willChange: "transform", transition: "transform 0.05s linear" }}
                            >
                                <div className="rounded-[1.25rem] overflow-hidden bg-black">
                                    <img
                                        src={streakMilestoneImage}
                                        alt="Duolingo streak milestone"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>

                                <div className="text-center pt-3 pb-1">
                                    <div className="inline-flex items-center justify-center px-2 py-1">
                                        <div
                                            className="text-[4.6rem] leading-[0.9]"
                                            style={{
                                                color: "#f59e0b",
                                                fontFamily: "'Exo 2', sans-serif",
                                                fontWeight: 900,
                                                letterSpacing: "-0.03em",
                                                lineHeight: "0.9",
                                                textShadow: "none",
                                            }}
                                        >
                                            {profile?.streak}
                                        </div>
                                    </div>
                                    <div
                                        className="text-[2rem] leading-none mt-2"
                                        style={{
                                            color: "#ffffff",
                                            letterSpacing: "-0.005em",
                                            fontFamily: "'Exo 2', sans-serif",
                                            fontWeight: 800,
                                        }}
                                    >
                                        day streak!
                                    </div>
                                    
                                </div>

                                <div className="mt-4 rounded-[1rem] bg-[rgba(115,115,115,0.12)] p-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="opacity-75">XP</span>
                                        <span className="font-semibold">{profile?.totalXp}</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="opacity-75">Learning</span>
                                        <span className="font-semibold">{profile?.learningLanguage ? profile.learningLanguage.toUpperCase() : "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="opacity-75">Profile</span>
                                        <span className="font-semibold">@{profile?.username}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {compact ? null : (
                        <div className="border-t border-t-[rgba(105,105,105,0.25)] py-3 px-6 text-xs opacity-50 flex justify-between">
                            <span>Auto refresh every 30 minutes</span>
                            <span>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ""}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DuolingoStreakCard;