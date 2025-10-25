import React, { useState, useEffect } from "react";
import GitHubCalendar from "react-github-contribution-calendar";

const styles = `
.github-card-wrapper {
  width: 100%;
  padding: 2.5rem 1rem;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: transparent;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.github-card-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  border-radius: 1.5rem;
  overflow: hidden;
  padding: 3.5rem;
}

.github-card {
  position: relative;
  z-index: 10;
  border-radius: 1rem;
  border: 2px double rgba(105, 105, 105, 0.5);
  background: rgba(0, 0, 0, 0.76);
  color: rgba(255, 255, 255, 0.98);
  overflow: hidden;
}

/* Browser Header */
.browser-header {
  position: relative;
  display: flex;
  align-items: center;
  height: 3.5rem;
  padding: 0 1.5rem;
  gap: 0.5rem;
}

.browser-dots {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.dot-red { background: rgb(232, 106, 94); }
.dot-yellow { background: rgb(241, 190, 80); }
.dot-green { background: rgb(97, 196, 84); }

.browser-nav {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  opacity: 0.7;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.browser-url {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 290px;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: 2px solid rgba(105, 105, 105, 0.3);
  background: rgba(115, 115, 115, 0.15);
}

.url-icon {
  width: 0.875rem;
  height: 0.875rem;
  opacity: 0.7;
}

.url-text {
  font-size: 0.75rem;
  opacity: 0.7;
}

.browser-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  opacity: 0.7;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

/* Profile Section */
.profile-section {
  padding: 0.5rem 1.5rem 1.5rem;
}

.profile-header {
  display: flex;
  width: 100%;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.avatar-container {
  margin-right: 1rem;
  flex-shrink: 0;
}

.avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: rgba(115, 115, 115, 0.15);
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 400px;
}
.react-calendar-heatmap .color-empty {
  border-radius: 3px;
}

.react-calendar-heatmap .color-scale-0,
.react-calendar-heatmap .color-scale-1,
.react-calendar-heatmap .color-scale-2,
.react-calendar-heatmap .color-scale-3,
.react-calendar-heatmap .color-scale-4 {
  border-radius: 3px;
  transition: transform 0.2s, outline 0.2s;
}

.react-calendar-heatmap .color-scale-0:hover,
.react-calendar-heatmap .color-scale-1:hover,
.react-calendar-heatmap .color-scale-2:hover,
.react-calendar-heatmap .color-scale-3:hover,
.react-calendar-heatmap .color-scale-4:hover {
  transform: scale(1.15);
  outline: 1px solid rgba(255, 255, 255, 0.25);
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 600;
}

.profile-details {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  flex-wrap: wrap;
}

.username {
  display: flex;
  align-items: center;
}

.dot {
  margin: 0 0.25rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.stat-icon {
  width: 1rem;
  height: 1rem;
}

.stat-label {
  opacity: 0.7;
}

.bio {
  font-size: 0.875rem;
  opacity: 0.7;
  line-height: 1.4;
}

.github-stats {
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
  font-size: 0.75rem;
}

.github-link {
  padding-bottom: 0.5rem;
}

.github-icon {
  width: 2.25rem;
  height: 2.25rem;
}

.commits-stat, .years-stat {
  opacity: 0.7;
}

/* Contributions */
.contributions-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.year-selector {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.year-info {
  font-size: 0.875rem;
  display: flex;
  gap: 0.5rem;
}

.year-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.contributions-count {
  opacity: 0.8;
}

.inspect-btn {
  margin-left: auto;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: rgba(115, 115, 115, 0.15);
  border: 1px solid transparent;
  color: currentColor;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.125rem;
  opacity: 0;
  transition: all 0.2s;
}

.contributions-container:hover .inspect-btn {
  opacity: 1;
}

.inspect-btn:hover {
  border-color: rgba(105, 105, 105, 0.5);
}

.inspect-btn span {
  opacity: 0.7;
}

.inspect-btn:hover span {
  opacity: 1;
}

.chevron {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s;
}

.inspect-btn:hover .chevron {
  transform: translateX(0.125rem);
}

.contribution-graph {
  position: relative;
}

.months-labels {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  margin-bottom: 0.5rem;
  padding-left: 0;
  font-size: 0.75rem;
}

.month-label {
  text-align: left;
}

.contribution-grid {
  display: flex;
  gap: 2px;
}

.contribution-column {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contribution-cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  transition: all 0.2s;
}

.contribution-cell.level-0 {
  background: rgba(115, 115, 115, 0.15);
}

.contribution-cell.level-1 {
  background: color-mix(in srgb, rgba(135, 231, 242, 1) 35%, rgba(115, 115, 115, 0.15));
}

.contribution-cell.level-2 {
  background: color-mix(in srgb, rgba(135, 231, 242, 1) 60%, rgba(115, 115, 115, 0.15));
}

.contribution-cell.level-3 {
  background: color-mix(in srgb, rgba(135, 231, 242, 1) 75%, rgba(115, 115, 115, 0.15));
}

.contribution-cell.level-4 {
  background: rgba(135, 231, 242, 1);
}

.contribution-cell:hover {
  transform: scale(1.2);
  outline: 1px solid rgba(255, 255, 255, 0.3);
}

.year-tabs {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.year-tab {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background: rgba(115, 115, 115, 0.15);
  border: 1px solid transparent;
  color: currentColor;
  font-size: 0.875rem;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
}

.year-tab:hover {
  opacity: 0.8;
  border-color: rgba(105, 105, 105, 0.3);
}

.year-tab.active {
  opacity: 1;
  background: rgba(135, 231, 242, 0.2);
  border-color: rgba(135, 231, 242, 0.5);
}

/* Footer */
.card-footer {
  border-top: 1.5px solid rgba(105, 105, 105, 0.25);
  padding: 0.75rem 1.5rem;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.75rem;
  opacity: 0.4;
}

.card-footer a {
  margin-left: 0.25rem;
  color: inherit;
  text-decoration: none;
}

.card-footer a:hover {
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .github-card-wrapper {
    padding: 1rem;
  }
  
  .github-card-container {
    padding: 1.5rem;
  }
  
  .profile-header {
    flex-direction: column;
  }
  
  .github-stats {
    margin-left: 0;
    margin-top: 1rem;
    align-items: flex-start;
  }
  
  .contribution-grid {
    gap: 1.5px;
  }
  
  .contribution-cell {
    width: 8px;
    height: 8px;
  }
}
`;

if (typeof document !== "undefined" && !document.getElementById("github-card-style")) {
  const styleEl = document.createElement("style");
  styleEl.id = "github-card-style";
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

const GithubContributionCard = ({ username = "Madeshmadmax7" }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [userData, setUserData] = useState(null);
  const [contributionData, setContributionData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGithubData() {
      setLoading(true);
      try {
        // Fetch GitHub user info
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userJson = await userRes.json();

        // Fetch contribution data (nested format)
        const contribRes = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?format=nested`
        );
        const contribJson = await contribRes.json();

        // Process contributions into weeks aligned vertically (Sun-Sat)
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

          // Find the first Sunday before or on Jan 1
          const firstSunday = new Date(yearStart);
          const dayOfWeek = firstSunday.getDay(); // 0=Sun ... 6=Sat

          // GitHub’s graph starts on Sunday, so shift back to the nearest Sunday
          firstSunday.setDate(firstSunday.getDate() - dayOfWeek);

          // Find the last Saturday after or on Dec 31
          const lastSaturday = new Date(yearEnd);
          lastSaturday.setDate(lastSaturday.getDate() + (6 - lastSaturday.getDay()));

          // Calculate total weeks
          const totalDays = Math.floor((lastSaturday - firstSunday) / (1000 * 60 * 60 * 24)) + 1;
          const totalWeeks = Math.ceil(totalDays / 7);

          const weeks = Array.from({ length: totalWeeks }, () => Array(7).fill(null));

          // Fill the grid starting from Sunday
          for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(firstSunday);
            currentDate.setDate(currentDate.getDate() + i);

            const weekIndex = Math.floor(i / 7);
            const dayOfWeek = currentDate.getDay();   // <-- USE THIS
            // Check if date is outside the actual year
            if (currentDate < yearStart || currentDate > yearEnd) {
              weeks[weekIndex][dayOfWeek] = { level: 0, count: 0, date: null };
              continue;
            }

            // Find matching contribution data
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
  }, [username]);

  if (loading || !userData) return <div className="github-card-wrapper">Loading...</div>;


  return (
    <div className="github-card-wrapper">
      <div className="github-card-container">
        <div className="github-card">
          {/* Browser Header */}
          <div className="browser-header">
            <div className="browser-dots">
              <div className="dot dot-red"></div>
              <div className="dot dot-yellow"></div>
              <div className="dot dot-green"></div>
            </div>
            <div className="browser-nav">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </div>
            <div className="browser-url">
              <svg className="url-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <div className="url-text" style={{ flex: 1, textAlign: "center" }}>github.com/{userData.username}</div>
              <svg className="url-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
              </svg>
            </div>
            <div className="browser-actions">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v13"></path>
                <path d="m16 6-4-4-4 4"></path>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              </svg>
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-header">
              <div className="avatar-container">
                <img src={userData.avatar} alt={userData.name} className="avatar" />
              </div>
              <div className="profile-info">
                <div className="profile-name">{userData.name}</div>
                <div className="profile-details">
                  <span className="username">@{userData.username}</span>
                  <span className="dot">·</span>
                  <span className="stat">
                    <span>{userData.followers}</span>
                    <span className="stat-label">followers</span>
                  </span>
                  <span className="dot">·</span>
                  <span className="stat">
                    <span>{userData.following}</span>
                    <span className="stat-label">following</span>
                  </span>
                </div>
                <div className="bio">{userData.bio}</div>
              </div>
              <div className="github-stats">
                <a href={`https://github.com/${userData.username}`} target="_blank" rel="noopener noreferrer" className="github-link">
                  <svg className="github-icon" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" fill="currentcolor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </a>
                <div className="commits-stat">{userData.totalCommits} Commits</div>
                <div className="years-stat">{userData.yearsActive} Years</div>
              </div>
            </div>

            {/* Contributions */}
            <div className="contributions-container">
              <div className="year-selector">
                <div className="year-info">
                  <span className="year-label">{selectedYear}:</span>
                  <span className="contributions-count">
                    {contributionData[selectedYear]?.total || 0} Contributions
                  </span>
                </div>
              </div>

              <div className="contribution-graph">
                <div className="contribution-grid" style={{ overflowX: "auto" }}>
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
                      className={`year-tab ${selectedYear === parseInt(year) ? "active" : ""}`}
                      onClick={() => setSelectedYear(parseInt(year))}
                    >
                      {year}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="card-footer">
            Crafted with
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" role="img">
              <title>Laptop</title>
              <rect x="2" y="5" width="20" height="12" rx="1.5" ry="1.5" />
              <path d="M7 21h10" />
              <path d="M2 17h20" opacity="0.6" />
            </svg>
            +
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" role="img">
              <title>Headphones</title>
              <path d="M3 13v-1a9 9 0 0 1 18 0v1" />
              <rect x="2" y="13" width="4" height="6" rx="1" ry="1" />
              <rect x="18" y="13" width="4" height="6" rx="1" ry="1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubContributionCard;