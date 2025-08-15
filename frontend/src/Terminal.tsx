import React, { useState, useRef, useEffect } from 'react';

const fileSystem: Record<string, string[]> = {
  '/': ['home', 'projects', 'blog', 'timeline'],
  '/home': ['about.txt'],
  '/projects': ['project1.txt', 'project2.txt'],
  '/blog': ['branch-main', 'branch-cs'],
  '/timeline': ['uwaterloo.txt', 'internships.txt'],
};

const helpText = `Available commands:\nls, cd <dir>, pwd, help, clear`;

type TerminalProps = {
  onNavigate?: (path: string) => void;
};

// Simple syntax highlighting for terminal output
function highlight(line: string) {
  // Highlight commands
  if (line.startsWith('$ ')) {
    const [prompt, ...rest] = line.split(' ');
    return (
      <span>
        <span style={{ color: '#ffcc00' }}>$</span>{' '}
        <span style={{ color: '#00bfff' }}>{rest.join(' ')}</span>
      </span>
    );
  }
  // Highlight errors
  if (/no such directory|missing operand|Command not found|Already at root/.test(line)) {
    return <span style={{ color: '#ff6666' }}>{line}</span>;
  }
  // Highlight directories in ls output
  if (/^home|projects|blog|timeline$/.test(line.trim())) {
    return <span style={{ color: '#00ff90' }}>{line}</span>;
  }
  // Highlight help
  if (line.startsWith('Available commands')) {
    return <span style={{ color: '#ffcc00' }}>{line}</span>;
  }
  // Default output
  return <span style={{ color: '#eaeaea' }}>{line}</span>;
}

const Terminal: React.FC<TerminalProps> = ({ onNavigate }) => {
  const [history, setHistory] = useState<string[]>(["Welcome to the Portfolio Terminal! Type 'help' to get started."]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  const handleCommand = (cmd: string) => {
    let output = '';
    const args = cmd.trim().split(' ');
    const command = args[0];
    switch (command) {
      case 'ls':
        output = (fileSystem[cwd] || []).join('  ');
        break;
      case 'cd':
        if (args[1]) {
          let target = args[1];
          if (target === '..') {
            if (cwd !== '/') {
              const parts = cwd.split('/').filter(Boolean);
              parts.pop();
              setCwd(parts.length ? '/' + parts.join('/') : '/');
              output = '';
            } else {
              output = 'Already at root.';
            }
          } else {
            let newPath = cwd === '/' ? `/${target}` : `${cwd}/${target}`;
            if (fileSystem[newPath]) {
              setCwd(newPath);
              output = '';
              if (onNavigate && ['/projects', '/blog', '/timeline', '/home', '/'].includes(newPath)) {
                onNavigate(newPath === '/home' ? '/' : newPath);
              }
            } else {
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
    <div style={{ background: '#181a20', color: '#00ff90', fontFamily: 'monospace', padding: '1.2rem 1rem', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ textAlign: 'left' }}>
        {history.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{highlight(line)}</div>
        ))}
        <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: 8 }}>
          <span style={{ color: '#ffcc00', marginRight: 4 }}>{cwd} $</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#00ff90', outline: 'none', flex: 1 }}
            autoFocus
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
