export interface Project{
    title: string,
    tags: string[],     // mention all tools and technologies here
    sources: Source[],  // mention all sources (eg. github, devpost, ...)
    description: string,
    uid: string,        // all images of the project are stored in img/{uid}/...
    tryItOut: boolean,  // can this be tried?
    numImages: number,
    gifs?: (number | "thumbnail")[],  // images stored as .gif instead of .png (by number, or "thumbnail")
}

const imagePath = (project: Project, name: number | "thumbnail") =>
    `/projects/${project.uid}/${name}.${project.gifs?.includes(name) ? "gif" : "png"}`;

export const thumbnailSrc = (project: Project) => imagePath(project, "thumbnail");
export const imageSrc = (project: Project, i: number) => imagePath(project, i + 1);  // i is 0-indexed

// TODO: See if you can not have to rely on numImages

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
