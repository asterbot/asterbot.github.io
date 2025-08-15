import React from 'react';

const projects = [
  {
    title: 'AsterBot (Chatbot Portfolio)',
    description: 'A conversational AI portfolio inspired by asterbot.github.io, featuring interactive terminal and blog graph.',
    github: 'https://github.com/asterbot',
    demo: 'https://asterbot.github.io',
    image: 'https://placehold.co/400x200?text=AsterBot',
  },
  {
    title: 'CS Study Notes',
    description: 'A collection of notes and resources from UWaterloo CS courses.',
    github: 'https://github.com/asterbot/cs-notes',
    demo: '',
    image: 'https://placehold.co/400x200?text=CS+Notes',
  },
  {
    title: 'Personal Website',
    description: 'My personal website and portfolio, built with React and TypeScript.',
    github: 'https://github.com/asterbot/portfolio',
    demo: '',
    image: '', // No image provided, will use placeholder
  },
];

const placeholder = 'https://placehold.co/400x200?text=Project';

const Projects: React.FC = () => (
  <div style={{ background: '#23272e', minHeight: '100vh', padding: '2rem' }}>
    <h2 style={{ color: '#ffcc00', textAlign: 'center', marginBottom: '2rem' }}>Projects</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
      {projects.map((proj, idx) => (
        <div key={idx} style={{ background: '#181a20', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', padding: '2rem', minWidth: 280, maxWidth: 340 }}>
          <img src={proj.image || placeholder} alt={proj.title} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 16, background: '#eee' }} />
          <h3 style={{ color: '#ffcc00', marginBottom: 8 }}>{proj.title}</h3>
          <p style={{ color: '#eaeaea', minHeight: 60 }}>{proj.description}</p>
          <div style={{ marginTop: 16 }}>
            {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{ marginRight: 16, color: '#00bfff', textDecoration: 'none' }}>GitHub</a>}
            {proj.demo && <a href={proj.demo} target="_blank" rel="noopener noreferrer" style={{ color: '#00bfff', textDecoration: 'none' }}>Demo</a>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Projects;

