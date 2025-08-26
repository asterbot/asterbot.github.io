import { Term, TermType, Course } from "../types";


const timelineEvents: Term [] =  [
    {
        date: "Sept 2022 - Dec 2022",
        title: "1A",
        description: "Welcome to Uwaterloo!",
        courses:[
            { subject: "CS", courseCode: 145, description: "Designing Functional Programs (Adv)"},
            { subject: "MATH", courseCode: 135, description: "Algebra I"},
            { subject: "MATH", courseCode: 137, description: "Calculus I"},
            { subject: "SPCOM", courseCode: 223, description: "Public Speaking"},
            { subject: "PHYS", courseCode: 121, description: "Mechanics"}
        ],
        termType: TermType.StudyTerm,
    },
    {
        date: "Sept 2022 - Dec 2022",
        title: "1A",
        description: "Welcome to Uwaterloo!",
        courses:[
            { subject: "CS", courseCode: 145, description: "Designing Functional Programs (Adv)"},
            { subject: "MATH", courseCode: 135, description: "Algebra I"},
            { subject: "MATH", courseCode: 137, description: "Calculus I"},
            { subject: "SPCOM", courseCode: 223, description: "Public Speaking"},
            { subject: "PHYS", courseCode: 121, description: "Mechanics"}
        ],
        termType: TermType.StudyTerm,
    },
]

export default timelineEvents;
