import { Project, SourceDomain } from "../types";

const projectData: Project[] = [
    {
        title: "ASCII Game Engine",
        tags: ["C++", "Ncurses", "OOP"],
        sources: [],
        description: "A game engine based on the Ncurses C framework with C++ abstractions. Created Tetris and Donkey Kong with the game engine!",
        uid: "age",
    },
    {
        title: "BetterNotes",
        tags: ["Kotlin", "App Development", "JVM", "Gradle", "MongoDB", "Jetpack Compose"],
        sources: [
            {sourceDomain: SourceDomain.GitHub, sourceLink: "https://github.com/asterbot/BetterNotes"},
            {sourceDomain: SourceDomain.Releases, sourceLink: "https://github.com/asterbot/BetterNotes/releases"}
        ],
        description: "app",
        uid: "age",
    },
    {
        title: "Book Explorer App",
        tags: ["PostgresSQL", "Supabase", "Python (Flask)", "React TypeScript"],
        sources: [
            {sourceDomain: SourceDomain.GitHub, sourceLink: "https://github.com/asterbot/Book-Explorer"}
        ],
        description: "app",
        uid: "bookexp",
    },
    {
        title: "Peer to Peer Network Implementation",
        tags: ["Web Sockets","Python (Flask)", "TCP/IP", "NextJS"],
        sources: [
            {sourceDomain: SourceDomain.GitHub, sourceLink: "https://github.com/asterbot/hack-the-hill-p2p"}
        ],
        description: "app",
        uid: "age",
    },
]

export default projectData;
