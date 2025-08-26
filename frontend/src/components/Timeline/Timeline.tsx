import React from 'react';

import timelineEvents from './data/timelineData';

import './Timeline.css';

// Icons for timeline
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import { TermType } from './types';

function getColor(subject: string): string{
    // Get color of subject block
    switch (subject){
        case "CS":
          return "success"
        case "MATH":
          return "primary"
        case "STAT":
          return "primary"
        case "CO":
          return "primary"
        case "PHYS":
          return "info"
        default:
          return "warning"
    }
}


const Timeline: React.FC = () => {
  return (
    <div className="timeline-container">
      <h1 className="timeline-title">Timeline</h1>
      <div className="timeline">
        {timelineEvents.map((event, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot">
              {event.termType === TermType.StudyTerm ? <SchoolOutlinedIcon /> : <WorkOutlineOutlinedIcon />}
            </div>
            <div className="timeline-content">
              <div className="timeline-date">{event.date}</div>
              <h3 className="timeline-item-title">{event.title}</h3>
              <p className="timeline-description">{event.description}</p>
              Courses:
                <ul className="list-group">
                  {event.courses.map((course, index) => {
                    return(
                      <li key={index} className={"list-group-item list-group-item-" + getColor(course.subject)}>
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
