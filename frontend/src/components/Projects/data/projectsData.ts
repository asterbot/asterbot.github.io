import { Project, SourceDomain } from "./types";

const projectData: Project[] = [
    {
        title: "ASCII Game Engine",
        tags: ["C++", "Ncurses", "OOP", "MVC", "SOLID"],
        sources: [],
        description: "An ASCII-based game engine created on the curses C framework with OOP abstractions in C++, using various OOP patterns over a C library. I created Tetris and Donkey Kong with the game engine!",
        uid: "age",
        tryItOut: false,
        numImages: 4,
    },
    {
        title: "BetterNotes",
        tags: ["Kotlin", "App Development", "JVM", "Gradle", "MongoDB", "Jetpack Compose"],
        sources: [
            {sourceDomain: SourceDomain.GitHub, sourceLink: "https://github.com/asterbot/BetterNotes"},
            {sourceDomain: SourceDomain.Releases, sourceLink: "https://github.com/asterbot/BetterNotes/releases"}
        ],
        description: "Note taking desktop app with support for Markdown, LaTEX, graphs and freehand drawing. Includes multi-user support, offline support and sync with cloud DB on Mongo.",
        uid: "betternotes",
        tryItOut: true,
        numImages: 9,
    },
    {
        title: "Book Explorer App",
        tags: ["PostgresSQL", "Supabase", "Python (Flask)", "React TypeScript", "Full Stack", "App Development"],
        sources: [
            {sourceDomain: SourceDomain.GitHub, sourceLink: "https://github.com/asterbot/Book-Explorer"}
        ],
        description: "A web-app to make the most of your reading journey! Includes personalized recommendations, reading analytics, user progress tracking, book clubs and various other community features.",
        uid: "bookexp",
        tryItOut: false,
        numImages: 3,
    },
    {
        title: "Peer to Peer Network",
        tags: ["Web Sockets","Python (Flask)", "TCP/IP", "NextJS"],
        sources: [
            {sourceDomain: SourceDomain.GitHub, sourceLink: "https://github.com/asterbot/hack-the-hill-p2p"}
        ],
        description: "Decentralized file-sharing platform for nodes connected to a common network. Uses data splitting protocols by splitting data into 512B chunks to be resilient against network disruptions.",
        uid: "p2p",
        tryItOut: false,
        numImages: 2,
    },
]

export default projectData;
