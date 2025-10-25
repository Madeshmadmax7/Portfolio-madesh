import React from 'react';
import Contact from './Contact';
import ReactionTimer from './ReactionTimer';
import './ContactAndGame.css';
import GithubContributionCard from './GithubContributionCard';

const ContactAndGame = () => {
return (
    <div className="container-wrapper">
        <Contact />
        <ReactionTimer />
        <GithubContributionCard username="Madeshmadmax7" />
    </div>
);
};

export default ContactAndGame;
