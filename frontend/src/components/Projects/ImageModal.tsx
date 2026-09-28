import React, { useEffect, useCallback } from 'react';
import { Project } from './data/types';

type ImageModalProps = {
  project: Project;
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
};

// Fullscreen screenshot viewer: arrows / ← → to browse, thumbnail strip, esc to close
const ImageModal: React.FC<ImageModalProps> = ({ project, index, onIndexChange, onClose }) => {
  const step = useCallback(
    (delta: number) => onIndexChange((index + delta + project.numImages) % project.numImages),
    [index, project.numImages, onIndexChange]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [step, onClose]);

  const src = (i: number) => `/projects/${project.uid}/${i + 1}.png`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-frame" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bar">
          <span className="modal-path">~/projects/{project.uid}/images</span>
          <span className="modal-counter">{index + 1}/{project.numImages}</span>
          <span className="modal-spacer" />
          <span className="modal-hint">&larr; &rarr; to browse &middot; esc to close</span>
          <button type="button" className="link-button modal-close" aria-label="Close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-stage">
          <img src={src(index)} alt={`${project.title} screenshot ${index + 1}`} className="modal-image" />
          <button type="button" className="link-button modal-arrow modal-prev" aria-label="Previous screenshot" onClick={() => step(-1)}>&#8249;</button>
          <button type="button" className="link-button modal-arrow modal-next" aria-label="Next screenshot" onClick={() => step(1)}>&#8250;</button>
        </div>

        <div className="modal-thumbs">
          {Array.from({ length: project.numImages }, (_, i) => (
            <button key={i} type="button" className="link-button" aria-label={`Screenshot ${i + 1}`} onClick={() => onIndexChange(i)}>
              <img src={src(i)} alt="" className={`modal-thumb ${i === index ? 'active' : ''}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
