import { RegularFile, Directory, File, FileType } from "./types"
import blogPosts from "../../../Blog/data/posts"
import { EVERYTHING, PAGE } from "../../../Rm/targets"

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

// Tag a file with the page element `rm` should remove (matches a data-rm attribute)
function rmAs<T extends File>(file: T, key: string): T{
    file.rmTarget = key;
    return file;
}


// Files in home
const titleFile = rmAs(createRegularFile("title.txt", "A developer at heart!"), "home:title")
const aboutFile = rmAs(createRegularFile("about.txt", "Hello, welcome to my website! This terminal project was a fun side thing I was trying, glad to see you're using it! Have fun trying some random stuff :D"), "home:about")

// Files in projects
const ageEngine = rmAs(createRegularFile("ASCIIGameEngine", "ASCII-based C++ game engine! Built on curses C framework with C++ OOP abstractions. Created Tetris and Donkey Kong with it!"), "project:age");
const betterNotes = rmAs(createRegularFile("BetterNotes", "Note taking desktop app with support for Markdown, LaTEX, graphs and freehand drawing. Includes multi-user support, offline support and sync with cloud DB on Mongo"), "project:betternotes");
const bookExplorer = rmAs(createRegularFile("BookExplorer", "A web-app to make the most of your reading journey! Includes personalized recommendations, reading analytics, user progress tracking, book clubs and various other community features."), "project:bookexp");
const peerToPeer = rmAs(createRegularFile("PeerToPeer", "Decentralized file-sharing platform for nodes connected to a common network. Uses data splitting protocols by splitting data into 512B chunks to be resilient against network disruptions."), "project:p2p");

const projects = rmAs(createDirectory("projects", [ageEngine, betterNotes, bookExplorer, peerToPeer], "/projects/"), PAGE);


// Files in blogs - generated from the blog list, so adding a post to posts.ts
// also makes it show up under `ls blogs/` (each blog is a directory holding its index.md)
const blogChildren = blogPosts.map((post) =>
    rmAs(createDirectory(
        post.id,
        [rmAs(createRegularFile("index.md", post.blurb || post.title), `post:${post.id}`)],
        `/blogs/${post.id}/`
    ), `blog:${post.id}`)
);

const blogs = rmAs(createDirectory("blogs", blogChildren, "/blogs/"), PAGE);


// Files in timeline - rm targets are the entry titles in Timeline/data/timelineData.ts
const threeB = rmAs(createRegularFile("3B", "CO 456, CS 480, CS 454"), "timeline:3B");
const WT4 = rmAs(createRegularFile("WT4", "CS 348"), "timeline:Work Term 4");
const threeA = rmAs(createRegularFile("3A", "CS 341, CS 350, CS 370, CS 346, MUSIC 290, FR 152"), "timeline:3A");
const WT3 = rmAs(createRegularFile("WT3", "no courses! :D"), "timeline:Work Term 3");
const twoB = rmAs(createRegularFile("2B", "CS 240, CS 241, MATH 235, PHYS 234, ENGL 210E, FR 151"), "timeline:2B");
const WT2 = rmAs(createRegularFile("WT2", "STAT 231"), "timeline:Work Term 2");
const twoA = rmAs(createRegularFile("2A", "CS 246E, CS 245, CS 251, MATH 249, STAT 230, ECON 102"), "timeline:2A");
const WT1 = rmAs(createRegularFile("WT1", "CO 250, ECON 101"), "timeline:Work Term 1");
const oneB = rmAs(createRegularFile("1B", "CS 146, CS 136L, MATH 136, MATH 138, PHYS 122"), "timeline:1B");
const oneA = rmAs(createRegularFile("1A", "CS 145, MATH 135, MATH 137, SPCOM 223, PHYS 121"), "timeline:1A");

const timeline = rmAs(createDirectory("timeline", [threeB, WT4, threeA, WT3, twoB, WT2, twoA, WT1, oneB, oneA], "/timeline/"), PAGE);


// Root!
const root = rmAs(createDirectory("root", [titleFile, aboutFile, projects, blogs, timeline], "/"), EVERYTHING);

export default root;
