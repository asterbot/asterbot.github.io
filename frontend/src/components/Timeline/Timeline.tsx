import React from 'react';
import './Timeline.css';
import { TermType } from './data/types';
import timelineEvents from './data/timelineData';


function getColor(subject: string): string{
    // Get colour of course code by subject
    switch (subject){
        case "CS":
          return "var(--peri)"
        case "MATH":
        case "STAT":
        case "CO":
          return "var(--pink)"
        case "PHYS":
          return "var(--lav)"
        default:
          return "var(--red)"
    }
}


const Timeline: React.FC = () => {
  return (
    <div>
      <div className="section-rule"><span className="section-path timeline-accent">~/timeline</span></div>
      <h1 className="section-title timeline-accent">Timeline</h1>

      <div className="timeline">
        {timelineEvents.map((event, index) => {
          const isWork = event.termType === TermType.WorkTerm;
          const dotColor = isWork ? 'var(--red)' : 'var(--peri)';
          return (
            <div key={index} className="timeline-entry">
              <div className="timeline-spine">
                <div className="timeline-dot" style={{ color: dotColor }}>●</div>
                <div className="timeline-line" />
              </div>

              <div className="timeline-body">
                <div className="timeline-date">
                  {event.date}  <span style={{ color: dotColor }}>{isWork ? '[work]' : '[study]'}</span>
                </div>
                <div className="timeline-heading">{event.title}</div>

                <div className="timeline-subtitle">
                  {event.company && (
                    <img
                      src={'/companies/' + event.company.uid + '.png'}
                      width={26}
                      height={26}
                      className="company-logo"
                      alt={event.company.name}
                    />
                  )}
                  <span>{event.description}</span>
                  {event.company && (
                    <span>@ <a href={event.company.link} target="_blank" rel="noopener noreferrer" className="underline-link">{event.company.name}</a></span>
                  )}
                </div>

                {event.courses.length !== 0 && (
                  <div className="courses">
                    <div className="courses-heading">COURSES</div>
                    {event.courses.map((course, i) => (
                      <div key={i} className="course">
                        <span style={{ color: getColor(course.subject) }}>{course.subject} {course.courseCode}</span>
                        {'  '}
                        <span className="course-description">{course.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default Timeline;
