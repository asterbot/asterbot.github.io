import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';
import root from './data/directoryData/terminalData';
import { Directory } from './data/directoryData/types';
import { getDirectoryByAbsolutePath } from './data/directoryData/utils';
import commands from './data/commands/utils';
import { HistoryType, History, Command, CommandContext } from './data/commands/types';

// Simple syntax highlighting for terminal output
function highlight(line: string) {

  const dirRegex = /home|projects|blogs|timeline/;

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
  if (/breaking this|unexpected|No manual entry|Invalid command|no such directory|missing operand|not found|Already at root|sudo|expected at least/.test(line)) {
    return <span className="error-text">{line}</span>;
  }
  // Highlight directories in ls output
  if (dirRegex.test(line.trim())) {
    const words = line.split(' ');
    return (
      <span>
        {words.map((word, i) => {
          return (dirRegex.test(word) ? <span key={i} className="directory-text">{word} </span> : <span className="file-text" key={i}>{word} </span>);
        })}
      </span>
    )
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
  const [history, setHistory] = useState<History[]>([]);
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
  }, [currentLocation]);

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

    var oldCWD = cwd;

    if (!command){
        if (commandName==="sudo") output = "Why would I give you sudo access?";  // special case lol
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

        if (output === undefined) output = "Something unexpected happened...";
        
        if (!command.addToHistory){
            return;
        }
    }

    setHistory((h) => [...h, {type: HistoryType.COMMAND ,cwd: oldCWD, out: `$ ${cmd}`}, {type: HistoryType.OUTPUT ,cwd: oldCWD, out: output}]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+L clears screen
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault(); // prevent browser clear
      setHistory([]);
      return;
    }
  };
  
  
  return (
    <div className="terminal">
      <div className="terminal-content">
        <div className="terminal-line">{highlight("Welcome to the Portfolio Terminal! Type 'ls' or 'help' to get started.")}</div>
        {history.map((line, i) => {        
            return(
              <div key={i} className="terminal-line">
                {line.type===HistoryType.COMMAND  && <span className="terminal-prompt">{line.cwd.path !== "/" ? line.cwd.path.slice(0,-1): line.cwd.path}</span>}
                {highlight(line.out)}
              </div>
            )
        })}
        <form onSubmit={handleSubmit} className="terminal-form">
          <span className="terminal-prompt">{cwd.path !== "/" ? cwd.path.slice(0,-1): cwd.path} $</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
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
