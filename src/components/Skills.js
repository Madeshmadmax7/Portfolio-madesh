import React from 'react';
import './Header.css';

const Skills = () => {
return (
    <header className="header-wrapper">
        <br></br>
        <br></br>
        <br></br>
        <section className="skills-section">
            <div className="container">
                <div className="skills-grid">
                {[
                    { name: 'C++', logo: '/logos/cplusplus.svg' },
                    { name: 'Java', logo: '/logos/java.svg' },
                    { name: 'Python', logo: '/logos/python.svg' },
                    { name: 'React', logo: '/logos/react.svg' },
                    { name: 'Spring Boot', logo: '/logos/springboot.svg' },
                    { name: 'AWS', logo: '/logos/amazonwebservices.svg' },
                    { name: 'Git', logo: '/logos/git.svg' },
                    { name: 'HTML', logo: '/logos/html5.svg' },
                    { name: 'CSS', logo: '/logos/css3.svg' },
                    { name: 'MySQL', logo: '/logos/mysql.svg' },
                    { name: 'Figma', logo: '/logos/figma.svg' },
                    { name: 'MongoDB', logo: '/logos/mongodb.svg' },
                    { name: 'Docker', logo: '/logos/docker.svg' },
                    { name: 'JavaScript', logo: '/logos/javascript.svg' },
                ].map((skill, index) => (
                    <div key={index} className={`skill-card white-box`}>
                    <img src={skill.logo} alt={skill.name} className="skill-icon" />
                    <span>{skill.name}</span>
                    </div>
                ))}
                </div>
            </div>
        </section>
    </header>
);
};

export default Skills;
