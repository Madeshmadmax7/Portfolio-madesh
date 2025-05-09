import React from 'react';
import Contact from './Contact';
import ReactionTimer from './ReactionTimer';
import './ContactAndGame.css';

const ContactAndGame = () => {
return (
    <div className="container-wrapper">
    <Contact />
    <ReactionTimer />
    </div>
);
};

export default ContactAndGame;
