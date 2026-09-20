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

        if (!found) return undefined;
    }
  
    if (curFile.type === FileType.Regular) return curFile;
}
  

export function listChildren(dir: Directory): string[]{
    // List all children under this directory with their names as strings
    return dir.children.map((f) => f.name);
}
  
export function resolvePath(cwd: Directory, target: string): string {
    // Resolve a (possibly relative) path against cwd into a normalized absolute path (no trailing slash)
    if (target === "~") return "/";
    if (target.startsWith("~/")) target = target.slice(1);

    const parts: string[] = target.startsWith("/") ? [] : cwd.path.split("/").filter((s) => s !== "");
    for (const seg of target.split("/").filter((s) => s !== "")){
        if (seg === ".") continue;
        else if (seg === "..") parts.pop();
        else parts.push(seg);
    }
    return "/" + parts.join("/");
}

export function pathLabel(path: string): string {
    // Display form of a path: "/" -> "~", "/projects/" -> "~/projects"
    const trimmed = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
    return trimmed === "/" ? "~" : "~" + trimmed;
}

export function accentFor(path: string): string {
    // Accent colour for the section a path belongs to
    if (path.startsWith("/projects")) return "var(--pink)";
    if (path.startsWith("/blogs")) return "var(--lav)";
    if (path.startsWith("/timeline")) return "var(--red)";
    return "var(--peri)";
}
