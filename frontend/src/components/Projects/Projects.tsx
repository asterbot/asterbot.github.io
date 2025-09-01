import React, { useState } from 'react';
import './Projects.css';

import projectData from './data/projectsData';
import { Project } from './types';

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

/* CONVENTION: number all images in /projects/{uid}/[number].png where 1.png will be shown at the start and the rest if you click as a slideshow */

const Projects: React.FC = () => {

  // First one contains the project uid
  //   2nd one contains how many slides there are
  const [open, setOpen] = useState<Project|null>(null);

  return (
    <div className="projects-container">
      <h1 className="projects-title">Projects</h1>
      <div className="projects-grid">
        {projectData.map((project, index) => (
          <div key={index} className="project-card">
            {project.tryItOut && (
              <div className="try-banner">Try it out!</div>
            )}

            <h3 className="project-title">{project.title}</h3>
            
            <div className="project-image-container" onClick={() => setOpen(project)}>
              <img 
                src={'/projects/' + project.uid + '/thumbnail.png'} 
                alt={project.title + " project image"} 
                width={280} 
                height={174} 
                className="project-image"
              />
              <div className="image-overlay">
                <span className="overlay-text">View Gallery</span>
              </div>
            </div>

            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {project.tags.map((tech, techIndex) => (
                <span key={techIndex} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="project-links">
              {project.sources.map((source, sourceIndex) => (
                <a key={sourceIndex} href={source.sourceLink} className="project-link" target="_blank" rel="noreferrer">
                  {source.sourceDomain}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Lightbox 
        open = {open != null}
        close = {() => setOpen(null)}
        slides = {Array.from
          ({length: open?.numImages || 1}, (_, i) => {return {src: '/projects/' + open?.uid + '/' + (i+1) as string + '.png'}})
        }
        plugins={[Thumbnails]}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.7)"
          }
        }}
      
      />


    </div>
  );
};

export default Projects;
