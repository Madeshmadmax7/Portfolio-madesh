import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import ContactAndGame from "../components/ContactAndGame";
import GithubContributionCard from "../components/GithubContributionCard";
import LeetCodeStatsCard from "../components/LeetCodeStatsCard";
import DuolingoStreakCard from "../components/DuolingoStreakCard";
import TypingChallenge from "../components/TypingChallenge";
// import Testimonials from "../components/Testimonials";

const Home = () => {

    return (
        <div className="portfolio-container fade-in">
            <Navbar />
            <section id="home">
                <Header />
            </section>
            <section id="pulse">
                <div className="w-full max-w-[1300px] mx-auto px-4 lg:px-6 py-6">
                    <h6 className="font-['Exo_2',sans-serif] text-[2rem] text-white font-bold text-center mt-8 mb-8 tracking-[0.01em]">Pulse</h6>
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-stretch">
                        <div className="space-y-6">
                            <GithubContributionCard compact={true} showTitle={false} />
                            <LeetCodeStatsCard username="Madesh_A_12" compact={true} showTitle={false} />
                        </div>
                        <div className="h-full">
                            <DuolingoStreakCard username="MadeshA5" compact={true} showTitle={false} />
                        </div>
                    </div>
                </div>
            </section>
            <section id="typing">
                <TypingChallenge/>
            </section>
            <section id="skills">
                <Skills />
            </section>
            <section id="projects">
                <br></br>
                <br></br>
                <br></br>
                <Projects />
            </section>
            {/* <section id="testimonials">
                <Testimonials />
            </section> */}
            <section id="contact">
                <ContactAndGame />
            </section>
        </div>
    );
};

export default Home;
