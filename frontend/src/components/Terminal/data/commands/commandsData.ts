import { FileType } from "../directoryData/types";
import { getFileByAbsolutePath, resolvePath } from "../directoryData/utils";
import { CommandContext, Command } from "./types";
import { getDirectoryByAbsolutePath, directoryExists } from "../directoryData/utils";

export const whoami: Command = {
    name: "whoami",
    minExpectedArgs: 0,
    help: "Shows who I am...",
    addToHistory: true,

    callback(_cmdArgs: string[]) {
        return "Arjun :D"
    }
}

export const ls: Command = {
    name: "ls",
    minExpectedArgs: 0,
    help: "List all files/directory in current working directory (cwd)",
    addToHistory: true,

    callback(_cmdArgs: string[], context: CommandContext) {
        // One entry per line, directories marked with a trailing slash
        return context.cwd.children
            .map((f) => f.type === FileType.Directory ? f.name + "/" : f.name)
            .join("\n");
    },
}

export const cd: Command = {
    name: "cd",
    minExpectedArgs: 1,
    help: "Change into the provided directory.\nCan take absolute paths (eg. /projects/) or relative paths (eg. projects/), current directory (.) or parent directory (..)",
    addToHistory: true,

    callback(cmdArgs: string[], context: CommandContext){
        const target = cmdArgs[0];

        if (target === ".") return "";

        if (target === ".." && context.cwd.path === "/") return "Already at root.";

        const newPath = resolvePath(context.cwd, target);
        if (!directoryExists(newPath)) return `cd: no such directory: ${target}`;

        const dir = getDirectoryByAbsolutePath(newPath);
        context.setCwd(dir);
        context.navigateToPage(dir);
        return "";
    },

}

export const pwd: Command = {
    name: "pwd",
    minExpectedArgs: 0,
    help: "Print present working directory (pwd) to terminal output",
    addToHistory: true,

    callback(_cmdArgs: string[], context: CommandContext) {
        const p = context.cwd.path;
        return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
    },
}


export const cat: Command = {
    name: "cat",
    minExpectedArgs: 1,
    help: "Print contents of file to the screen. Allegedly not the feline.",
    addToHistory: true,

    callback(cmdArgs: string[], context: CommandContext){
        const path = resolvePath(context.cwd, cmdArgs[0]);

        const f = getFileByAbsolutePath(path);
        return f ? f.content : `File not found: ${cmdArgs[0]}`;
    }
}

export const clear: Command = {
    name: "clear",
    minExpectedArgs: 0,
    help: "Clear screen (can also be triggered with ctrl+L)",
    addToHistory: false,
    
    callback(_cmdArgs: string[], context: CommandContext){
        context.setHistory([]);
        return ""
    },
}

export const echo: Command = {
    name: "echo",
    minExpectedArgs: 1,
    help: "Print provided arguments to terminal screen",
    addToHistory: true,
    
    callback(cmdArgs: string[]){
        let out = cmdArgs.join(' ')
        if (out.startsWith("\"") && out.endsWith("\"")) out = out.slice(1,-1);
        return out;
    },
}

export const rm: Command = {
    name: "rm",
    minExpectedArgs: 0,
    help: "Remove... don't call this",
    addToHistory: true,

    callback(_cmdArgs: string[], _context: CommandContext){
        return "Ain't breaking this that easy :)";
    }
}
