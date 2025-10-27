// src/components/Home.js
import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import ContactAndGame from "../components/ContactAndGame";
import GithubContributionCard from "../components/GithubContributionCard";

const Home = () => {
    return (
        <div className="portfolio-container fade-in">
            <Navbar />
            <section id="home">
                <Header />
            </section>
            <section id="pulse">
                <GithubContributionCard />
            </section>
            <section id="skills">
                <Skills />
            </section>
            <section id="projects">
                <Projects />
            </section>
            <section id="contact">
                <ContactAndGame />
            </section>
        </div>
    );
};

export default Home;
