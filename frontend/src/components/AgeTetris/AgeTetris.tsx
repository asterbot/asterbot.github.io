import React, { useCallback, useEffect, useRef, useState } from 'react';
import './AgeTetris.css';

const BASE = `${process.env.PUBLIC_URL}/games/age/`;
const COLS = 80;
const ROWS = 28;  // the game only draws up to row 27
const FONT_PX = 14;

// ncurses key codes
const KEYS: Record<string, number> = { ArrowDown: 0o402, ArrowUp: 0o403, ArrowLeft: 0o404, ArrowRight: 0o405 };

interface AgeModule {
  callMain: (args: string[]) => void;
  _age_push_key: (key: number) => void;
  onPresent?: (text: string) => void;
  onGameExit?: () => void;
}

const keyCode = (e: KeyboardEvent): number | null => {
  if (e.key in KEYS) return KEYS[e.key];
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) return e.key.charCodeAt(0);
  return null;
};

const AgeTetris: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moduleRef = useRef<AgeModule | null>(null);
  const [status, setStatus] = useState<'loading' | 'running' | 'over' | 'error'>('loading');
  const [focused, setFocused] = useState(false);
  const [run, setRun] = useState(0);  // bump to restart

  const draw = useCallback((text: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const font = `${FONT_PX}px ${css.getPropertyValue('--mono') || 'monospace'}`;
    ctx.font = font;
    const cw = Math.ceil(ctx.measureText('M').width);
    const ch = Math.ceil(FONT_PX * 1.25);
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== COLS * cw * dpr) {
      canvas.width = COLS * cw * dpr;
      canvas.height = ROWS * ch * dpr;
      canvas.style.width = `${COLS * cw}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, COLS * cw, ROWS * ch);
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = css.getPropertyValue('--fg') || '#e4e1e9';

    text.split('\n').slice(0, ROWS).forEach((line, y) => {
      Array.from(line).forEach((g, x) => {
        if (g === ' ') return;
        // Draw full blocks as solid cells so they tile without font gaps
        if (g === '█') ctx.fillRect(x * cw, y * ch, cw, ch);
        else ctx.fillText(g, x * cw, y * ch + ch / 2);
      });
    });
  }, []);

  useEffect(() => {
    let mod: AgeModule | null = null;
    let cancelled = false;
    setStatus('loading');

    import(/* webpackIgnore: true */ `${BASE}age.js`)
      .then(({ default: createAGE }) => createAGE({
        locateFile: (path: string) => BASE + path,
        onPresent: draw,
        onGameExit: () => !cancelled && setStatus('over'),
      }))
      .then((m: AgeModule) => {
        if (cancelled) return;
        mod = m;
        moduleRef.current = m;
        m.callMain([]);
        setStatus('running');
      })
      .catch(() => !cancelled && setStatus('error'));

    return () => {
      cancelled = true;
      moduleRef.current = null;
      if (mod) {
        // Quit the game loop: the first 'q' may only dismiss the start screen
        mod.onPresent = undefined;
        mod._age_push_key('q'.charCodeAt(0));
        mod._age_push_key('q'.charCodeAt(0));
      }
    };
  }, [draw, run]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const code = keyCode(e.nativeEvent);
    if (code === null) return;
    e.preventDefault();
    e.stopPropagation();
    if (status === 'over') setRun((r) => r + 1);
    else moduleRef.current?._age_push_key(code);
  };

  return (
    <div>
      <div className="section-rule"><span className="section-path tetris-accent">~/projects/tetris</span></div>
      <h1 className="section-title tetris-accent">Tetris</h1>
      <div className="section-hint">
        Built on my ASCII (and unicode!) game engine in C++ and ncurses. Click the screen to play. <br /><br />
        This project is bittersweet for me since this is one of my first projects using OOP well and I still remember designing the class layout for Tetris <br />
        If you're curious, one of the most fun parts for me was figuring out how to code the <a href="https://tetris.wiki/Super_Rotation_System" target="_blank">Super Rotation System</a>, which lets you do cool things like T-spins. Try it out if you know how to!
      </div>

      <div
        className={`tetris-screen${focused ? ' focused' : ''}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        data-game
      >
        <canvas ref={canvasRef} />
        {status === 'loading' && <div className="tetris-overlay">loading...</div>}
        {status === 'error' && <div className="tetris-overlay">couldn't load the game :(</div>}
        {status === 'over' && (
          <div className="tetris-overlay" onClick={() => setRun((r) => r + 1)}>game over. press any key to restart</div>
        )}
      </div>

      <div className="tetris-keys">
        <kbd>← →</kbd> move · <kbd>↓</kbd> soft drop · <kbd>space</kbd> hard drop · <kbd>↑</kbd>/<kbd>z</kbd> rotate · <kbd>c</kbd> hold · <kbd>q</kbd> quit
      </div>
    </div>
  );
};

export default AgeTetris;
