import { Term, TermType } from "../types";


const timelineEvents: Term [] =  [
    {
        date: "Sept 2025 - Dec 2025",
        title: "3B",
        description: "",
        courses:[
            { subject: "CO", courseCode: 456, description: "Introduction to Game Theory"},
            { subject: "CS", courseCode: 480, description: "Introduction to Machine Learning"},
            { subject: "CS", courseCode: 456, description: "Distributed Systems"},
        ],
        termType: TermType.StudyTerm,
    },
    {
        date: "May 2025 - Aug 2025",
        title: "Work Term 4",
        description: "Software Security @ Ford Motors",
        courses:[
            { subject: "CS", courseCode: 348, description: "Database Management"},
        ],
        termType: TermType.WorkTerm,
    },
    {
        date: "Jan 2025 - Apr 2025",
        title: "3A",
        description: "Canon event",
        courses:[
            { subject: "CS", courseCode: 341, description: "Algorithms"},
            { subject: "CS", courseCode: 350, description: "Operating Systems"},
            { subject: "CS", courseCode: 346, description: "App Development"},
            { subject: "CS", courseCode: 370, description: "Numerical Computation"},
            { subject: "MUSIC", courseCode: 290, description: "Video Game Music"},
            { subject: "FR", courseCode: "152", description: "Probability"},
        ],
        termType: TermType.StudyTerm,
    },
    {
        date: "Sept 2024 - Dec 2024",
        title: "Work Term 3",
        description: "Software Developer - Performance Team @ Ford Motors",
        courses:[],
        termType: TermType.WorkTerm,
    },
    {
        date: "May 2024 - Aug 2024",
        title: "2B",
        description: "",
        courses:[
            { subject: "CS", courseCode: 241, description: "Foundations of Sequential Programs"},
            { subject: "CS", courseCode: 240, description: "Data Structures & Data Management"},
            { subject: "MATH", courseCode: 235, description: "Linear Algebra II"},
            { subject: "PHYS", courseCode: 234, description: "Quantum Physics I"},
            { subject: "ENGL", courseCode: "210E", description: "Probability"},
            { subject: "FR", courseCode: 151, description: "Basic French I"},
        ],
        termType: TermType.StudyTerm,
    },
    {
        date: "Jan 2024 - Apr 2024",
        title: "Work Term 2",
        description: "CS136(L) Instructional Support Assistant @ University of Waterloo",
        courses:[
            { subject: "STAT", courseCode: 231, description: "Statistics"},
        ],
        termType: TermType.WorkTerm,
    },
    {
        date: "Sept 2023 - Dec 2023",
        title: "2A",
        description: "",
        courses:[
            { subject: "CS", courseCode: "246E", description: "Object-Oriented Software Development (Enriched)"},
            { subject: "CS", courseCode: 245, description: "Logic & Computation"},
            { subject: "CS", courseCode: 251, description: "Computer Organization and Design"},
            { subject: "MATH", courseCode: 249, description: "Introduction to Combinatorics (Adv)"},
            { subject: "STAT", courseCode: 230, description: "Probability"},
            { subject: "ECON", courseCode: 102, description: "Introduction to Marcoeconomics"},
        ],
        termType: TermType.StudyTerm,
    },
    {
        date: "May 2023 - Aug 2023",
        title: "Work Term 1",
        description: "Azure Project Developer @ University of Waterloo (WEA)",
        courses:[
            { subject: "CO", courseCode: 250, description: "Introduction to Optimization"},
            { subject: "ECON", courseCode: 101, description: "Introduction to Microeconomics"},
        ],
        termType: TermType.WorkTerm,
    },
    {
        date: "Jan 2023 - Apr 2023",
        title: "1B",
        description: "",
        courses:[
            { subject: "CS", courseCode: 146, description: "Elementary Algorithm Design & Data Abstraction (Adv)"},
            { subject: "CS", courseCode: "136L", description: "Tools & Techniques for Software Development"},
            { subject: "MATH", courseCode: 136, description: "Linear Algebra I"},
            { subject: "MATH", courseCode: 138, description: "Calculus II"},
            { subject: "PHYS", courseCode: 122, description: "Electricity, Waves & Magnetism"}
        ],
        termType: TermType.StudyTerm,
    },
    {
        date: "Sep 2022 - Dec 2022",
        title: "1A",
        description: "",
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
