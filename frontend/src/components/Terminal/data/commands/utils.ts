import * as allCommands from "./commandsData"
import { Command, CommandContext } from './types';

// This is a map of all commands with the name of the command as the key and the Command object as value
const commands: Record<string, Command> = Object.values(allCommands)
  .reduce((acc, cmd) => {
    acc[cmd.name] = cmd as Command;
    return acc;
  }, {} as Record<string, Command>);

const help: Command = {
    name: 'help',
    minExpectedArgs: 0,

    help: "Print this help message and exit",

    addToHistory: true,

    callback(_cmdArgs: string[], context: CommandContext){
        var out = "Available commands:\n";
        for (let command in commands){
            out+=`- ${command}: ${commands[command].help}\n\n`
        }
        
        return out;
    }
}

commands["help"] = help;


const man: Command = {
    name: 'man',
    minExpectedArgs: 1,

    help: "Provide help manual of the command provided",

    addToHistory: true,

    callback(cmdArgs: string[], context: CommandContext){
        const target = cmdArgs[0];
        if (!commands[target]) return `No manual entry for command: ${target}`
        return commands[target].help;
    }
}

commands["man"] = man;


export default commands;