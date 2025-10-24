import React from "react";
import GitHubCalendar from "react-github-contribution-calendar";

const ContributionGraph = () => {
  const values = {
    "2025-01-02": 2,
    "2025-01-03": 5,
    "2025-02-12": 1,
    "2025-03-15": 4,
    "2025-04-10": 3,
    "2025-05-20": 8,
    "2025-07-01": 5,
    "2025-08-22": 6,
    "2025-09-11": 2,
    "2025-10-23": 7,
  };

  // Customize date range
  const until = "2025-12-31"; // last visible day on the grid
  const panelColors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]; // GitHub shades

  return (
    <div>
      <h2>My Contributions</h2>
      <GitHubCalendar
        values={values}
        until={until}
        panelColors={panelColors}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
      />
    </div>
  );
};

export default ContributionGraph;


// import React, { useState, useEffect } from "react";

// const styles = `
// /* ... your original styles, as posted ... */
// `;

// // (Add your full CSS inside styles—unchanged from your last message)

// if (typeof document !== "undefined" && !document.getElementById("github-card-style")) {
//   const styleEl = document.createElement("style");
//   styleEl.id = "github-card-style";
//   styleEl.textContent = styles;
//   document.head.appendChild(styleEl);
// }

// const GithubContributionCard = ({ username = "Madeshmadmax7" }) => {
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [userData, setUserData] = useState(null);
//   const [contributionData, setContributionData] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchGithubData() {
//       setLoading(true);
//       try {
//         const userRes = await fetch(`https://api.github.com/users/${username}`);
//         const userJson = await userRes.json();
//         const contribRes = await fetch(
//           `https://github-contributions-api.jogruber.de/v4/${username}?format=nested`
//         );
//         const contribJson = await contribRes.json();

//         // Build calendar grid: columns = weeks, rows = days (Sun-Sat top to bottom)
//         const formatted = {};
//         for (const year in contribJson.contributions) {
//           const months = contribJson.contributions[year];
//           const allDays = [];
//           Object.keys(months).forEach((month) => {
//             Object.values(months[month]).forEach((day) => {
//               if (day && day.date) {
//                 allDays.push({
//                   date: new Date(day.date),
//                   count: day.count,
//                   level: day.level ?? 0,
//                 });
//               }
//             });
//           });
//           allDays.sort((a, b) => a.date - b.date);

//           const yearStart = new Date(year, 0, 1);
//           const yearEnd = new Date(year, 11, 31);
//           const startWeekDay = yearStart.getDay();
//           const endWeekDay = yearEnd.getDay();

//           const totalDays = Math.floor((yearEnd - yearStart) / (1000 * 60 * 60 * 24)) + 1;
//           const totalBoxes = totalDays + startWeekDay + (6 - endWeekDay);
//           const totalWeeks = Math.ceil(totalBoxes / 7);

//           // Build weeks: every week is 7 days Sunday (0) to Saturday (6)
//           const weeks = [];
//           let dayCursor = new Date(yearStart);
//           dayCursor.setDate(dayCursor.getDate() - startWeekDay); // Move to Sunday before Jan 1 (or Jan 1 if Sunday)
//           for (let w = 0; w < totalWeeks; w++) {
//             const week = [];
//             for (let d = 0; d < 7; d++) {
//               let box = null;
//               if (
//                 dayCursor.getFullYear() === Number(year) &&
//                 dayCursor >= yearStart &&
//                 dayCursor <= yearEnd
//               ) {
//                 // Real day in this year
//                 const dayData = allDays.find(
//                   (c) => c.date.toISOString().slice(0, 10) === dayCursor.toISOString().slice(0, 10)
//                 );
//                 box = dayData || { date: new Date(dayCursor), count: 0, level: 0 };
//               } else {
//                 // Padding cell, not an actual day for this year
//                 box = { date: null, count: 0, level: 0 };
//               }
//               week.push(box);
//               dayCursor.setDate(dayCursor.getDate() + 1);
//             }
//             weeks.push(week);
//           }

//           formatted[year] = {
//             total: contribJson.total?.[year] || 0,
//             weeks,
//           };
//         }

//         const years = Object.keys(formatted).map(Number);
//         const latestYear = years.length ? Math.max(...years) : new Date().getFullYear();

//         setUserData({
//           name: userJson.name,
//           username: userJson.login,
//           avatar: userJson.avatar_url,
//           followers: userJson.followers,
//           following: userJson.following,
//           bio: userJson.bio,
//           totalCommits: Object.values(contribJson.total).reduce((a, b) => a + b, 0),
//           yearsActive: years.length,
//         });

//         setContributionData(formatted);
//         setSelectedYear(latestYear);
//       } catch (err) {
//         console.error("GitHub fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchGithubData();
//   }, [username]);

//   if (loading || !userData) return <div className="github-card-wrapper">Loading...</div>;

//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];

//   return (
//     <div className="github-card-wrapper">
//       <div className="github-card-container">
//         <div className="github-card">
//           {/* Browser Header */}
//           <div className="browser-header">
//             <div className="browser-dots">
//               <div className="dot dot-red"></div>
//               <div className="dot dot-yellow"></div>
//               <div className="dot dot-green"></div>
//             </div>
//             <div className="browser-nav">
//               <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="m15 18-6-6 6-6"></path>
//               </svg>
//               <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="m9 18 6-6-6-6"></path>
//               </svg>
//             </div>
//             <div className="browser-url">
//               <svg className="url-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
//                 <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
//               </svg>
//               <div className="url-text" style={{ flex: 1, textAlign: "center" }}>github.com/{userData.username}</div>
//               <svg className="url-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
//                 <path d="M21 3v5h-5"></path>
//               </svg>
//             </div>
//             <div className="browser-actions">
//               <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M12 2v13"></path>
//                 <path d="m16 6-4-4-4 4"></path>
//                 <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
//               </svg>
//               <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M5 12h14"></path>
//                 <path d="M12 5v14"></path>
//               </svg>
//               <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
//                 <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
//               </svg>
//             </div>
//           </div>

//           <div className="profile-section">
//             <div className="profile-header">
//               <div className="avatar-container">
//                 <img src={userData.avatar} alt={userData.name} className="avatar" />
//               </div>
//               <div className="profile-info">
//                 <div className="profile-name">{userData.name}</div>
//                 <div className="profile-details">
//                   <span className="username">@{userData.username}</span>
//                   <span className="dot">·</span>
//                   <span className="stat">
//                     <span>{userData.followers}</span>
//                     <span className="stat-label">followers</span>
//                   </span>
//                   <span className="dot">·</span>
//                   <span className="stat">
//                     <span>{userData.following}</span>
//                     <span className="stat-label">following</span>
//                   </span>
//                 </div>
//                 <div className="bio">{userData.bio}</div>
//               </div>
//               <div className="github-stats">
//                 <a href={`https://github.com/${userData.username}`} target="_blank" rel="noopener noreferrer" className="github-link">
//                   <svg className="github-icon" viewBox="0 0 24 24">
//                     <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" fill="currentcolor" fillRule="evenodd" clipRule="evenodd"></path>
//                   </svg>
//                 </a>
//                 <div className="commits-stat">{userData.totalCommits} Commits</div>
//                 <div className="years-stat">{userData.yearsActive} Years</div>
//               </div>
//             </div>

//             {/* Contributions */}
//             <div className="contributions-container">
//               <div className="year-selector">
//                 <div className="year-info">
//                   <span className="year-label">{selectedYear}:</span>
//                   <span className="contributions-count">
//                     {contributionData[selectedYear]?.total || 0} Contributions
//                   </span>
//                 </div>
//               </div>
//               <div className="contribution-graph">
//                 <div className="months-labels">
//                   {months.map((m, i) => (
//                     <div key={i} className="month-label">
//                       {m}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="contribution-grid">
//                   {contributionData[selectedYear]?.weeks.map((week, wi) => (
//                     <div key={wi} className="contribution-column">
//                       {week.map((day, di) => (
//                         <div
//                           key={di}
//                           className={`contribution-cell level-${day?.level ?? 0}`}
//                           title={
//                             day.date
//                               ? `${day.count} contributions on ${day.date.toLocaleDateString()}`
//                               : ""
//                           }
//                           style={{ opacity: day.date ? 1 : 0.15 }}
//                         />
//                       ))}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="year-tabs">
//                 {Object.keys(contributionData)
//                   .sort((a, b) => b - a)
//                   .map((year) => (
//                     <button
//                       key={year}
//                       className={`year-tab ${selectedYear === parseInt(year) ? "active" : ""}`}
//                       onClick={() => setSelectedYear(parseInt(year))}
//                     >
//                       {year}
//                     </button>
//                   ))}
//               </div>
//             </div>
//           </div>
//           <div className="card-footer">
//             Made with <a href="https://github.com/Madeshmadmax7">GitHub</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GithubContributionCard;
