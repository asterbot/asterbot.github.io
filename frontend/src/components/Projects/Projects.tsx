import React from 'react';
import './Projects.css';

const Projects: React.FC = () => {
  const projects = [
    {
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website built with React and TypeScript, featuring a terminal interface and Minecraft-inspired design elements.',
      tech: ['React', 'TypeScript', 'CSS3', 'HTML5'],
      links: [
        { href: '#', label: 'Live Demo' },
        { href: '#', label: 'GitHub' }
      ]
    },
    {
      title: 'Game Development Project',
      description: 'An indie game project showcasing creative gameplay mechanics and innovative design approaches.',
      tech: ['Unity', 'C#', 'Game Design', '3D Modeling'],
      links: [
        { href: '#', label: 'Play Game' },
        { href: '#', label: 'Dev Blog' }
      ]
    },
    {
      title: 'Machine Learning Research',
      description: 'Research project exploring the applications of machine learning in creative domains and interactive systems.',
      tech: ['Python', 'TensorFlow', 'PyTorch', 'Data Science'],
      links: [
        { href: '#', label: 'Paper' },
        { href: '#', label: 'Code' }
      ]
    }
  ];

  return (
    <div className="projects-container">
      <h1 className="projects-title">Projects</h1>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {project.tech.map((tech, techIndex) => (
                <span key={techIndex} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="project-links">
              {project.links.map((link, linkIndex) => (
                <a key={linkIndex} href={link.href} className="project-link">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
