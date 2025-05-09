import React, { useState } from 'react';
import './Contact.css';
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
    <div className="contact-form-container">
    <h1>
        Let’s Build Something <span>Great</span>
    </h1>
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea placeholder="Message" rows="5" required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
        <button type="submit">
        Send<span className="arrow">→</span>
        </button>
    </form>
    </div>
);
};

export default Contact;
