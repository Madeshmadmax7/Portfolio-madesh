import React from 'react';

const Skills = () => {
    return (
        <section className="py-12">
            <div className="max-w-[1200px] mx-auto px-4 mt-[50px]">
                <h2 className="text-3xl mb-8 text-white text-center">Skills</h2>
                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 4fr))' }}>
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
                        { name: 'Selinium', logo: '/logos/seleniumw.svg' },
                        { name: 'Tailwind', logo: '/logos/tailwindw.svg' },
                        { name: 'Sqlite', logo: '/logos/sqlitew.svg' },
                        { name: 'NodeJS', logo: '/logos/nodejsw.svg' },
                        { name: 'Firebase', logo: '/logos/firebasew.svg' },
                        { name: 'GCP', logo: '/logos/gcpw.svg' },
                        { name: 'Arduino', logo: '/logos/arduinow.svg' },
                    ].map((skill, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center py-12 px-4 rounded-xl transition-transform duration-300 hover:-translate-y-[5px] bg-[#101010] text-white border border-[#444]"
                        >
                            <img src={skill.logo} alt={skill.name} className="w-10 h-10 text-white mb-4 object-contain" />
                            <span>{skill.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;

