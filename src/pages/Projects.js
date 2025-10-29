// src/pages/Projects.js
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../components/Projects.css';
import projectData from '../data/projectsData';

const Projects = () => {
    return (
        <div style={{ marginTop: "5rem" }}>
            <h6 className='head'>Projects</h6>
            <div className="projects-container">
                {projectData.map((project, index) => (
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
                ))}
            </div>
        </div>
    );
};

export default Projects;
