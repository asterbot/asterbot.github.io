import React, { useState, useRef, useEffect, MutableRefObject } from 'react';
import './Terminal.css';
import root from './data/directoryData/terminalData';
import { Directory } from './data/directoryData/types';
import { getDirectoryByAbsolutePath, listChildren, resolvePath, pathLabel, accentFor } from './data/directoryData/utils';
import commands from './data/commands/utils';
import { HistoryType, History, Command, CommandContext, Tone } from './data/commands/types';

const PROMPT_SYMBOL = '$';
const ERROR_PATTERN = /breaking this|unexpected|No manual entry|not found|no such directory|Already at root|sudo|expected at least/;

// Full prompt on the home page; the side pane is narrow, so drop the user@host there
function promptFor(cwd: Directory, short: boolean) {
  const label = pathLabel(cwd.path);
  return short ? `${label} ${PROMPT_SYMBOL}` : `arjun@asterbot ${label} ${PROMPT_SYMBOL}`;
}

function toneFor(commandName: string, output: string): Tone {
  if (ERROR_PATTERN.test(output)) return 'error';
  if (commandName === 'help' || commandName === 'man') return 'help';
  if (commandName === 'ls') return 'listing';
  return 'default';
}

// Colour a single output line according to its tone
function renderLine(line: string, tone: Tone, key: number) {
  if (tone === 'listing') {
    const isDir = line.endsWith('/');
    return <div key={key} className={isDir ? 'out-dir' : 'out-file'}>{line}</div>;
  }
  return <div key={key} className={`out-${tone}`}>{line}</div>;
}

// Strip the trailing slash the directory tree uses so it matches router paths
function routeFor(dir: Directory) {
  return dir.path.length > 1 && dir.path.endsWith('/') ? dir.path.slice(0, -1) : dir.path;
}

type TerminalProps = {
  onNavigate?: (path: string) => void;
  currentLocation?: string;
  focusRef?: MutableRefObject<() => void>;
  split?: boolean;   // rendered as a side pane next to the page content
};

const Terminal: React.FC<TerminalProps> = ({ onNavigate, currentLocation, focusRef, split = false }) => {
  const [history, setHistory] = useState<History[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(true);
  const [cwd, setCwd] = useState<Directory>(() => currentLocation ? getDirectoryByAbsolutePath(currentLocation) : root);
  const inputRef = useRef<HTMLInputElement>(null);
  const typed = useRef<string[]>([]);     // previously submitted commands (for arrow-key recall)
  const typedIdx = useRef(0);
  const navigatedFromTerminal = useRef(false);
  const scrollOnNextRender = useRef(false);

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });
  const scrollDown = () => { scrollOnNextRender.current = true; };

  const toggle = () => {
    setOpen((o) => !o);
    if (!open) scrollDown();
  };

  useEffect(() => {
    if (focusRef) focusRef.current = focusInput;
  }, [focusRef]);

  // Keep the prompt in view after a typed command; nav-bar clicks should land at the top of the new page
  useEffect(() => {
    focusInput();
    if (scrollOnNextRender.current) {
      scrollOnNextRender.current = false;
      inputRef.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [history, open]);

  // Sync terminal cwd with the router. If the change came from the nav bar (not a `cd`),
  // echo an equivalent `cd` line so the terminal history reflects it.
  useEffect(() => {
    if (!currentLocation) return;
    const dir = getDirectoryByAbsolutePath(currentLocation);
    if (navigatedFromTerminal.current) {
      navigatedFromTerminal.current = false;
    } else if (routeFor(dir) !== routeFor(cwd)) {
      setHistory((h) => [...h, { type: HistoryType.COMMAND, cwd, out: `cd ${pathLabel(dir.path)}` }]);
    }
    setCwd(dir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  const navigateToPage = (dir: Directory) => {
    if (!onNavigate) return;
    navigatedFromTerminal.current = true;
    onNavigate(routeFor(dir));
  };

  const handleCommand = (cmd: string) => {
    let output = '';

    const args = cmd.trim().split(/\s+/);
    const commandName = args[0];
    args.shift(); // remove `command`

    const command: Command = commands[commandName];
    const oldCWD = cwd;

    if (!command) {
      if (commandName === 'sudo') output = 'Why would I give you sudo access?';  // special case lol
      else output = `Command not found: ${commandName}`;
    }
    else if (args.length < command.minExpectedArgs) {
      output = `Command ${command.name} expected at least ${command.minExpectedArgs} args, but got ${args.length}`;
    }
    else {
      const context: CommandContext = { cwd, setCwd, navigateToPage, setHistory };

      output = command.callback(args, context);

      if (output === undefined) output = 'Something unexpected happened...';

      if (!command.addToHistory) return;
    }

    const entries: History[] = [{ type: HistoryType.COMMAND, cwd: oldCWD, out: cmd }];
    if (output) entries.push({ type: HistoryType.OUTPUT, cwd: oldCWD, out: output, tone: toneFor(commandName, output) });
    setHistory((h) => [...h, ...entries]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (v) {
      typed.current.push(v);
      typedIdx.current = typed.current.length;
      scrollDown();
      handleCommand(v);
    }
    setInput('');
  };

  const complete = () => {
    const parts = input.split(/\s+/);
    const last = parts[parts.length - 1];

    // First word: complete a command name
    if (parts.length <= 1) {
      const hits = Object.keys(commands).filter((k) => k.startsWith(last));
      if (hits.length === 1) setInput(hits[0] + ' ');
      else if (hits.length > 1) {
        setHistory((h) => [...h,
          { type: HistoryType.COMMAND, cwd, out: input },
          { type: HistoryType.OUTPUT, cwd, out: hits.join('   '), tone: 'help' },
        ]);
      }
      return;
    }

    // Otherwise: complete a path relative to cwd
    const slash = last.lastIndexOf('/');
    const dirPart = slash >= 0 ? last.slice(0, slash + 1) : '';
    const base = slash >= 0 ? last.slice(slash + 1) : last;
    const dir = dirPart ? getDirectoryByAbsolutePath(resolvePath(cwd, dirPart)) : cwd;
    const hits = listChildren(dir).filter((k) => k.startsWith(base));
    if (hits.length === 1) {
      parts[parts.length - 1] = dirPart + hits[0];
      setInput(parts.join(' '));
    } else if (hits.length > 1) {
      setHistory((h) => [...h,
        { type: HistoryType.COMMAND, cwd, out: input },
        { type: HistoryType.OUTPUT, cwd, out: hits.join('   '), tone: 'listing' },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+L clears screen, Ctrl+U clears the line
    if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); setHistory([]); return; }
    if (e.ctrlKey && e.key.toLowerCase() === 'u') { e.preventDefault(); setInput(''); return; }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!typed.current.length) return;
      typedIdx.current = Math.max(0, typedIdx.current - 1);
      setInput(typed.current[typedIdx.current]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!typed.current.length) return;
      typedIdx.current = Math.min(typed.current.length, typedIdx.current + 1);
      setInput(typedIdx.current === typed.current.length ? '' : typed.current[typedIdx.current]);
      return;
    }
    if (e.key === 'Tab') { e.preventDefault(); scrollDown(); complete(); }
  };

  const accent = accentFor(cwd.path);

  return (
    <div className={`terminal ${split ? 'side' : 'stacked'} ${open ? 'open' : 'closed'}`}>
      <div className="terminal-toolbar">
        <button type="button" className="terminal-toggle" onClick={toggle} title={open ? 'Hide terminal' : 'Show terminal'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="square" aria-hidden="true">
            <rect x="2.2" y="3.6" width="19.6" height="16.8" />
            <path d="M5.6 9.2l3.2 2.8-3.2 2.8M11.6 15.4h6" />
          </svg>
          <span className="terminal-toggle-word">{open ? '\u2212' : '+'}</span>
        </button>
      </div>

      {open && (
        <div>
          <div className="terminal-welcome">Welcome to the Portfolio Terminal! Type 'ls' or 'help' to get started.</div>
          {history.map((line, i) => (
            line.type === HistoryType.COMMAND ? (
              <div key={i} className="terminal-line">
                <span className="terminal-prompt" style={{ color: accentFor(line.cwd.path) }}>{promptFor(line.cwd, split)} </span>
                <span>{line.out}</span>
              </div>
            ) : (
              <div key={i} className="terminal-line">
                {line.out.split('\n').map((l, j) => renderLine(l, line.tone || 'default', j))}
              </div>
            )
          ))}
          <form onSubmit={handleSubmit} className="terminal-form">
            <span className="terminal-prompt" style={{ color: accent }}>{promptFor(cwd, split)}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              autoComplete="off"
              spellCheck={false}
              placeholder="Enter command..."
              aria-label="Terminal command"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default Terminal;
