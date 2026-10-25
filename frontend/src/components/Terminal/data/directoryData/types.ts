export enum FileType{
    Regular,
    Directory,
}


export interface RegularFile{
    type: FileType.Regular,
    name: string,
    content: string,
    path?: string,  // absolute path
    parent?: Directory,
    rmTarget?: string,  // what `rm` removes from the page (see components/Rm/targets.ts)
}

export interface Directory{
    type: FileType.Directory,
    name: string,
    children: File[],
    path: string,
    parent?: Directory,
    rmTarget?: string,
}

export type File = RegularFile | Directory;
