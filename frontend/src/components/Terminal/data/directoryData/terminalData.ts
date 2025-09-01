import { RegularFile, Directory, File, FileType } from "./types"

// Helper functions
function createRegularFile(name: string, content: string = "", path: string = ""): RegularFile{
    return {
        type: FileType.Regular,
        name: name,
        content: content,
        path: path,
    }
}

function createDirectory(name: string, children: File[] = [], path: string): Directory{
    const dir: Directory = {
        type: FileType.Directory,
        name: name,
        children: children,
        path: path,
    }
    
    // Set parent for each child
    for (const child of children){
        child.parent = dir;
        child.path = path + child.name + (child.type === FileType.Directory ? "/" : "");
    }

    return dir;
    
}


// Files in home
const aboutFile = createRegularFile("about.txt", "<insert about stuff here>")

const home = createDirectory("home", [aboutFile], "/home/")


// Files in projects
const ageEngine = createRegularFile("ASCIIGameEngine", "<project description here>");
const betterNotes = createRegularFile("BetterNotes", "<project description here>");
const bookExplorer = createRegularFile("BookExplorer", "<project description here>");
const peerToPeer = createRegularFile("PeerToPeer", "<project description here>");

const projects = createDirectory("projects", [ageEngine, betterNotes, bookExplorer, peerToPeer], "/projects/");


// Files in blogs
const initial_commit = createRegularFile("initial_commit", "<blog summary here>");
const sleep_sort = createRegularFile("sleep_sort", "<blog summary here>");

const blogs = createDirectory("blogs", [initial_commit, sleep_sort], "/blogs/");


// Files in timeline
const threeB = createRegularFile("3B", "<insert courses here>");
const WT4 = createRegularFile("WT4", "<insert courses here>");
const threeA = createRegularFile("3A", "<insert courses here>");
const WT3 = createRegularFile("WT3", "<insert courses here>");
const twoB = createRegularFile("2B", "<insert courses here>");
const WT2 = createRegularFile("WT2", "<insert courses here>");
const twoA = createRegularFile("2A", "<insert courses here>");
const WT1 = createRegularFile("WT1", "<insert courses here>");
const oneB = createRegularFile("1B", "<insert courses here>");
const oneA = createRegularFile("1A", "<insert courses here>");

const timeline = createDirectory("timeline", [threeB, WT4, threeA, WT3, twoB, WT2, twoA, WT1, oneB, oneA], "/timeline/");


// Root!
const root = createDirectory("root", [home, projects, blogs, timeline], "/");

export default root;
