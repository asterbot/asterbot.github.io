import { Directory } from "../directoryData/types";

export enum HistoryType{
    COMMAND,
    OUTPUT,
}

export type Tone = "default" | "error" | "help" | "listing";

export interface History{
    type: HistoryType,
    cwd: Directory,
    out: string,
    tone?: Tone,   // how to colour OUTPUT lines
}

export interface CommandContext {
    // All context that could EVER be required to pass into commands
    //           .... seems type-safe enough 
    cwd: Directory;
    setCwd: (value: React.SetStateAction<Directory>) => void;
    navigateToPage: (dir: Directory) => void;
    setHistory: React.Dispatch<React.SetStateAction<History[]>>;
  }
  

export interface Command{
    name: string,
    minExpectedArgs: number, // min # of args expected

    help: string, // help string of command

    addToHistory: boolean, // add command result to history?

    // output on terminal screen + side effects
    callback: (cmdArgs: string[], context: CommandContext) => string,  
}