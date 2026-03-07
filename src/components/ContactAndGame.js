import React from 'react';
import Contact from './Contact';
import ReactionTimer from './ReactionTimer';

const ContactAndGame = () => {
return (
    <div className="flex justify-center gap-20 px-[60px] py-[60px] flex-wrap min-h-screen box-border bg-black text-[#e0e0e0]">
        <Contact />
        <ReactionTimer />
    </div>
);
};

export default ContactAndGame;
