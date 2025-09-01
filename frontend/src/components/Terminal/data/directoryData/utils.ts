import { Directory, File, FileType, RegularFile } from "./types";
import root from "./terminalData";

export function directoryExists(path: string): boolean{
    // Does a directory for a given absolute path exist
  
    var components = path.split("/").filter((s:string) => s!=="");
  
    var curFile: File = root;
    for (var component of components){
        
        // Components left to process but we hit a regular file... so error
        if (curFile.type === FileType.Regular) return false;
        
        curFile = curFile as Directory;
  
        var found = false;
        for (const child of curFile.children){
            if (child.name === component){
                curFile = child;
                found = true;
                break;
            }
        }
  
        if (!found) return false;
        
    }
  
    if (curFile.type === FileType.Regular) return false;
  
    return true;
}
  
export function getDirectoryByAbsolutePath(path: string): Directory {
    // Get the directory of the path represented by the path string
    //     OR the directory closest to the path given
    //     eg. if /a/b/c/ is requested and we only have /a/b/, only return /a/b/
    //     essentially return however many components of the path you can match with a real directory
    //     for no matches, return root
    var components = path.split("/").filter((s:string) => s!=="");
  
    var curFile: File = root;
    for (var component of components){
        
        // Components left to process but we hit a regular file... so error
        if (curFile.type === FileType.Regular) return curFile.parent || root;
        
        curFile = curFile as Directory;
  
        var found = false;
        for (const child of curFile.children){
            if (child.name === component){
                curFile = child;
                found = true;
                break;
            }
        }
  
        if (!found) return curFile.parent || root;
        
    }
  
    if (curFile.type === FileType.Regular) return curFile.parent || root;
  
    return curFile;
}

export function getFileByAbsolutePath(path: string): RegularFile | undefined {
    // Get the file of the path represented by the path string
    var components = path.split("/").filter((s:string) => s!=="");
  
    var curFile: File = root;
    for (var component of components){
        
        // Components left to process but we hit a regular file... so error
        if (curFile.type === FileType.Regular) return undefined;
        
        curFile = curFile as Directory;
  
        var found = false;
        for (const child of curFile.children){
            if (child.name === component){
                curFile = child;
                found = true;
                break;
            }
        }        
    }
  
    if (curFile.type === FileType.Regular) return curFile;
}
  

export function listChildren(dir: Directory): string[]{
    // List all children under this directory with their names as strings
    return dir.children.map((f) => f.name);
}
  