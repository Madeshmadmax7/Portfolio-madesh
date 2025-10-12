import React from 'react';
import './Header.css';
import meLego from '../profile-images/menewblue.jpg';

const Header = () => {
    return (
        <header className="header-wrapper">
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-text">
                        <h1>
                            Hello I’m <span className="bold">Madesh.</span><br />
                            <span className="bold">Full Stack <span className="stroke-text">Developer</span></span><br />
                        </h1>
                        <p>
                            I’m a passionate engineering student with a focus on creating seamless, full-stack solutions. I bridge the gap between great design and robust functionality, building user centered applications that are both intuitive and efficient. I’m dedicated to bringing ideas to life with technology.
                        </p>
                        <div className="social-icons">
                            <a href="https://github.com/Madeshmadmax7" target="_blank" rel="noopener noreferrer">
                                <button><img src="/logos/githubw.svg" alt="GitHub" className="social-icon" /></button>
                            </a>
                            <a href="https://linkedin.com/in/MadeshA" target="_blank" rel="noopener noreferrer">
                                <button><img src="/logos/linkedinw.svg" alt="LinkedIn" className="social-icon" /></button>
                            </a>
                            <a href="https://discord.com/users/1331216531362811968" target="_blank" rel="noopener noreferrer">
                                <button><img src="/logos/discordw.svg" alt="Discord" className="social-icon" /></button>
                            </a>
                            <a href="https://www.reddit.com/user/Madesh_A/" target="_blank" rel="noopener noreferrer">
                                <button><img src="/logos/redditw.svg" alt="Reddit" className="social-icon" /></button>
                            </a>
                            <a href="https://instagram.com/_mad_max_clicks_" target="_blank" rel="noopener noreferrer">
                                <button><img src="/logos/instagramw.svg" alt="Instagram" className="social-icon" /></button>
                            </a>
                            <a href="https://www.facebook.com/share/1HhfoL82CT/" target="_blank" rel="noopener noreferrer">
                                <button><img src="/logos/facebookw.svg" alt="Facebook" className="social-icon" /></button>
                            </a>
                        </div>
                        <div className="resume-section">
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="resume-btn">
                                    <i className="fas fa-download resume-icon"></i>
                                    Resume
                                </button>
                            </a>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="image-wrapper">
                            <img src={meLego} alt="Madesh LEGO" className="lego-img" />
                        </div>
                    </div>
                </div>
            </section>
        </header>
    );
};

export default Header;