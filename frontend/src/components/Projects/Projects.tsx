import React from 'react';
import './Projects.css';

import projectData from './data/projectsData';

const Projects: React.FC = () => {

  return (
    <div className="projects-container">
      <h1 className="projects-title">Projects</h1>
      <div className="projects-grid">
        {projectData.map((project, index) => (
          <div key={index} className="project-card">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {project.tags.map((tech, techIndex) => (
                <span key={techIndex} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="project-links">
              {project.sources.map((source, sourceIndex) => (
                <a key={sourceIndex} href={source.sourceLink} className="project-link">
                  {source.sourceDomain}
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
