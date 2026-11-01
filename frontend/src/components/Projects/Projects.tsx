import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

import projectData from './data/projectsData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faItchIo } from '@fortawesome/free-brands-svg-icons';
import { faDownload, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Project, SourceDomain, thumbnailSrc } from './data/types';
import ImageModal from './ImageModal';

const sourceIcons: Record<SourceDomain, IconDefinition> = {
  [SourceDomain.GitHub]: faGithub,
  [SourceDomain.ItchIO]: faItchIo,
  [SourceDomain.DevPost]: faTrophy,
  [SourceDomain.Releases]: faDownload,
};

/* CONVENTION: number all images in /projects/{uid}/[number].png (or .gif, listed in `gifs`) where 1 will be shown at the start and the rest if you click as a slideshow */

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
          <div key={project.uid} className="project-card" data-rm={`project:${project.uid}`}>
            <div className="project-heading">
              <span className="project-title">{project.title}</span>
              {project.tryItOut && (project.playPath
                ? <Link to={project.playPath} className="try-banner try-banner-link">Try it out!</Link>
                : <span className="try-banner">Try it out!</span>)}
            </div>

            <button type="button" className="link-button project-image-container" onClick={() => openModal(project)}>
              <img
                src={thumbnailSrc(project)}
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

            {(project.sources.length > 0 || project.playPath) && (
              <div className="project-links">
                {project.playPath && (
                  <Link to={project.playPath} className="underline-link">$ ./play</Link>
                )}
                {project.sources.map((source) => (
                  <a key={source.sourceLink} href={source.sourceLink} className="underline-link source-link" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={sourceIcons[source.sourceDomain]} className="source-icon" />
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
