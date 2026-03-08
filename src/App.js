import React, { useState, useEffect, useRef } from "react";
import { Gift } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Achievements, { unlockAchievement } from "./components/Achievements";
import Loader from "./components/Loader";
import MiniNavbar from "./components/MiniNavbar";
import AchievementNotification from "./components/AchievementNotification";
import Matrix from "./pages/Matrix";
import SnakeGame from "./components/SnakeGame";


function AppContent() {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [visited, setVisited] = useState({ achievements: false, projects: false });
  const navigate = useNavigate();
  const location = useLocation();

  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const [showMatrixTransition, setShowMatrixTransition] = useState(false);
  const prevPathRef = useRef('/');

  const handleLoaderFinish = () => setLoading(false);

  const handleTrophyClick = () => {
    const isNew = unlockAchievement(2);
    if (isNew) {
      setNotification({
        title: "Achievement Unlocked!",
        description: "Hidden Seeker",
      });
    }
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

          const isNew = unlockAchievement(9);
          if (isNew) setNotification({ title: "Achievement Unlocked!", description: "Debugger's Intuition" });
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

  // 🧭 Scroll-based unlocks
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;
      if (!scrolledToBottom) return;

      // Scroll Warrior — just reach the bottom
      const isScrollNew = unlockAchievement(12);
      // Pixel Wanderer — bottom + visited achievements + projects pages
      if (visited.achievements && visited.projects) {
        const isWandererNew = unlockAchievement(7);
        if (isWandererNew) {
          setNotification({ title: "Achievement Unlocked!", description: "Pixel Wanderer" });
        } else if (isScrollNew) {
          setNotification({ title: "Achievement Unlocked!", description: "Scroll Warrior" });
        }
      } else if (isScrollNew) {
        setNotification({ title: "Achievement Unlocked!", description: "Scroll Warrior" });
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

  // 🦉 Night Owl — visited after midnight
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      const isNew = unlockAchievement(13);
      if (isNew) setNotification({ title: "Achievement Unlocked!", description: "Night Owl" });
    }
  }, []);

  // 🔁 Triple Threat — visited 3 times
  useEffect(() => {
    const count = parseInt(localStorage.getItem("visitCount") || "0") + 1;
    localStorage.setItem("visitCount", String(count));
    if (count >= 3) {
      const isNew = unlockAchievement(14);
      if (isNew) setNotification({ title: "Achievement Unlocked!", description: "Triple Threat" });
    }
  }, []);

  // 🎮 Konami Code → opens Snake game
  useEffect(() => {
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;
    const handler = (e) => {
      if (e.key === seq[idx]) {
        idx++;
        if (idx === seq.length) {
          idx = 0;
          setShowSnakeGame(true);
        }
      } else {
        idx = e.key === seq[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // 🖥 Matrix page transition overlay
  useEffect(() => {
    if (location.pathname === '/matrix' && prevPathRef.current !== '/matrix') {
      setShowMatrixTransition(true);
      setTimeout(() => setShowMatrixTransition(false), 2500);
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

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
          {showSnakeGame && (
            <SnakeGame
              onClose={() => setShowSnakeGame(false)}
              onGameOver={(replay) => {
                setShowSnakeGame(false);
                localStorage.setItem('snakeReplay', JSON.stringify(replay));
                const isNew = unlockAchievement(15);
                if (isNew) setNotification({ title: "Achievement Unlocked!", description: "Konami Savant" });
              }}
            />
          )}
          {showMatrixTransition && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 pointer-events-none [animation:matrixFadeOut_2.5s_ease-in-out_forwards]">
              <div className="text-center">
                <div className="text-[#00ff88] font-mono text-[11px] tracking-[0.5em] mb-3 uppercase">/// Access Granted ///</div>
                <div className="text-white text-3xl font-bold" style={{ fontFamily: "'Exo 2', sans-serif" }}>Matrix Explorer</div>
                <div className="text-[#333] font-mono text-[10px] mt-3 tracking-[0.3em] uppercase">Hidden terminal unlocked</div>
              </div>
            </div>
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
