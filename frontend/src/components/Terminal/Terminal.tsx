import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';
import root from './data/directoryData/terminalData';
import { File, Directory, FileType } from './data/directoryData/types';
import { directoryExists, getDirectoryByAbsolutePath, listChildren } from './data/directoryData/utils';


const helpText = `Available commands:\nwhoami, ls, cd <dir>, pwd, help, clear\n\nNavigation:\n- cd . (go to current directory) (why?)\n- cd .. (go to parent directory)\n- cd /projects (absolute path)\n- cd projects (relative path)`;

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
  if (/no such directory|missing operand|Command not found|Already at root|sudo/.test(line)) {
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
  // Highlight navigation
  if (line.includes('cd ..') || line.includes('absolute path') || line.includes('relative path')) {
    return <span className="navigation-text">{line}</span>;
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
      console.log(path);
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
    const command = args[0];
    switch (command) {
      case 'whoami':
        output = 'Arjun :D'
        break;

      case 'sudo':
        output = "Why would I give you sudo access?"
        break;

      case 'ls':
        output = (listChildren(cwd)).join('  ');
        break;

      case 'cd':
        if (args[1]) {
          let target = args[1];
          if (target === '..') {

            if (cwd.path !== '/') {
              const parent = cwd.parent as Directory;
              setCwd(parent);
              navigateToPage(parent);
              output = '';

            } else {
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
              setCwd(dir);
              navigateToPage(dir);
              output = '';
            } 
            else {
              output = `cd: no such directory: ${target}`;
            }
          } 

          else {
            // Handle relative path
            let newPath = cwd.path === '/' ? `/${target}` : `${cwd.path}/${target}`;
            if (directoryExists(newPath)) {
              dir = getDirectoryByAbsolutePath(newPath);
              setCwd(dir);
              output = '';
              navigateToPage(dir)
            } 
            else {
              output = `cd: no such directory: ${target}`;
            }
          }
        } 
        else {
          output = 'cd: missing operand';
        }
        break;

      case 'pwd':
        output = cwd.path;
        break;

      case 'help':
        output = helpText;
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'echo':
        if (args[1]){
            let out = args.slice(1).join(' ');
            if (out.startsWith("\"") && out.endsWith("\"")) out = out.slice(1,-1);
            output = out;
        }
        else{
          output = 'echo: missing operand'
        }
        break;

      default:
        output = `Command not found: ${command}`;
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
