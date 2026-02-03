import React from 'react';
import { Fragment } from "react";

import './Timeline.css';

// // Icons for timeline
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import { TermType } from './data/types';

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import timelineEvents from './data/timelineData';



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
    <Fragment>
      <h1 className="timeline-title">Timeline</h1>
      <VerticalTimeline>
        {timelineEvents.map((event, index) => (
          <VerticalTimelineElement 
          key={index}
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#0e0f0f', color: 'white', border:'2px solid rgb(0 255 144)' }}
          date={event.date}
          icon={event.termType === TermType.WorkTerm ? <WorkOutlineOutlinedIcon /> : <SchoolOutlinedIcon />}
          >
              <h3 className="vertical-timeline-element-title">{event.title}</h3>
              <div className="vertical-timeline-element-subtitle">
                {event.company && (
                  <img 
                    src={'/companies/' + event.company.uid + '.png'} 
                    width={40} 
                    height={40} 
                    className="company-logo"
                    alt={event.company.name}
                  />
                )}
                <p className="event-description">
                  {event.description}
                  {event.company && " @ "}
                  {event.company && (
                    <u><a href={event.company.link} target="_blank" rel="noreferrer" className="company-link">{event.company.name}</a></u>
                  )}
                </p>
              </div>
              {event.courses.length!==0 && (<div className="courses-heading"><br />Courses:</div>)}
              <ul className='list-group'>
                {event.courses.map((course, index) => {
                  return (
                    <li key={index} className={"list-group-item list-group-item-" + getColor(course.subject)}>
                      {course.subject} {course.courseCode}: {course.description}
                    </li>
                  )
                })}
              </ul>

          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </Fragment>
  );
};


export default Timeline;
