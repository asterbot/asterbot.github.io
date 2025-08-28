export interface Project{
    title: string,
    tags: string[],     // mention all tools and technologies here
    sources: Source[],  // mention all sources (eg. github, devpost, ...)
    description: string,
    uid: string,        // all images of the project are stored in img/{uid}/...
    tryItOut: boolean,  // can this be tried??
}

export enum SourceDomain{
    GitHub = "GitHub",
    ItchIO = "ItchIo",
    DevPost = "DevPost",
    Releases = "Releases",
}

export interface Source{
    sourceDomain: SourceDomain,
    sourceLink: string,
}
