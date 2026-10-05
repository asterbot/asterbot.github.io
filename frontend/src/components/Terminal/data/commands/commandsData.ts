import { Directory, File, FileType } from "../directoryData/types";
import { getFileByAbsolutePath, getNodeByAbsolutePath, resolvePath, routeFor } from "../directoryData/utils";
import { CommandContext, Command } from "./types";
import { getDirectoryByAbsolutePath, directoryExists } from "../directoryData/utils";
import root from "../directoryData/terminalData";
import { EVERYTHING, PAGE } from "../../../Rm/targets";

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

// Matches a shell glob (* and ?) against a whole name
function globToRegex(glob: string): RegExp {
    const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    return new RegExp("^" + escaped.replace(/\*/g, ".*").replace(/\?/g, ".") + "$");
}

// The files an rm argument refers to. Globs only expand for bare names in the cwd.
function resolveRmArg(cwd: Directory, arg: string): File[] {
    if (!arg.includes("/") && /[*?]/.test(arg)) {
        const re = globToRegex(arg);
        return cwd.children.filter((f) => re.test(f.name));
    }
    const node = getNodeByAbsolutePath(resolvePath(cwd, arg));
    return node ? [node] : [];
}

// Root and the section dirs are whole pages; everything else is drawn on its parent's page
const isPage = (f: File) => f.rmTarget === PAGE || f.rmTarget === EVERYTHING;
const pageOf = (f: File): Directory => (f.type === FileType.Directory && isPage(f)) ? f : (f.parent ?? root);

// Work out which page to go to and what to remove there
function planRemoval(files: File[]): { page: Directory, keys: string[] } {
    // Every child of a page (e.g. `rm *` in ~/projects) means the whole page,
    // including anything the terminal tree doesn't list
    const picked = new Set(files);
    for (const f of Array.from(picked)) {
        const parent = f.parent;
        if (parent && isPage(parent) && parent.children.every((c) => picked.has(c))) {
            parent.children.forEach((c) => picked.delete(c));
            picked.add(parent);
        }
    }

    const pages = new Set(Array.from(picked).map(pageOf));
    if (picked.has(root) || pages.size > 1) return { page: root, keys: [EVERYTHING] };

    const page = Array.from(pages)[0];
    if (picked.has(page)) return { page, keys: [page.rmTarget!] };
    return { page, keys: Array.from(new Set(Array.from(picked).map((f) => f.rmTarget!))) };
}

export const rm: Command = {
    name: "rm",
    minExpectedArgs: 0,
    help: "Remove files or directories (globs like * work in the current directory)... don't call this",
    addToHistory: true,

    callback(cmdArgs: string[], context: CommandContext){
        const targets = cmdArgs.filter((a) => !a.startsWith("-"));   // -r, -f, -rf: sure, whatever
        if (targets.length === 0) return "Ain't breaking this that easy :)";

        const files: File[] = [];
        const out: string[] = [];
        for (const target of targets) {
            const found = resolveRmArg(context.cwd, target).filter((f) => f.rmTarget);
            if (found.length === 0) out.push(`rm: cannot remove '${target}': No such file or directory`);
            for (const f of found) {
                files.push(f);
                const name = f === root ? "/" : f.name;
                out.push(f.type === FileType.Directory ? `removed directory '${name}'` : `removed '${name}'`);
            }
        }
        if (files.length === 0) return out.join("\n");

        const { page, keys } = planRemoval(files);
        if (!context.remove({ route: routeFor(page), keys })) return "rm: cannot remove: Device or resource busy";

        if (routeFor(page) !== routeFor(context.cwd)) {
            context.setCwd(page);
            context.navigateToPage(page);
        }
        return out.join("\n");
    }
}
