import React from 'react';
import img1 from '../project-images/1.png';
import img2 from '../project-images/2.png';
import img3 from '../project-images/3.png';
import img4 from '../project-images/4.png';
import img5 from '../project-images/5.png';
import img6 from '../project-images/6.png';
import img7 from '../project-images/7.png';
import img8 from '../project-images/8.png';
import img9 from '../project-images/9.png';
import img10 from '../project-images/10.png';
import './Projects.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const projects = [
    {
        title: 'StayFinder',
        desc: 'A full-stack hotel booking platform built with React, Spring Boot, and MySQL.',
        src: img10,
        github: 'https://github.com/Madeshmadmax7/stayfinder',
        live: 'https://stayfinderrr.netlify.app'
    },
    {
        title: 'Disqord',
        desc: 'A Clonned version of Discord.',
        src: img8,
        github: 'https://github.com/Madeshmadmax7/discord-clone',
        live: 'https://disqord.netlify.app'
    },
    {
        title: 'Portfolio',
        desc: 'My personal Portfolio.',
        src: img9,
        github: 'https://github.com/Madeshmadmax7/portfolio',
        live: 'https://madeshdev.netlify.app'
    },
    {
        title: 'UI Crate',
        desc: 'A collection of ready to use react components for your projects.',
        src: img7,
        github: 'https://github.com/Madeshmadmax7/uicrate',
        live: 'https://uicrate.netlify.app'
    },
    {
        title: 'Occasio',
        desc: 'A stylish and responsive event management website designed to facilitate event bookings and information sharing.',
        src: img1,
        github: 'https://github.com/Madeshmadmax7/occasio',
        live: 'https://madeshmadmax7.github.io/occasio/'
    },
    {
        title: 'Ebook store',
        desc: 'An online platform to browse, buy, and download ebooks with a user-friendly interface.',
        src: img2,
        github: 'https://github.com/Madeshmadmax7/ebook-store',
        live: 'https://madeshmadmax7.github.io/ebook-store/'
    },
    {
        title: 'Train Ticket Booking',
        desc: 'A React-based web application for booking train tickets with seat selection and payment integration.',
        src: img3,
        github: 'https://github.com/Madeshmadmax7/train-ticket-app-react',
        live: 'https://madeshmadmax7.github.io/train-ticket-app-react/'
    },
    {
        title: 'Trek',
        desc: 'A trekking destination booking website allowing users to explore and book trekking trips.',
        src: img4,
        github: 'https://github.com/Madeshmadmax7/Trekking-destination-booking',
        live: 'https://madeshmadmax7.github.io/Trekking-destination-booking/'
    },
    {
        title: 'Wallpaper download',
        desc: 'A website where users can easily browse and download a variety of high-quality wallpapers.',
        src: img5,
        github: 'https://github.com/Madeshmadmax7/Wallpaperdownload-website',
        live: 'https://madeshmadmax7.github.io/Wallpaperdownload-website/'
    },
    {
        title: 'Planet Earth',
        desc: 'A visually engaging project showcasing planet-related content with interactive features for users.',
        src: img6,
        github: 'https://github.com/Madeshmadmax7/Planet-Earth-Website',
        live: 'https://planet-earth-iumuxjrv7-madeshs-projects-9efc3cf2.vercel.app/main.html'
    },
];

const Projects = () => {
    return (
        <>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <h6 className='head'>Projects</h6>
            <div className="projects-container">
                {projects.map((project, index) => (
                    <>
                        <div className="project-card" key={index}>
                            <div className="project-image-wrapper">
                                <img src={project.src} alt={project.title} className="project-image" />
                            </div>
                            <div className="project-info">
                                <h3>{project.title}</h3>
                                <p>{project.desc}</p>
                                <div className="project-buttons">
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-btn1">
                                        <i className="fa-brands fa-github" style={{ marginRight: '8px' }}></i>Source
                                    </a>
                                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-btn2">
                                        <i className="fa-solid fa-earth-asia" style={{ marginRight: '8px' }}></i>Visit
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
                ))}
            </div>
        </>
    );
};

export default Projects;
