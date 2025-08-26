import React from 'react';

import timelineEvents from './data/timelineData';

import './Timeline.css';

const color_map={
  "CS":"success",
  "MATH": "primary",
  "STAT": "primary",
  "CO": "primary",
  "PHYS": "info"
}

const Timeline: React.FC = () => {
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
                <ul className="list-group">
                  {event.courses.map((course, index) => {
                    
                    // console.log(color_map[course.subject])
                    
                    return(
                      <li key={index} className="list-group-item">
                        {course.subject} {course.courseCode}: {course.description}
                      </li>
                    )
                  })}
                </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Timeline;
