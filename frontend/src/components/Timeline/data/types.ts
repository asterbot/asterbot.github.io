export enum TermType {
    WorkTerm,
    StudyTerm,
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
    courseCode: number | string,
    description: string,
}
