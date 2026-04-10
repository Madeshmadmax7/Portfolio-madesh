import React, { useEffect, useMemo, useState } from "react";
import GitHubCalendar from "react-github-contribution-calendar";

const AUTO_REFRESH_MS = 30 * 60 * 1000;
const LEETCODE_GRAPHQL = import.meta.env.DEV
    ? "/api/leetcode/graphql"
    : "/.netlify/functions/leetcode-graphql";

// Previous providers kept for reference (fallback-ready if needed again):
// const LEETCODE_STATS_PRIMARY = "https://leetcode-api-faisalshohag.vercel.app";
// const LEETCODE_STATS_FALLBACK = "https://leetcode-stats-api.herokuapp.com";
// const LEETCODE_PROFILE_FALLBACK = "https://alfa-leetcode-api.onrender.com";

const LEETCODE_PROFILE_AND_CALENDAR_QUERY = `
    query ProfileAndCalendar($username: String!, $year: Int!) {
        allQuestionsCount {
            difficulty
            count
        }
        matchedUser(username: $username) {
            username
            profile {
                realName
                userAvatar
                ranking
                reputation
                school
                company
                countryName
            }
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
                totalSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }
            userCalendar(year: $year) {
                submissionCalendar
                activeYears
                totalActiveDays
                streak
            }
        }
    }
`;

const LEETCODE_YEAR_CALENDAR_QUERY = `
    query YearCalendar($username: String!, $year: Int!) {
        matchedUser(username: $username) {
            userCalendar(year: $year) {
                submissionCalendar
            }
        }
    }
`;

const toIsoDate = date => date.toISOString().slice(0, 10);

const toDateFromUnixSeconds = unixSeconds => {
    const ms = Number(unixSeconds) * 1000;
    if (!Number.isFinite(ms)) return null;
    return new Date(ms);
};

const parseSubmissionCalendar = calendarInput => {
    if (!calendarInput) return {};

    let calendarObj = calendarInput;
    if (typeof calendarInput === "string") {
        try {
            calendarObj = JSON.parse(calendarInput);
        } catch {
            return {};
        }
    }

    if (typeof calendarObj !== "object" || calendarObj === null) {
        return {};
    }

    const values = {};
    Object.entries(calendarObj).forEach(([unixSeconds, count]) => {
        const date = toDateFromUnixSeconds(unixSeconds);
        if (!date || Number.isNaN(date.getTime())) return;
        values[toIsoDate(date)] = Number(count) || 0;
    });

    return values;
};

const getStatValue = (list, difficulty, field = "count") => {
    return Number(list?.find(item => item?.difficulty === difficulty)?.[field] || 0);
};

const getAcceptance = (acceptedSubmissions, totalSubmissions) => {
    if (!totalSubmissions) return null;
    return Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(2));
};

const fetchJsonOrThrow = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
    }
    return res.json();
};

const fetchLeetCodeGraphQL = async (query, variables) => {
    const payload = await fetchJsonOrThrow(LEETCODE_GRAPHQL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });

    if (payload?.errors?.length) {
        throw new Error(payload.errors[0]?.message || "GraphQL request failed");
    }

    return payload?.data;
};

const LeetCodeStatsCard = ({ username = "Madesh_A_12" }) => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [calendarValues, setCalendarValues] = useState({});
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let mounted = true;

        const fetchLeetCodeData = async () => {
            setLoading(true);
            setError("");

            try {
                const currentYear = new Date().getFullYear();
                const baseData = await fetchLeetCodeGraphQL(LEETCODE_PROFILE_AND_CALENDAR_QUERY, {
                    username,
                    year: currentYear,
                });

                const matchedUser = baseData?.matchedUser;
                if (!matchedUser) {
                    throw new Error("LeetCode username not found or profile is private.");
                }

                const allQuestionCounts = baseData?.allQuestionsCount || [];

                const acStats = matchedUser?.submitStats?.acSubmissionNum || [];
                const totalStats = matchedUser?.submitStats?.totalSubmissionNum || [];
                const all = Number(acStats.find(item => item?.difficulty === "All")?.count || 0);
                const easy = Number(acStats.find(item => item?.difficulty === "Easy")?.count || 0);
                const medium = Number(acStats.find(item => item?.difficulty === "Medium")?.count || 0);
                const hard = Number(acStats.find(item => item?.difficulty === "Hard")?.count || 0);

                const allAcceptedSubmissions = getStatValue(acStats, "All", "submissions");
                const easyAcceptedSubmissions = getStatValue(acStats, "Easy", "submissions");
                const mediumAcceptedSubmissions = getStatValue(acStats, "Medium", "submissions");
                const hardAcceptedSubmissions = getStatValue(acStats, "Hard", "submissions");

                const allTotalSubmissions = getStatValue(totalStats, "All", "submissions");
                const easyTotalSubmissions = getStatValue(totalStats, "Easy", "submissions");
                const mediumTotalSubmissions = getStatValue(totalStats, "Medium", "submissions");
                const hardTotalSubmissions = getStatValue(totalStats, "Hard", "submissions");

                const acceptance = {
                    all: getAcceptance(allAcceptedSubmissions, allTotalSubmissions),
                    easy: getAcceptance(easyAcceptedSubmissions, easyTotalSubmissions),
                    medium: getAcceptance(mediumAcceptedSubmissions, mediumTotalSubmissions),
                    hard: getAcceptance(hardAcceptedSubmissions, hardTotalSubmissions),
                };

                const totals = {
                    all: getStatValue(allQuestionCounts, "All"),
                    easy: getStatValue(allQuestionCounts, "Easy"),
                    medium: getStatValue(allQuestionCounts, "Medium"),
                    hard: getStatValue(allQuestionCounts, "Hard"),
                };

                if (all === 0 && easy === 0 && medium === 0 && hard === 0) {
                    throw new Error("LeetCode data not available for this username.");
                }

                const activeYears = matchedUser?.userCalendar?.activeYears || [];
                const yearCalendarPairs = await Promise.all(
                    activeYears.map(async year => {
                        const yearData = await fetchLeetCodeGraphQL(LEETCODE_YEAR_CALENDAR_QUERY, {
                            username,
                            year,
                        });
                        const yearCalendar = parseSubmissionCalendar(
                            yearData?.matchedUser?.userCalendar?.submissionCalendar
                        );
                        return [year, yearCalendar];
                    })
                );

                const mergedCalendar = yearCalendarPairs.reduce((acc, [, calendar]) => {
                    return { ...acc, ...calendar };
                }, {});

                if (!mounted) return;

                const years = Object.keys(mergedCalendar)
                    .map(date => Number(date.slice(0, 4)))
                    .filter(Boolean);
                const latestYear = years.length ? Math.max(...years) : new Date().getFullYear();

                setProfile({
                    username: matchedUser?.username || username,
                    name: matchedUser?.profile?.realName || matchedUser?.username || username,
                    avatar: matchedUser?.profile?.userAvatar || "",
                    ranking: matchedUser?.profile?.ranking ?? "-",
                    reputation: matchedUser?.profile?.reputation ?? "-",
                    school: matchedUser?.profile?.school || "",
                    company: matchedUser?.profile?.company || "",
                    country: matchedUser?.profile?.countryName || "",
                });

                setStats({
                    solvedProblem: all,
                    easySolved: easy,
                    mediumSolved: medium,
                    hardSolved: hard,
                    acceptance,
                    totals,
                });

                setCalendarValues(mergedCalendar);
                setSelectedYear(latestYear);
                setLastUpdated(new Date());
            } catch (err) {
                if (!mounted) return;
                const message =
                    err?.message === "Failed to fetch"
                        ? "Network/CORS blocked the data source. Try refresh, or use another LeetCode username."
                        : err?.message || "Could not load LeetCode stats right now. Try refresh.";
                setError(message);
                console.error("LeetCode fetch error:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchLeetCodeData();
        const intervalId = setInterval(fetchLeetCodeData, AUTO_REFRESH_MS);

        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, [username, reloadKey]);

    const totalSolved = stats?.solvedProblem || 0;

    const availableYears = useMemo(() => {
        const dataYears = Array.from(new Set(Object.keys(calendarValues).map(date => Number(date.slice(0, 4)))))
            .filter(Boolean);

        const nowYear = new Date().getFullYear();
        const recentYears = [nowYear, nowYear - 1, nowYear - 2];

        return Array.from(new Set([...dataYears, ...recentYears])).sort((a, b) => b - a);
    }, [calendarValues]);

    const selectedYearValues = useMemo(() => {
        const prefix = `${selectedYear}-`;
        return Object.fromEntries(
            Object.entries(calendarValues).filter(([date]) => date.startsWith(prefix))
        );
    }, [calendarValues, selectedYear]);

    const selectedYearTotal = useMemo(
        () => Object.values(selectedYearValues).reduce((sum, count) => sum + Number(count || 0), 0),
        [selectedYearValues]
    );

    const hasHeatmapData = Object.keys(selectedYearValues).length > 0;
    const profileUrl = `https://leetcode.com/u/${username}`;

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${username} on LeetCode`,
                    text: "Check out this LeetCode profile",
                    url: profileUrl,
                });
                return;
            }
            await navigator.clipboard.writeText(profileUrl);
            alert("Profile link copied!");
        } catch {
            // Ignore cancelled share and clipboard issues.
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            alert("Profile link copied!");
        } catch {
            // Ignore clipboard issues.
        }
    };

    const handlePrevYear = () => {
        const years = [...availableYears].sort((a, b) => a - b);
        const idx = years.indexOf(selectedYear);
        if (idx > 0) setSelectedYear(years[idx - 1]);
    };

    const handleNextYear = () => {
        const years = [...availableYears].sort((a, b) => a - b);
        const idx = years.indexOf(selectedYear);
        if (idx >= 0 && idx < years.length - 1) setSelectedYear(years[idx + 1]);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen pt-[100px] pb-[40px] flex justify-center items-center">
                <div className="w-full max-w-[925px] px-[2.5rem] animate-pulse">
                    <div className="h-7 w-40 bg-white/10 rounded-md mx-auto mb-10"></div>
                    <div className="rounded-[1rem] border border-[rgba(105,105,105,0.3)] bg-[rgba(0,0,0,0.76)] overflow-hidden">
                        <div className="h-14 border-b border-white/5"></div>
                        <div className="p-8 space-y-4">
                            <div className="h-4 w-48 bg-white/10 rounded"></div>
                            <div className="h-12 w-full bg-white/5 rounded"></div>
                            <div className="h-12 w-full bg-white/5 rounded"></div>
                            <div className="h-12 w-full bg-white/5 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen pt-[100px] pb-[40px] flex justify-center items-center bg-transparent">
            <div className="relative w-full max-w-[925px] rounded-[1.5rem] overflow-hidden px-[2.5rem] pb-[3.5rem] mx-auto box-border">
                <h6 className="font-['Exo_2',sans-serif] text-[2rem] text-white font-bold text-center mt-20 mb-8 tracking-[0.01em]">
                    LeetCode Pulse
                </h6>

                <div className="relative z-[10] rounded-[1rem] border-2 border-double border-[rgba(105,105,105,0.5)] bg-[rgba(0,0,0,0.76)] text-[rgba(255,255,255,0.98)] overflow-hidden box-border">
                    <div className="relative flex items-center h-14 px-6 gap-2 border-b border-[rgba(105,105,105,0.25)]">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[rgb(232,106,94)]"></div>
                            <div className="w-4 h-4 rounded-full bg-[rgb(241,190,80)]"></div>
                            <div className="w-4 h-4 rounded-full bg-[rgb(97,196,84)]"></div>
                        </div>

                        <div className="flex items-center px-4 opacity-70">
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{ cursor: "pointer" }}
                                onClick={handleNextYear}
                            >
                                <path d="m15 18-6-6 6-6"></path>
                            </svg>
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{ cursor: "pointer" }}
                                onClick={handlePrevYear}
                            >
                                <path d="m9 18 6-6-6-6"></path>
                            </svg>
                        </div>

                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-between gap-2 min-w-[320px] py-1 px-2 rounded-lg border-2 border-[rgba(105,105,105,0.3)] bg-[rgba(115,115,115,0.15)]">
                            <svg className="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span className="text-xs opacity-70 text-center flex-1">leetcode.com/{username}</span>
                            <svg
                                className="w-3.5 h-3.5 opacity-70 cursor-pointer"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                onClick={() => setReloadKey(prev => prev + 1)}
                            >
                                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                                <path d="M21 3v5h-5"></path>
                            </svg>
                        </div>

                        <div className="ml-auto flex items-center gap-3 opacity-70">
                            <div className="cursor-pointer" onClick={handleShare}>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v13"></path>
                                    <path d="m16 6-4-4-4 4"></path>
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                </svg>
                            </div>
                            <div className="cursor-pointer" onClick={() => window.open(profileUrl, "_blank")}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5v14"></path>
                                </svg>
                            </div>
                            <div className="cursor-pointer" onClick={handleCopy}>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pt-6 pb-6">
                        {error ? (
                            <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start gap-4 mb-6">
                                    <img
                                        src={profile?.avatar || "https://assets.leetcode.com/users/default_avatar.jpg"}
                                        alt={profile?.name || username}
                                        className="w-20 h-20 rounded-full bg-[rgba(115,115,115,0.15)]"
                                    />
                                    <div className="flex-1">
                                        <div className="text-xl font-semibold">{profile?.name}</div>
                                        <div className="text-sm opacity-75">@{profile?.username}</div>
                                        <div className="text-sm opacity-70 mt-1">
                                            {[profile?.company, profile?.school, profile?.country]
                                                .filter(Boolean)
                                                .join(" · ") || "Competitive programming profile"}
                                        </div>
                                    </div>
                                    <div className="text-right text-sm">
                                        <div className="opacity-70">Rank: {profile?.ranking}</div>
                                        <div className="opacity-70">Reputation: {profile?.reputation}</div>
                                        <div className="opacity-70">Solved: {totalSolved}</div>
                                        {stats?.acceptance?.all !== null && (
                                            <div className="opacity-70">Acceptance: {stats.acceptance.all}%</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center mb-3 text-sm">
                                    <span className="font-medium mr-2">{selectedYear}:</span>
                                    <span className="opacity-80">{selectedYearTotal} Submissions</span>
                                </div>

                                <div className="relative w-full overflow-x-auto pb-[6px]">
                                    <div className="flex gap-0.5 overflow-x-auto w-full" style={{ overflowX: "auto" }}>
                                        <GitHubCalendar
                                            values={selectedYearValues}
                                            until={`${selectedYear}-12-31`}
                                            panelColors={[
                                                "rgba(115,115,115,0.15)",
                                                "rgba(255,161,22,0.35)",
                                                "rgba(255,161,22,0.6)",
                                                "rgba(255,161,22,0.75)",
                                                "rgba(255,161,22,1)",
                                            ]}
                                            showMonthLabels={false}
                                            showWeekdayLabels={false}
                                            square={false}
                                        />
                                    </div>
                                </div>

                                {!hasHeatmapData && (
                                    <div className="mt-3 text-xs opacity-65">
                                        No mapped submissions found for {selectedYear}. Public API data for this profile currently starts from 2025.
                                    </div>
                                )}

                                <div className="year-tabs mt-4">
                                    {availableYears.map(year => (
                                        <button
                                            key={year}
                                            className={`py-2 px-4 rounded text-sm cursor-pointer transition-all duration-200 ${
                                                selectedYear === year
                                                    ? "opacity-100 bg-[rgba(255,161,22,0.2)] border border-[rgba(255,161,22,0.5)]"
                                                    : "opacity-60 bg-[rgba(115,115,115,0.15)] border border-transparent hover:opacity-80"
                                            }`}
                                            onClick={() => setSelectedYear(year)}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 rounded-xl border border-[rgba(105,105,105,0.35)] bg-[rgba(115,115,115,0.12)] overflow-hidden">
                                    <div className="grid grid-cols-3 divide-x divide-[rgba(105,105,105,0.3)]">
                                        <div className="relative px-3 py-3 text-center">
                                            <div className="absolute top-0 left-0 w-full h-[2px] bg-green-400/70"></div>
                                            <div className="text-xs font-semibold tracking-[0.03em] text-green-300">EASY</div>
                                            <div className="text-lg font-bold leading-tight mt-1">{stats?.easySolved}</div>
                                            <div className="text-[11px] opacity-65">of {stats?.totals?.easy || 0}</div>
                                        </div>

                                        <div className="relative px-3 py-3 text-center">
                                            <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-400/70"></div>
                                            <div className="text-xs font-semibold tracking-[0.03em] text-yellow-300">MEDIUM</div>
                                            <div className="text-lg font-bold leading-tight mt-1">{stats?.mediumSolved}</div>
                                            <div className="text-[11px] opacity-65">of {stats?.totals?.medium || 0}</div>
                                        </div>

                                        <div className="relative px-3 py-3 text-center">
                                            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-400/70"></div>
                                            <div className="text-xs font-semibold tracking-[0.03em] text-red-300">HARD</div>
                                            <div className="text-lg font-bold leading-tight mt-1">{stats?.hardSolved}</div>
                                            <div className="text-[11px] opacity-65">of {stats?.totals?.hard || 0}</div>
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}
                    </div>

                    <div className="border-t border-t-[rgba(105,105,105,0.25)] py-3 px-6 text-xs opacity-50 flex justify-between">
                        <span>Auto refresh every 30 minutes</span>
                        <span>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ""}</span>
                    </div>
        </div>
            </div>
        </div>
    );
};

export default LeetCodeStatsCard;