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
const aboutFile = createRegularFile("about.txt", "Hello, welcome to my website! This terminal project was a fun side thing I was trying, glad to see you're using it! Have fun trying some random stuff :D")

// Files in projects
const ageEngine = createRegularFile("ASCIIGameEngine", "ASCII-based C++ game engine! Built on curses C framework with C++ OOP abstractions. Created Tetris and Donkey Kong with it!");
const betterNotes = createRegularFile("BetterNotes", "Note taking desktop app with support for Markdown, LaTEX, graphs and freehand drawing. Includes multi-user support, offline support and sync with cloud DB on Mongo");
const bookExplorer = createRegularFile("BookExplorer", "A web-app to make the most of your reading journey! Includes personalized recommendations, reading analytics, user progress tracking, book clubs and various other community features.");
const peerToPeer = createRegularFile("PeerToPeer", "Decentralized file-sharing platform for nodes connected to a common network. Uses data splitting protocols by splitting data into 512B chunks to be resilient against network disruptions.");

const projects = createDirectory("projects", [ageEngine, betterNotes, bookExplorer, peerToPeer], "/projects/");


// Files in blogs
const initial_commit = createRegularFile("initial_commit", "An initial blog for my website!");
const sleep_sort = createRegularFile("sleep_sort", "A blog where I analyze a random algorithm posted on 4chan for some reason");

const blogs = createDirectory("blogs", [initial_commit, sleep_sort], "/blogs/");


// Files in timeline
const threeB = createRegularFile("3B", "CO 456, CS 480, CS 454");
const WT4 = createRegularFile("WT4", "CS 348");
const threeA = createRegularFile("3A", "CS 341, CS 350, CS 370, CS 346, MUSIC 290, FR 152");
const WT3 = createRegularFile("WT3", "no courses! :D");
const twoB = createRegularFile("2B", "CS 240, CS 241, MATH 235, PHYS 234, ENGL 210E, FR 151");
const WT2 = createRegularFile("WT2", "STAT 231");
const twoA = createRegularFile("2A", "CS 246E, CS 245, CS 251, MATH 249, STAT 230, ECON 102");
const WT1 = createRegularFile("WT1", "CO 250, ECON 101");
const oneB = createRegularFile("1B", "CS 146, CS 136L, MATH 136, MATH 138, PHYS 122");
const oneA = createRegularFile("1A", "CS 145, MATH 135, MATH 137, SPCOM 223, PHYS 121");

const timeline = createDirectory("timeline", [threeB, WT4, threeA, WT3, twoB, WT2, twoA, WT1, oneB, oneA], "/timeline/");


// Root!
const root = createDirectory("root", [aboutFile, projects, blogs, timeline], "/");

export default root;
