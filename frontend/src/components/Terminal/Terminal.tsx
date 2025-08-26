import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';

const fileSystem: Record<string, string[]> = {
  '/': ['home', 'projects', 'blogs', 'timeline'],
  '/home': ['about.txt'],
  '/projects': ['project1.txt', 'project2.txt'],
  '/blogs': ['branch-main', 'branch-cs'],
  '/timeline': ['uwaterloo.txt', 'internships.txt'],
};

const helpText = `Available commands:\nwhoami, ls, cd <dir>, pwd, help, clear\n\nNavigation:\n- cd . (go to current directory) (why?)\n- cd .. (go to parent directory)\n- cd /projects (absolute path)\n- cd projects (relative path)`;

type TerminalProps = {
  onNavigate?: (path: string) => void;
  currentLocation?: string;
};

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

const Terminal: React.FC<TerminalProps> = ({ onNavigate, currentLocation }) => {
  const [history, setHistory] = useState<string[]>([""]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  // Sync terminal state with current location from navbar navigation
  useEffect(() => {
    if (currentLocation) {
      const path = currentLocation === '/' ? '/' : currentLocation;
      if (fileSystem[path]) {
        // Only update if the path is different from current cwd
        if (path !== cwd) {
          setCwd(path);
        }
      }
    }
  }, [currentLocation, cwd]);

  const navigateToPage = (path: string) => {
    if (onNavigate) {
      onNavigate(path === '/home' ? '/' : path);
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
        output = (fileSystem[cwd] || []).join('  ');
        break;
      case 'cd':
        if (args[1]) {
          let target = args[1];
          if (target === '..') {
            if (cwd !== '/') {
              // Go to parent directory based on fileSystem structure
              const parts = cwd.split('/').filter(Boolean);
              parts.pop();
              const parentPath = parts.length ? '/' + parts.join('/') : '/';
              setCwd(parentPath);
              // Navigate to the parent page if it's a valid route
              if (['/projects', '/blogs', '/timeline', '/home', '/'].includes(parentPath)) {
                navigateToPage(parentPath);
              }
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
            if (fileSystem[target]) {
              setCwd(target);
              navigateToPage(target);
              output = '';
            } else {
              output = `cd: no such directory: ${target}`;
            }
          } 
          else {
            // Handle relative path
            let newPath = cwd === '/' ? `/${target}` : `${cwd}/${target}`;
            if (fileSystem[newPath]) {
              setCwd(newPath);
              output = '';
              if (['/projects', '/blogs', '/timeline', '/home', '/'].includes(newPath)) {
                navigateToPage(newPath);
              }
            } 
            else {
              output = `cd: no such directory: ${target}`;
            }
          }
        } else {
          output = 'cd: missing operand';
        }
        break;
      case 'pwd':
        output = cwd;
        break;
      case 'help':
        output = helpText;
        break;
      case 'clear':
        setHistory([]);
        return;
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
        <div className="terminal-line">{highlight("Welcome to the Portfolio Terminal! Type 'help' to get started.")}</div>
        {history.map((line, i) => (
          <div key={i} className="terminal-line">{highlight(line)}</div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-form">
          <span className="terminal-prompt">{cwd} $</span>
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
