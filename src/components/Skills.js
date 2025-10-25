import React from 'react';
import './Header.css';

const Skills = () => {
return (
    <header className="header-wrapper">
        <section className="skills-section">
            <div className="container">
            <h2>Skills</h2>
                <div className="skills-grid">
                {[
                    { name: 'C++', logo: '/logos/cpp2w.svg' },
                    { name: 'Java', logo: '/logos/javaw.svg' },
                    { name: 'Python', logo: '/logos/pythonw.svg' },
                    { name: 'React', logo: '/logos/reactw.svg' },
                    { name: 'Spring Boot', logo: '/logos/springbootw.svg' },
                    { name: 'AWS', logo: '/logos/amazonwebservicesw.svg' },
                    { name: 'Git', logo: '/logos/gitw.svg' },
                    { name: 'HTML', logo: '/logos/html5w.svg' },
                    { name: 'CSS', logo: '/logos/css3w.svg' },
                    { name: 'MySQL', logo: '/logos/mysqlw.svg' },
                    { name: 'Figma', logo: '/logos/figmaw.svg' },
                    { name: 'MongoDB', logo: '/logos/mongodbw.svg' },
                    { name: 'Docker', logo: '/logos/dockerw.svg' },
                    { name: 'JavaScript', logo: '/logos/javascriptw.svg' },
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
