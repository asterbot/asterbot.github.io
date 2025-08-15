import React from 'react';

const timelineData = [
  {
    title: 'Started at UWaterloo',
    date: 'Sept 2022',
    description: 'Began my journey as a Computer Science student at the University of Waterloo.'
  },
  {
    title: '1A Term',
    date: 'Fall 2022',
    description: 'Completed foundational CS courses and joined the CS Club.'
  },
  {
    title: 'First Internship',
    date: 'Summer 2023',
    description: 'Worked as a Software Developer Intern at TechCorp, building web applications.'
  },
  {
    title: '2A Term',
    date: 'Fall 2023',
    description: 'Explored algorithms, data structures, and participated in hackathons.'
  },
  {
    title: 'Second Internship',
    date: 'Spring 2024',
    description: 'Interned at StartupX, focusing on AI and machine learning projects.'
  },
];

const Timeline: React.FC = () => (
  <div style={{ background: '#23272e', minHeight: '100vh', padding: '2rem' }}>
    <h2 style={{ color: '#ffcc00', textAlign: 'center', marginBottom: '2rem' }}>Timeline</h2>
    <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 4, background: '#ffcc00', borderRadius: 2 }}></div>
      {timelineData.map((entry, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2.5rem', position: 'relative' }}>
          <div style={{ width: 56, textAlign: 'center', zIndex: 1 }}>
            <div style={{ background: '#ffcc00', borderRadius: '50%', width: 32, height: 32, margin: '0 auto', border: '2px solid #fff', marginBottom: 8 }}></div>
          </div>
          <div style={{ background: '#181a20', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', padding: '1.5rem', marginLeft: 16, flex: 1 }}>
            <div style={{ color: '#ffcc00', fontWeight: 'bold', fontSize: 18 }}>{entry.title}</div>
            <div style={{ color: '#aaa', fontSize: 14, marginBottom: 8 }}>{entry.date}</div>
            <div style={{ color: '#eaeaea', fontSize: 15 }}>{entry.description}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Timeline;


