import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';
import root from './data/directoryData/terminalData';
import { Directory } from './data/directoryData/types';
import { getDirectoryByAbsolutePath } from './data/directoryData/utils';
import commands from './data/commands/utils';
import { Command, CommandContext } from './data/commands/types';

// Simple syntax highlighting for terminal output
function highlight(line: string) {
  // Highlight commands
  if (line.startsWith('$ ')) {
    const [, ...rest] = line.split(' ');
    return (
      <span>
        <span className="command-prompt">$</span>{' '}
        <span className="command-text">{rest.join(' ')}</span>
      </span>
    );
  }
  // Highlight errors
  if (/no such directory|missing operand|Command not found|Already at root|sudo|expected at least/.test(line)) {
    return <span className="error-text">{line}</span>;
  }
  // Highlight directories in ls output
  if (/^home|projects|blogs|timeline$/.test(line.trim())) {
    return <span className="directory-text">{line}</span>;
  }
  // Highlight help
  if (line.startsWith('Available commands')) {
    return <span className="help-text">{line}</span>;
  }
  // Default output
  return <span className="terminal-default-text">{line}</span>;
}


type TerminalProps = {
  onNavigate?: (path: string) => void;
  currentLocation?: string;
};


const Terminal: React.FC<TerminalProps> = ({ onNavigate, currentLocation }) => {
  const [history, setHistory] = useState<string[]>([""]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState<Directory>(root);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  // Sync terminal state with current location from navbar navigation
  useEffect(() => {
    if (currentLocation) {
      const path = currentLocation === '/' ? '/' : currentLocation;
      setCwd(getDirectoryByAbsolutePath(path));
    }
  }, [currentLocation, cwd]);

  const navigateToPage = (dir: Directory) => {
    if (onNavigate) {
      onNavigate(dir.path === '/home' ? '/' : dir.path);
    }
  };

  const handleCommand = (cmd: string) => {
    let output = '';
    const args = cmd.trim().split(' ');
    const commandName = args[0];
    args.shift(); // remove `command`

    var command: Command = commands[commandName];

    if (!command){
        if (commandName=="sudo") output = "Why would I give you sudo access?";  // special case lol
        else output = `Command not found: ${commandName}`;
    }
    else if (args.length < command.minExpectedArgs){
        output = `Command ${command.name} expected at least ${command.minExpectedArgs} args, but got ${args.length}`;
    }
    else{
        var context: CommandContext = {
            cwd: cwd,
            setCwd: setCwd,
            navigateToPage: navigateToPage,
            setHistory: setHistory,
        }

        output = command.callback(args, context);
        
        if (!command.addToHistory){
            return;
        }
    }

    setHistory((h) => [...h, `$ ${cmd}`, output]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };
  
  return (
    <div className="terminal">
      <div className="terminal-content">
        <div className="terminal-line">{highlight("Welcome to the Portfolio Terminal! Type 'ls' or 'help' to get started.")}</div>
        {history.map((line, i) => (
          <div key={i} className="terminal-line">{highlight(line)}</div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-form">
          <span className="terminal-prompt">{cwd.path !== "/" ? cwd.path.slice(0,-1): cwd.path} $</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            className="terminal-input"
            autoFocus
            autoComplete="off"
            placeholder="Enter command..."
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
