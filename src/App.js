import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

import Home from "./pages/Home";
import Achievements, { unlockAchievement } from "./components/Achievements";
import Loader from "./components/Loader";
import MiniNavbar from "./components/MiniNavbar";
import AchievementNotification from "./components/AchievementNotification";
import "./App.css";

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleLoaderFinish = () => {
    setLoading(false);
  };

  const handleTrophyClick = () => {
    // unlock Recruiter’s Eye achievement (example id: 2)
    unlockAchievement(2);
    setNotification({
      title: "Achievement Unlocked!",
      description: "Hidden Seeker",
    });

    // Navigate to Achievements page
    navigate("/achievement");
  };

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
          </Routes>

          {/* Floating Trophy Button */}
          <FontAwesomeIcon
            icon={faTrophy}
            className="floating-trophy"
            onClick={handleTrophyClick}
          />

          {/* Achievement Notification */}
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
