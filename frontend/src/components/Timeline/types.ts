export enum TermType {
    WorkTerm = "Work Term",
    StudyTerm = "Study Term",
}

export interface Term{
    date: string,
    title: string,
    description: string,
    courses: Course[],
    termType: TermType 
}

export interface Course{
    subject: string,
    courseCode: number,
    description: string,
}
