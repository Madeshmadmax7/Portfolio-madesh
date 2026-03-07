import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
    };

    emailjs.send('service_w9z4l7j', 'template_7zl7vd9', templateParams, '-VVCvTZdfwJe4QBBB')
    .then(() => {
        alert('Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
    })
    .catch((error) => {
        alert('Failed to send message. Please try again.');
        console.error('EmailJS error:', error);
    });
};

return (
    <div className="flex-1 max-w-[40%] w-full bg-[#101010] text-white py-[40px] px-10 rounded-[15px] flex flex-col justify-between">
    <h1 className="text-[28px] leading-[1.3] mb-5 text-left text-white">
        Let's Build Something <span className="text-[rgb(17,0,255)] font-bold">Great</span>
    </h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-[25px]">
        <input
            type="text" placeholder="Name" required value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border-0 border-b border-[#888] py-3 px-[5px] text-white text-[15px] outline-none transition-colors duration-300 placeholder-[#ccc] focus:border-b focus:border-[#0004ff]"
        />
        <input
            type="email" placeholder="Email address" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-0 border-b border-[#888] py-3 px-[5px] text-white text-[15px] outline-none transition-colors duration-300 placeholder-[#ccc] focus:border-b focus:border-[#0004ff]"
        />
        <textarea
            placeholder="Message" rows="5" required value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-transparent border-0 border-b border-[#888] py-3 px-[5px] text-white text-[15px] outline-none transition-colors duration-300 placeholder-[#ccc] resize-none focus:border-b focus:border-[#0004ff]"
        />
        <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-transparent border border-[#6366f1] text-white font-bold text-base cursor-pointer py-3 rounded-lg transition-all duration-300 hover:bg-[#6366f1] hover:text-black"
        >
            Send<span className="text-[20px]">→</span>
        </button>
    </form>
    </div>
);
};

export default Contact;
