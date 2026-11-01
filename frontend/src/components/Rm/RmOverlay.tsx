import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import './Rm.css';
import { SIKE_DELAY_MS, RESTORE_DELAY_MS } from './config';
import { dissolve, reassemble, show } from './pixelate';
import { clearParticles } from './particles';
import { RmRequest, EVERYTHING, PAGE, waitForTargets } from './targets';
import SikeMessage from './SikeMessage';

type Removed = { key: string; el: HTMLElement };

// Resolves early (without throwing) if the run is cancelled
const wait = (ms: number, signal: AbortSignal) => new Promise<void>((resolve) => {
  const done = () => { clearTimeout(timer); signal.removeEventListener('abort', done); resolve(); };
  const timer = setTimeout(done, ms);
  signal.addEventListener('abort', done);
});

// The part of an element that's actually on screen, so the message lands where you can see it
function visibleRect(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const left = Math.max(0, r.left), top = Math.max(0, r.top);
  const right = Math.min(window.innerWidth, r.right), bottom = Math.min(window.innerHeight, r.bottom);
  return right > left && bottom > top ? { left, top, width: right - left, height: bottom - top } : null;
}

// rm sequence: disintegrate -> pause -> SIKE -> pause -> reassemble
async function sequence(req: RmRequest, signal: AbortSignal, setRemoved: (r: Removed[]) => void) {
  const targets: Removed[] = [];
  for (const key of req.keys) {
    for (const el of await waitForTargets([key], signal)) targets.push({ key, el });
  }
  if (signal.aborted || !targets.length) return;

  const els = targets.map((t) => t.el);
  const pointer = els.map((el) => el.style.pointerEvents);
  els.forEach((el) => { el.style.pointerEvents = 'none'; });

  // Single items might be further down the page; bring the first one into view
  const isItem = !req.keys.includes(EVERYTHING) && !req.keys.includes(PAGE);
  if (isItem && !visibleRect(els[0])) els[0].scrollIntoView({ block: 'center' });

  try {
    await Promise.all(els.map((el) => dissolve(el, signal)));
    await wait(SIKE_DELAY_MS, signal);
    if (signal.aborted) return;
    setRemoved(targets);
    await wait(RESTORE_DELAY_MS, signal);
    setRemoved([]);
    if (signal.aborted) return;
    await Promise.all(els.map((el) => reassemble(el, signal)));
  } finally {
    els.forEach((el, i) => { show(el); el.style.pointerEvents = pointer[i]; });
    if (signal.aborted) clearParticles();
  }
}

type RmOverlayProps = {
  runRef: MutableRefObject<(req: RmRequest) => boolean>;   // set here; returns false if busy
  pathname: string;
};

const RmOverlay: React.FC<RmOverlayProps> = ({ runRef, pathname }) => {
  const [removed, setRemoved] = useState<Removed[]>([]);
  const [, setFrame] = useState(0);
  const active = useRef<{ route: string; ctrl: AbortController } | null>(null);

  useEffect(() => {
    runRef.current = (req) => {
      if (active.current) return false;
      const ctrl = new AbortController();
      active.current = { route: req.route, ctrl };
      sequence(req, ctrl.signal, setRemoved).finally(() => {
        if (active.current?.ctrl === ctrl) active.current = null;
        setRemoved([]);
      });
      return true;
    };
  }, [runRef]);

  // Leaving the page mid-gag puts everything back immediately
  useEffect(() => {
    if (active.current && active.current.route !== pathname) active.current.ctrl.abort();
  }, [pathname]);

  useEffect(() => () => active.current?.ctrl.abort(), []);

  // Keep the messages over their elements while the page scrolls or resizes
  useEffect(() => {
    if (!removed.length) return;
    const remeasure = () => setFrame((f) => f + 1);
    window.addEventListener('scroll', remeasure, true);
    window.addEventListener('resize', remeasure);
    return () => {
      window.removeEventListener('scroll', remeasure, true);
      window.removeEventListener('resize', remeasure);
    };
  }, [removed.length]);

  return (
    <>
      {removed.map(({ key, el }, i) => {
        const r = visibleRect(el);
        if (!r) return null;
        return (
          <div key={i} className="rm-sike" style={r}>
            <SikeMessage target={key} width={r.width} height={r.height} />
          </div>
        );
      })}
    </>
  );
};

export default RmOverlay;
