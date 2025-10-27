import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const MiniNavbar = () => {
    const navigate = useNavigate();

    return (
        <header className="navbar">
            <div className="nav-logo" onClick={() => navigate("/")}>
                MAD
            </div>
        </header>
    );
};

export default MiniNavbar;
