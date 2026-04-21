import React, { useState, useEffect } from "react";
import GitHubCalendar from "react-github-contribution-calendar";

const GithubContributionCard = ({ username = "Madeshmadmax7", compact = false, showTitle = true }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [userData, setUserData] = useState(null);
  const [contributionData, setContributionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function fetchGithubData() {
      setLoading(true);
      try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userJson = await userRes.json();

        const contribRes = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?format=nested`
        );
        const contribJson = await contribRes.json();

        const formatted = {};
        for (const year in contribJson.contributions) {
          const months = contribJson.contributions[year];
          const allDays = [];

          Object.keys(months).forEach(month => {
            Object.values(months[month]).forEach(day => {
              if (day && day.date) {
                allDays.push({
                  date: new Date(day.date),
                  count: day.count,
                  level: day.level ?? 0,
                });
              }
            });
          });

          allDays.sort((a, b) => a.date - b.date);

          const yearStart = new Date(year, 0, 1);
          const yearEnd = new Date(year, 11, 31);

          const firstSunday = new Date(yearStart);
          const dayOfWeek = firstSunday.getDay();
          firstSunday.setDate(firstSunday.getDate() - dayOfWeek);

          const lastSaturday = new Date(yearEnd);
          lastSaturday.setDate(lastSaturday.getDate() + (6 - lastSaturday.getDay()));

          const totalDays = Math.floor((lastSaturday - firstSunday) / (1000 * 60 * 60 * 24)) + 1;
          const totalWeeks = Math.ceil(totalDays / 7);
          const weeks = Array.from({ length: totalWeeks }, () => Array(7).fill(null));

          for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(firstSunday);
            currentDate.setDate(currentDate.getDate() + i);

            const weekIndex = Math.floor(i / 7);
            const dayOfWeek = currentDate.getDay();

            if (currentDate < yearStart || currentDate > yearEnd) {
              weeks[weekIndex][dayOfWeek] = { level: 0, count: 0, date: null };
              continue;
            }

            const dayData = allDays.find(
              d => d.date.toISOString().slice(0, 10) === currentDate.toISOString().slice(0, 10)
            );

            weeks[weekIndex][dayOfWeek] = dayData || { date: currentDate, count: 0, level: 0 };
          }

          formatted[year] = {
            total: contribJson.total?.[year] || 0,
            weeks,
          };
        }

        const years = Object.keys(formatted).map(Number);
        const latestYear = years.length ? Math.max(...years) : new Date().getFullYear();

        setUserData({
          name: userJson.name,
          username: userJson.login,
          avatar: userJson.avatar_url,
          followers: userJson.followers,
          following: userJson.following,
          bio: userJson.bio,
          totalCommits: Object.values(contribJson.total).reduce((a, b) => a + b, 0),
          yearsActive: years.length,
        });

        setContributionData(formatted);
        setSelectedYear(latestYear);
      } catch (err) {
        console.error("GitHub fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGithubData();
  }, [username, reloadKey]); // reloadKey triggers refresh

  // ---- Arrow navigation logic ----
  const handlePrevYear = () => {
    const years = Object.keys(contributionData).map(Number).sort((a, b) => a - b);
    const idx = years.indexOf(selectedYear);
    if (idx > 0) setSelectedYear(years[idx - 1]);
  };

  const handleNextYear = () => {
    const years = Object.keys(contributionData).map(Number).sort((a, b) => a - b);
    const idx = years.indexOf(selectedYear);
    if (idx < years.length - 1) setSelectedYear(years[idx + 1]);
  };

  const handleOpenGithub = () => {
    window.open(`https://github.com/${username}`, "_blank");
  };

  const handleRefresh = () => {
    setReloadKey(prev => prev + 1);
  };

  if (loading || !userData) return (
    <div className={`w-full ${compact ? "py-2" : "min-h-screen pt-[100px] pb-[80px]"} flex justify-center items-center`}>
      <div className={`w-full ${compact ? "max-w-none px-0" : "max-w-[925px] px-[2.5rem]"} animate-pulse`}>
        <div className="h-7 w-24 bg-white/10 rounded-md mx-auto mb-10"></div>
        <div className="rounded-[1rem] border border-[rgba(105,105,105,0.3)] bg-[rgba(0,0,0,0.76)] overflow-hidden">
          <div className="h-14 flex items-center px-6 gap-2 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-[#e86a5e]/40"></div>
              <div className="w-4 h-4 rounded-full bg-[#f1be50]/40"></div>
              <div className="w-4 h-4 rounded-full bg-[#61c454]/40"></div>
            </div>
            <div className="flex-1 mx-6 h-6 bg-white/5 rounded-lg"></div>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 shrink-0"></div>
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-28 bg-white/10 rounded"></div>
                <div className="h-2.5 w-40 bg-white/5 rounded"></div>
                <div className="h-2.5 w-32 bg-white/5 rounded"></div>
              </div>
            </div>
            <div className="space-y-[4px]">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex gap-[4px]">
                  {[...Array(52)].map((_, j) => (
                    <div key={j} className="w-3 h-3 rounded-[2px] bg-white/5 shrink-0"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`w-full ${compact ? "py-2" : "min-h-screen pt-[100px] pb-[80px]"} flex justify-center items-center bg-transparent`}>
        <div className={`relative w-full ${compact ? "max-w-none rounded-xl px-0 pb-0" : "max-w-[925px] rounded-[1.5rem] px-[2.5rem] pb-[3.5rem]"} overflow-hidden mx-auto box-border`}>
          {showTitle && !compact && (
            <h6 className="font-['Exo_2',sans-serif] text-[2rem] text-white font-bold text-center mt-20 mb-8 tracking-[0.01em]">Heat Map</h6>
          )}
          <div className="relative z-[10] rounded-[1rem] border-2 border-double border-[rgba(105,105,105,0.5)] bg-[rgba(0,0,0,0.76)] text-[rgba(255,255,255,0.98)] overflow-hidden box-border">
            {/* Browser Header */}
            <div className="browser-header relative flex items-center h-14 px-6 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[rgb(232,106,94)]"></div>
                <div className="w-4 h-4 rounded-full bg-[rgb(241,190,80)]"></div>
                <div className="w-4 h-4 rounded-full bg-[rgb(97,196,84)]"></div>
              </div>
              <div className="flex items-center px-4 opacity-70">
                {/* ← Prev Year */}
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
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-between gap-2 min-w-[290px] py-1 px-2 rounded-lg border-2 border-[rgba(105,105,105,0.3)] bg-[rgba(115,115,115,0.15)]" style={{ cursor: "pointer" }}>
                <svg className="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <div className="text-xs opacity-70" style={{ flex: 1, textAlign: "center" }} onClick={handleOpenGithub}>
                  github.com/{userData.username}
                </div>
                <svg
                  className="w-3.5 h-3.5 opacity-70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ cursor: "pointer" }}
                  onClick={handleRefresh}
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
              </div>
              <div className="ml-auto flex items-center gap-3 opacity-70">
                <div
                  className="cursor-pointer"
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    const githubURL = "https://github.com/Madeshmadmax7";
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: "Madesh A on GitHub",
                          text: "Check out my GitHub profile!",
                          url: githubURL,
                        });
                      } catch (err) {
                        console.log("Share cancelled");
                      }
                    } else {
                      await navigator.clipboard.writeText(githubURL);
                      alert("Link copied (share not supported)");
                    }
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v13"></path>
                    <path d="m16 6-4-4-4 4"></path>
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  </svg>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    window.open("https://github.com/login?return_to=%2FMadeshmadmax7", "_blank")
                  }
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </div>
                <div
                  className="cursor-pointer"
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    await navigator.clipboard.writeText("https://github.com/Madeshmadmax7");
                    alert("GitHub link copied!");
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="px-6 pt-2 pb-6">
              <div className="profile-header flex w-full items-start mb-6">
                <div className="mr-4 shrink-0">
                  <img src={userData.avatar} alt={userData.name} className="w-20 h-20 rounded-full bg-[rgba(115,115,115,0.15)]" />
                </div>
                <div className="flex-1 flex flex-col gap-1 max-w-[400px]">
                  <div className="text-xl font-semibold">{userData.name}</div>
                  <div className="flex items-center gap-1 text-sm flex-wrap">
                    <span className="flex items-center">@{userData.username}</span>
                    <span className="mx-1">·</span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <span>{userData.followers}</span>
                      <span className="opacity-70">followers</span>
                    </span>
                    <span className="mx-1">·</span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <span>{userData.following}</span>
                      <span className="opacity-70">following</span>
                    </span>
                  </div>
                  <div className="text-sm opacity-70 leading-[1.4]">{userData.bio}</div>
                </div>
                <div className="github-stats ml-auto shrink-0 flex flex-col items-end gap-0.5 text-xs">
                  <a href={`https://github.com/${userData.username}`} target="_blank" rel="noopener noreferrer" className="pb-2 text-inherit no-underline">
                    <svg className="w-9 h-9" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" fill="currentcolor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <div className="opacity-70">{userData.totalCommits} Commits</div>
                  <div className="opacity-70">{userData.yearsActive} Years</div>
                </div>
              </div>

              {/* Contributions */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center mb-2">
                  <div className="text-sm flex gap-2">
                    <span className="font-medium mr-2">{selectedYear}:</span>
                    <span className="opacity-80">
                      {contributionData[selectedYear]?.total || 0} Contributions
                    </span>
                  </div>
                </div>

                <div className="relative w-full overflow-x-auto pb-[6px]">
                  <div className="flex gap-0.5 overflow-x-auto w-full" style={{ overflowX: "auto" }}>
                    <GitHubCalendar
                      values={Object.fromEntries(
                        Object.values(contributionData[selectedYear]?.weeks || [])
                          .flat()
                          .filter((d) => d?.date)
                          .map((d) => [d.date.toISOString().slice(0, 10), d.count])
                      )}
                      until={`${selectedYear}-12-31`}
                      panelColors={[
                        "rgba(115,115,115,0.15)",
                        "rgba(135,231,242,0.35)",
                        "rgba(135,231,242,0.6)",
                        "rgba(135,231,242,0.75)",
                        "rgba(135,231,242,1)",
                      ]}
                      showMonthLabels={false}
                      showWeekdayLabels={false}
                      square={false}
                    />
                  </div>
                </div>

                <div className="year-tabs">
                  {Object.keys(contributionData)
                    .sort((a, b) => b - a)
                    .map((year) => (
                      <button
                        key={year}
                        className={`py-2 px-4 rounded text-sm cursor-pointer transition-all duration-200 ${selectedYear === parseInt(year) ? "opacity-100 bg-[rgba(135,231,242,0.2)] border border-[rgba(135,231,242,0.5)]" : "opacity-60 bg-[rgba(115,115,115,0.15)] border border-transparent hover:opacity-80"}`}
                        onClick={() => setSelectedYear(parseInt(year))}
                      >
                        {year}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="card-footer border-t border-t-[rgba(105,105,105,0.25)] py-3 px-6 flex gap-2 items-center justify-end text-xs opacity-40">
              Crafted with
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" role="img">
                <rect x="2" y="5" width="20" height="12" rx="1.5" ry="1.5" />
                <path d="M7 21h10" />
                <path d="M2 17h20" opacity="0.6" />
              </svg>
              +
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" role="img">
                <path d="M3 13v-1a9 9 0 0 1 18 0v1" />
                <rect x="2" y="13" width="4" height="6" rx="1" ry="1" />
                <rect x="18" y="13" width="4" height="6" rx="1" ry="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GithubContributionCard;
