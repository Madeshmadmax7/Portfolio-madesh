import React, { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Achievements, { unlockAchievement } from "./components/Achievements";
import Loader from "./components/Loader";
import MiniNavbar from "./components/MiniNavbar";
import AchievementNotification from "./components/AchievementNotification";
import Matrix from "./pages/Matrix";

import "./App.css";

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [visited, setVisited] = useState({ achievements: false, projects: false });
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoaderFinish = () => setLoading(false);

  const handleTrophyClick = () => {
    unlockAchievement(2);
    setNotification({
      title: "Achievement Unlocked!",
      description: "Hidden Seeker",
    });
    navigate("/achievement");
  };

  // 🧠 Detect console open
  useEffect(() => {
    let devtoolsOpened = false;
    const checkDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        if (!devtoolsOpened) {
          devtoolsOpened = true;
          console.log("%c👀 Welcome, Debugger!", "color:#00e1ff; font-size:16px; font-weight:bold;");
          console.log("%cYou’ve found the hidden console message.", "color:#ffffff; font-size:14px;");
          console.log("%c💡 Psst... Type /matrix in the URL. The truth awaits.", "color:#00ff88; font-size:13px;");

          unlockAchievement(9);
          setNotification({ title: "Achievement Unlocked!", description: "Debugger’s Intuition" });
        }
      }
    };
    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🗺 Track visited pages
  useEffect(() => {
    if (location.pathname === "/achievement")
      setVisited((prev) => ({ ...prev, achievements: true }));
    if (location.pathname === "/projects")
      setVisited((prev) => ({ ...prev, projects: true }));
  }, [location]);

  // 🧭 Scroll-based unlock
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;

      if (scrolledToBottom && visited.achievements && visited.projects) {
        unlockAchievement(7);
        setNotification({
          title: "Achievement Unlocked!",
          description: "Pixel Wanderer",
        });
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visited]);

  // 💻 Unlock Matrix Explorer when visiting /matrix
  useEffect(() => {
    if (location.pathname === "/matrix") {
      const isNew = unlockAchievement(11);
      if (isNew) {
        setNotification({
          title: "Achievement Unlocked!",
          description: "Matrix Explorer",
        });
      }
    }
  }, [location]);

  return (
    <>
      {loading ? (
        <Loader onFinish={handleLoaderFinish} />
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/achievement"
              element={
                <>
                  <MiniNavbar />
                  <Achievements />
                </>
              }
            />
            <Route
              path="/projects"
              element={
                <>
                  <MiniNavbar />
                  <Projects />
                </>
              }
            />
            <Route
              path="/matrix"
              element={
                <>
                  <MiniNavbar />
                  <br />
                  <br />
                  <br />
                  <Matrix />
                </>
              }
            />
          </Routes>
          <Gift className="floating-treasure" onClick={handleTrophyClick} />
          {notification && (
            <AchievementNotification
              title={notification.title}
              description={notification.description}
              onClose={() => setNotification(null)}
            />
          )}
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
