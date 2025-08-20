import React from 'react';
import './Timeline.css';

const Timeline: React.FC = () => {
  const timelineEvents = [
    {
      date: '2023 - Present',
      title: 'Software Engineer',
      description: 'Working on innovative web applications and contributing to open-source projects.'
    },
    {
      date: '2022 - 2023',
      title: 'Game Developer Intern',
      description: 'Developed gameplay mechanics and contributed to the development of indie games.'
    },
    {
      date: '2021 - 2022',
      title: 'Research Assistant',
      description: 'Conducted research in machine learning applications for creative technologies.'
    },
    {
      date: '2019 - 2023',
      title: 'Computer Science Degree',
      description: 'Graduated with honors, specializing in software engineering and game development.'
    }
  ];

  return (
    <div className="timeline-container">
      <h1 className="timeline-title">Timeline</h1>
      <div className="timeline">
        {timelineEvents.map((event, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-date">{event.date}</div>
              <h3 className="timeline-item-title">{event.title}</h3>
              <p className="timeline-description">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
