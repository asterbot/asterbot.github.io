import React, { useState } from 'react';
import './Projects.css';

import projectData from './data/projectsData';
import { Project } from './data/types';
import ImageModal from './ImageModal';

/* CONVENTION: number all images in /projects/{uid}/[number].png where 1.png will be shown at the start and the rest if you click as a slideshow */

const Projects: React.FC = () => {
  const [open, setOpen] = useState<Project | null>(null);
  const [index, setIndex] = useState(0);

  const openModal = (project: Project) => { setOpen(project); setIndex(0); };

  return (
    <div>
      <div className="section-rule"><span className="section-path projects-accent">~/projects</span></div>
      <h1 className="section-title projects-accent">Projects</h1>
      <div className="section-hint">Click a thumbnail to open the screenshots</div>

      <div className="projects-grid">
        {projectData.map((project) => (
          <div key={project.uid} className="project-card">
            <div className="project-heading">
              <span className="project-title">{project.title}</span>
              {project.tryItOut && <span className="try-banner">Try it out!</span>}
            </div>

            <button type="button" className="link-button project-image-container" onClick={() => openModal(project)}>
              <img
                src={`/projects/${project.uid}/thumbnail.png`}
                alt={project.title + ' project image'}
                className="project-image"
              />
              <span className="project-image-overlay">
                <span className="project-open-badge">
                  $ open ./images <span className="project-open-count">({project.numImages})</span>
                </span>
              </span>
            </button>

            <p className="project-description">{project.description}</p>

            <div className="project-tech">
              {project.tags.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>

            {project.sources.length > 0 && (
              <div className="project-links">
                {project.sources.map((source) => (
                  <a key={source.sourceLink} href={source.sourceLink} className="underline-link" target="_blank" rel="noopener noreferrer">
                    {source.sourceDomain}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {open && (
        <ImageModal project={open} index={index} onIndexChange={setIndex} onClose={() => setOpen(null)} />
      )}
    </div>
  );
};

export default Projects;
