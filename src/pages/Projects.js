// src/pages/Projects.js
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import projectData from '../data/projectsData';

const Projects = () => {
    return (
        <div style={{ marginTop: "5rem" }}>
            <h6 className="font-['Exo_2',sans-serif] text-[2rem] text-white font-bold text-center mt-2 mb-6">Projects</h6>
            <div className="flex flex-col gap-6 px-6 max-w-[1200px] mx-auto">
                {projectData.map((project, index) => (
                    <div className="project-card max-w-[600px] mx-auto bg-gradient-to-b from-black/60 rounded-[10px] overflow-hidden text-white text-[0.9rem] w-full" key={index}>
                        <div className="project-image-wrapper p-3 transition-[background-image] duration-300">
                            <img src={project.src} alt={project.title} className="w-full block rounded-[6px] transition-transform duration-300 hover:-translate-y-1" />
                        </div>
                        <div className="pt-3 px-3 pb-3 mt-[-5px] bg-gradient-to-b from-[rgba(0,0,0,0.9)] via-[rgba(0,0,0,0.7)] to-transparent">
                            <h3 className="m-0 mb-[0.4rem] text-[1.1rem]">{project.title}</h3>
                            <p className="m-0 mb-3 text-[0.9rem] text-[#bbb]">{project.desc}</p>
                            {project.stack && project.stack.length > 0 && (
                                <div className="flex gap-[6px] flex-wrap mb-3">
                                    {project.stack.map(tech => (
                                        <span key={tech} className="text-[10px] border border-white/15 bg-white/5 text-white/60 px-[8px] py-[2px] rounded-full">{tech}</span>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-3 flex-wrap">
                                {project.inProgress ? (
                                    <div className="flex items-center gap-2 py-[0.4rem] px-4 rounded-[6px] text-[0.85rem] border border-[#333] bg-[#1a1a1a] text-[#888] cursor-not-allowed select-none">
                                        <div className="w-[14px] h-[14px] border-2 border-[#444] border-t-[#6366f1] rounded-full animate-spin shrink-0"></div>
                                        In progress
                                    </div>
                                ) : (
                                    <>
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="py-[0.4rem] px-3 rounded-[6px] no-underline text-[0.85rem] border border-[#444] transition-colors duration-300 bg-[#222] text-white hover:bg-[#444] hover:text-white">
                                            <i className="fa-brands fa-github" style={{ marginRight: '8px' }}></i>Source
                                        </a>
                                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="py-[0.4rem] px-3 rounded-[6px] no-underline text-[0.85rem] border border-[#444] transition-colors duration-300 bg-white text-black hover:bg-[#444] hover:text-white">
                                            <i className="fa-solid fa-earth-asia" style={{ marginRight: '8px' }}></i>Visit
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
