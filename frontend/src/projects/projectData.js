// to export all the project data!

import Age from "./descriptions/age";
import AiEarth from "./descriptions/aiearth";
import Memotion from "./descriptions/memotion";
import Music4Mood from "./descriptions/music4mood";

export const projectData = 
{
    "age": {
        "title": "ASCII Game Engine",
        "tnt": [
            "C++",
            "OOP",
            "Game Design"
        ],
        "slides": 4,
        "sources": {},
        "component": <Age />
    },
    "memotion": {
        "title": "mEmotion",
        "tnt": [
            "React TypeScript",
            "Python",
            "Flask",
            "REST APIs"
        ],
        "slides": 4,
        "sources": {
            "GitHub": "https://github.com/asterbot/Serenity-Hacks",
            "DevPost": "https://devpost.com/software/memotion-w62jro"
        },
        "component": <Memotion />
    },
    "aiearth": {
        "title": "AI-Earth Hack 2024",
        "tnt": [
            "Python",
            "Flask",
            "React.js",
            "REST APIs",
            "Tensorflow",
            "Pytorch"
        ],
        "slides": 4,
        "sources": {
            "GitHub": "https://github.com/asterbot/AIEarthhack2024"
        },
        "component": <AiEarth />
    },
    "music4mood": {
        "title": "Music4mood",
        "tnt": [
            "Python",
            "Flask",
            "Javascript"
        ],
        "slides": 3,
        "sources": {
            "GitHub": "https://github.com/asterbot/Music4mood",
            "DevPost": "https://devpost.com/software/music4mood"
        },
        "component": <Music4Mood />
    }
}
