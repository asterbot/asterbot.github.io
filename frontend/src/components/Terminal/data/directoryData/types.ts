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
}

export interface Directory{
    type: FileType.Directory,
    name: string,
    children: File[],
    path: string,
    parent?: Directory,
}

export type File = RegularFile | Directory;
