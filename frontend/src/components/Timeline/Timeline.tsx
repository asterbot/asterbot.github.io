import React from 'react';
import { Fragment } from "react";

import './Timeline.css';

// // Icons for timeline
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import { TermType } from './types';

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
              <p className="vertical-timeline-element-subtitle">{event.description}</p>
              {event.courses.length!==0 ? <br />  : ""}
              {event.courses.length!==0 ? "Courses:"  : ""}
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
