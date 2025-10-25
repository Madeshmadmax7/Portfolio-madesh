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
import img11 from '../project-images/11.png';
import img12 from '../project-images/12.png';
import './Projects.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const projects = [
    {
        title: 'Monastery360',
        desc: 'Built an immersive 360° virtual tour PWA to digitally preserve and showcase Sikkim’s monasteries. Users can explore sites virtually, view digital archives of murals and manuscripts, and interact with hotspots for cultural insights. Developed with React, Vite, Tailwind, A-Frame, and Pannellum, the app works offline for accessibility in remote regions, supporting tourism, education, and heritage preservation.',
        src: img12,
        github: 'https://github.com/Madeshmadmax7/SacredSikkim',
        live: 'https://monastery360.netlify.app/',
    },
    {
        title: 'BatsUp',
        desc: 'A full-stack cricket booking and management platform built with Spring Boot and MySQL, featuring real-time match, team, and player tracking.',
        src: img11,
        github: 'https://github.com/Madeshmadmax7/BatsUp',
        live: 'https://batsup.netlify.app/',
    },
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


// import React, { useState } from 'react';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import './Projects.css';

// import img1 from '../project-images/1.png';
// import img2 from '../project-images/2.png';
// import img3 from '../project-images/3.png';
// import img4 from '../project-images/4.png';
// import img5 from '../project-images/5.png';
// import img6 from '../project-images/6.png';
// import img7 from '../project-images/7.png';
// import img8 from '../project-images/8.png';
// import img9 from '../project-images/9.png';
// import img10 from '../project-images/10.png';
// import img11 from '../project-images/11.png';
// import img12 from '../project-images/12.png';

// const projects = [
//     {
//         title: 'Monastery360',
//         desc: 'Built an immersive 360° virtual tour PWA to digitally preserve and showcase Sikkim’s monasteries...',
//         src: img12,
//         github: 'https://github.com/Madeshmadmax7/SacredSikkim',
//         live: 'https://monastery360.netlify.app/',
//     },
//     {
//         title: 'BatsUp',
//         desc: 'A full-stack cricket booking and management platform built with Spring Boot and MySQL...',
//         src: img11,
//         github: 'https://github.com/Madeshmadmax7/BatsUp',
//         live: 'https://batsup.netlify.app/',
//     },
//     {
//         title: 'StayFinder',
//         desc: 'A full-stack hotel booking platform built with React, Spring Boot, and MySQL.',
//         src: img10,
//         github: 'https://github.com/Madeshmadmax7/stayfinder',
//         live: 'https://stayfinderrr.netlify.app',
//     },
//     {
//         title: 'Disqord',
//         desc: 'A cloned version of Discord.',
//         src: img8,
//         github: 'https://github.com/Madeshmadmax7/discord-clone',
//         live: 'https://disqord.netlify.app',
//     },
//     {
//         title: 'Portfolio',
//         desc: 'My personal Portfolio.',
//         src: img9,
//         github: 'https://github.com/Madeshmadmax7/portfolio',
//         live: 'https://madeshdev.netlify.app',
//     },
//     {
//         title: 'UI Crate',
//         desc: 'A collection of ready to use React components for your projects.',
//         src: img7,
//         github: 'https://github.com/Madeshmadmax7/uicrate',
//         live: 'https://uicrate.netlify.app',
//     },
//     {
//         title: 'Occasio',
//         desc: 'A stylish and responsive event management website.',
//         src: img1,
//         github: 'https://github.com/Madeshmadmax7/occasio',
//         live: 'https://madeshmadmax7.github.io/occasio/',
//     },
//     {
//         title: 'Ebook store',
//         desc: 'An online platform to browse, buy, and download ebooks.',
//         src: img2,
//         github: 'https://github.com/Madeshmadmax7/ebook-store',
//         live: 'https://madeshmadmax7.github.io/ebook-store/',
//     },
//     {
//         title: 'Train Ticket Booking',
//         desc: 'A React-based web app for booking train tickets.',
//         src: img3,
//         github: 'https://github.com/Madeshmadmax7/train-ticket-app-react',
//         live: 'https://madeshmadmax7.github.io/train-ticket-app-react/',
//     },
//     {
//         title: 'Trek',
//         desc: 'A trekking destination booking website.',
//         src: img4,
//         github: 'https://github.com/Madeshmadmax7/Trekking-destination-booking',
//         live: 'https://madeshmadmax7.github.io/Trekking-destination-booking/',
//     },
//     {
//         title: 'Wallpaper download',
//         desc: 'A website to browse and download wallpapers.',
//         src: img5,
//         github: 'https://github.com/Madeshmadmax7/Wallpaperdownload-website',
//         live: 'https://madeshmadmax7.github.io/Wallpaperdownload-website/',
//     },
//     {
//         title: 'Planet Earth',
//         desc: 'An interactive project showcasing planet-related content.',
//         src: img6,
//         github: 'https://github.com/Madeshmadmax7/Planet-Earth-Website',
//         live: 'https://planet-earth-iumuxjrv7-madeshs-projects-9efc3cf2.vercel.app/main.html',
//     },
// ];

// const Projects = () => {
//     const [visibleCount, setVisibleCount] = useState(4);

//     const loadMore = () => setVisibleCount((prev) => prev + 4);

//     return (
//         <div style={{ marginTop: "5rem" }}>
//             <br></br>
//             <br></br>
//             <br></br>
//             <br></br>
//             <br></br>
//             <br></br>
//             <br></br>
//             <h6 className='head'>Projects</h6>
//             <div className="projects-container">
//                 {projects.slice(0, visibleCount).map((project, index) => (
//                     <div className="project-card" key={index}>
//                         <div className="project-image-wrapper">
//                             <img src={project.src} alt={project.title} className="project-image" />
//                         </div>
//                         <div className="project-info">
//                             <h3>{project.title}</h3>
//                             <p>{project.desc}</p>
//                             <div className="project-buttons">
//                                 <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-btn1">
//                                     <i className="fa-brands fa-github" style={{ marginRight: '8px' }}></i>Source
//                                 </a>
//                                 <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-btn2">
//                                     <i className="fa-solid fa-earth-asia" style={{ marginRight: '8px' }}></i>Visit
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {visibleCount < projects.length && (
//                 <div className="load-more-container">
//                     <button className="load-more-btn" onClick={loadMore}>
//                         <span class="loader">Explore</span>
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Projects;
