import React, { useState, useRef, useEffect, useLayoutEffect, MutableRefObject } from 'react';
import './Terminal.css';
import root from './data/directoryData/terminalData';
import { Directory } from './data/directoryData/types';
import { getDirectoryByAbsolutePath, listChildren, resolvePath, pathLabel, accentFor } from './data/directoryData/utils';
import commands from './data/commands/utils';
import { HistoryType, History, Command, CommandContext, Tone } from './data/commands/types';

const PROMPT_SYMBOL = '$';
const WIDTH_KEY = 'terminal-width';
const MIN_WIDTH = 260;
const MIN_CONTENT_WIDTH = 360;   // always leave the page content at least this much room
const STACKED_QUERY = '(max-width: 899px)';   // matches Terminal.css: pane sits under the content, full width

function loadWidth(): number | null {
  try {
    const w = Number(localStorage.getItem(WIDTH_KEY));
    return w > 0 ? w : null;
  } catch {
    return null;
  }
}

function saveWidth(w: number | null) {
  try {
    if (w === null) localStorage.removeItem(WIDTH_KEY);
    else localStorage.setItem(WIDTH_KEY, String(w));
  } catch {
    // storage unavailable: the width just won't persist
  }
}

// The width the pane's CSS actually resolved to (content-box, so excludes the left padding/border)
function cssWidth(el: HTMLElement) {
  return parseFloat(getComputedStyle(el).width);
}

// Size the pane to `preferred`, then shrink it as far as needed so the page content beside it
// keeps MIN_CONTENT_WIDTH and doesn't overflow (e.g. the projects grid's minimum column width,
// the pets control row). If the content overflows even at MIN_WIDTH, the terminal isn't the
// cause, so leave it be.
function fitPane(pane: HTMLElement, preferred: number | null) {
  const split = pane.parentElement;
  const content = split?.querySelector<HTMLElement>('.page-content');
  const set = (w: number | null) => {
    if (w === null) pane.style.removeProperty('--terminal-width');
    else pane.style.setProperty('--terminal-width', `${w}px`);
  };
  const overflows = () => !!content && content.scrollWidth > content.clientWidth;

  set(preferred);
  if (!split || !content || window.matchMedia(STACKED_QUERY).matches) return;

  // Widest the pane can be while leaving the content MIN_CONTENT_WIDTH
  const chrome = pane.getBoundingClientRect().width - cssWidth(pane);   // left padding + border
  const gap = parseFloat(getComputedStyle(split).columnGap) || 0;
  const cap = Math.floor(split.clientWidth - MIN_CONTENT_WIDTH - gap - chrome);
  if (cssWidth(pane) > cap) set(Math.max(MIN_WIDTH, cap));
  if (!overflows()) return;

  let hi = Math.floor(cssWidth(pane));
  let lo = MIN_WIDTH;
  if (hi <= lo) return;
  set(lo);
  if (overflows()) { set(preferred); return; }

  // Widest width that still fits; each probe forces a (cheap) synchronous layout
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    set(mid);
    if (overflows()) hi = mid;
    else lo = mid;
  }
  set(lo);
}
const ERROR_PATTERN = /breaking this|unexpected|No manual entry|not found|no such directory|Already at root|sudo|expected at least/;

// The pane is narrow, so the prompt is just the path
function promptFor(cwd: Directory) {
  return `${pathLabel(cwd.path)} ${PROMPT_SYMBOL}`;
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
};

const Terminal: React.FC<TerminalProps> = ({ onNavigate, currentLocation, focusRef }) => {
  const [history, setHistory] = useState<History[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(true);
  const [width, setWidth] = useState<number | null>(loadWidth);   // null = default CSS width
  const paneRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(width);
  widthRef.current = width;
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

  // Re-fit whenever the preferred width or the page changes...
  useLayoutEffect(() => {
    if (open && paneRef.current) fitPane(paneRef.current, width);
  }, [width, open, currentLocation]);

  // ...and when the window resizes or page content arrives late (blog posts, pets, etc.)
  useEffect(() => {
    const pane = paneRef.current;
    const content = pane?.parentElement?.querySelector('.page-content');
    if (!pane || !content) return;
    let frame = 0;
    const refit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (pane.classList.contains('open')) fitPane(pane, widthRef.current);
      });
    };
    const observer = new MutationObserver(refit);
    observer.observe(content, { childList: true, subtree: true });
    window.addEventListener('resize', refit);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', refit);
    };
  }, []);

  // Drag the pane's left edge to resize it. Width is measured from the pane's right edge,
  // which stays put while dragging.
  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    const pane = paneRef.current;
    if (!pane) return;
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const rect = pane.getBoundingClientRect();
    const chrome = rect.width - cssWidth(pane);   // left padding + border, outside the CSS width
    document.body.classList.add('terminal-resizing');

    let latest: number | null = null;

    const onMove = (ev: PointerEvent) => {
      latest = Math.round(Math.max(MIN_WIDTH, rect.right - ev.clientX - chrome));   // fitPane caps it
      setWidth(latest);
    };
    const onUp = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      document.body.classList.remove('terminal-resizing');
      if (latest === null) return;
      // Keep what the pane actually settles at, not how far past the limit the pointer went
      fitPane(pane, latest);
      const settled = Math.round(cssWidth(pane));
      setWidth(settled);
      saveWidth(settled);
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  };

  const resetWidth = () => {
    setWidth(null);
    saveWidth(null);
  };

  const accent = accentFor(cwd.path);

  return (
    <div
      ref={paneRef}
      className={`terminal ${open ? 'open' : 'closed'}`}
    >
      {open && (
        <div
          className="terminal-resize"
          onPointerDown={startResize}
          onDoubleClick={resetWidth}
          title="Drag to resize · double-click to reset"
          role="separator"
          aria-orientation="vertical"
        />
      )}
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
                <span className="terminal-prompt" style={{ color: accentFor(line.cwd.path) }}>{promptFor(line.cwd)} </span>
                <span>{line.out}</span>
              </div>
            ) : (
              <div key={i} className="terminal-line">
                {line.out.split('\n').map((l, j) => renderLine(l, line.tone || 'default', j))}
              </div>
            )
          ))}
          <form onSubmit={handleSubmit} className="terminal-form">
            <span className="terminal-prompt" style={{ color: accent }}>{promptFor(cwd)}</span>
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
