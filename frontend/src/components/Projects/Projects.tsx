import React, { useState } from 'react';
import './Projects.css';

import projectData from './data/projectsData';

/* CONVENTION: number all images in /projects/{uid}/[number].png where 1.png will be shown at the start and the rest if you click as a slideshow */

const Projects: React.FC = () => {
  // Current image index per project uid
  const [gallery, setGallery] = useState<Record<string, number>>({});

  const step = (uid: string, count: number, delta: number) =>
    setGallery((g) => ({ ...g, [uid]: ((g[uid] || 0) + delta + count) % count }));

  return (
    <div>
      <div className="section-rule"><span className="section-path projects-accent">~/projects</span></div>
      <h1 className="section-title projects-accent">Projects</h1>
      <div className="section-hint">{projectData.length} entries &middot; click a thumbnail or use &#8249; &#8250; to page through screenshots</div>

      <div className="projects-grid">
        {projectData.map((project) => {
          const idx = (gallery[project.uid] || 0) % project.numImages;
          return (
            <div key={project.uid} className="project-card">
              <div className="project-heading">
                <span className="project-title">{project.title}</span>
                {project.tryItOut && <span className="try-banner">Try it out!</span>}
              </div>

              <div className="project-image-container">
                <img
                  src={`/projects/${project.uid}/${idx + 1}.png`}
                  alt={project.title + ' project image'}
                  onClick={() => step(project.uid, project.numImages, 1)}
                  className="project-image"
                />
                <button type="button" className="link-button gallery-arrow gallery-prev" aria-label="Previous screenshot" onClick={() => step(project.uid, project.numImages, -1)}>&#8249;</button>
                <button type="button" className="link-button gallery-arrow gallery-next" aria-label="Next screenshot" onClick={() => step(project.uid, project.numImages, 1)}>&#8250;</button>
              </div>

              <div className="project-counter">{idx + 1}/{project.numImages}</div>

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
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
