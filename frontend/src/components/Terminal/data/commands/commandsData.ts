import { Directory } from "../directoryData/types";
import { getFileByAbsolutePath, listChildren } from "../directoryData/utils";
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
        return listChildren(context.cwd).join("  ");
    },
}

export const cd: Command = {
    name: "cd",
    minExpectedArgs: 1,
    help: "Change into the provided directory.\nCan take absolute paths (eg. /projects/) or relative paths (eg. projects/), current directory (.) or parent directory (..)",
    addToHistory: true,

    callback(cmdArgs: string[], context: CommandContext){
        let output = "";

        let target = cmdArgs[0];
        if (target === '..') {

            if (context.cwd.path !== '/') {
              const parent = context.cwd.parent as Directory;
              context.setCwd(parent);
              context.navigateToPage(parent);
              output = '';

            } 
            else {
              output = 'Already at root.';
            }
          }

          else if (target === "."){
              output=""
          }

          else if (target.startsWith('/')) {
            // Handle absolute path
            if (directoryExists(target)){
              var dir = getDirectoryByAbsolutePath(target);
              context.setCwd(dir);
              context.navigateToPage(dir);
              output = '';
            } 
            else {
              output = `cd: no such directory: ${target}`;
            }
          }

          else {
            // Handle relative path
            let newPath = context.cwd.path === '/' ? `/${target}` : `${context.cwd.path}/${target}`;
            if (directoryExists(newPath)) {
              dir = getDirectoryByAbsolutePath(newPath);
              context.setCwd(dir);
              output = '';
              context.navigateToPage(dir)
            } 
            else {
              output = `cd: no such directory: ${target}`;
            }
          }

          return output;
    },

}

export const pwd: Command = {
    name: "pwd",
    minExpectedArgs: 0,
    help: "Print present working directory (pwd) to terminal output",
    addToHistory: true,

    callback(_cmdArgs: string[], context: CommandContext) {
        return context.cwd.path;
    },
}


export const cat: Command = {
    name: "cat",
    minExpectedArgs: 1,
    help: "Print contents of file to the screen. Allegedly not the feline.",
    addToHistory: true,

    callback(cmdArgs: string[], context: CommandContext){
        var path = cmdArgs[0];

        if (!path.startsWith('/')) path = context.cwd.path === '/' ? `/${path}` : `${context.cwd.path}` + `${path}`;

        var f = getFileByAbsolutePath(path);
        return f ? f.content : `File not found: ${path}`;
    }
}

export const clear: Command = {
    name: "clear",
    minExpectedArgs: 0,
    help: "Clear screen",
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
