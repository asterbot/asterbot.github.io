export enum TermType {
    WorkTerm,
    StudyTerm,
}

export interface Company{
    uid: string,
    name: string,
    link: string,
}

export interface Term{
    date: string,
    title: string,
    description: string,
    company: Company | null,
    courses: Course[],
    termType: TermType
}

export interface Course{
    subject: string,
    courseCode: number | string,
    description: string,
}
