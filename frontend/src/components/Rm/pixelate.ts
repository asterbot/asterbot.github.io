import {
  BLOCK_SIZE, MAX_CELLS, DISSOLVE_MS, RESTORE_MS, FLIGHT_MS, SWEEP, PARTICLE_BUDGET, PARTICLE_COLORS,
} from './config';
import { spawnDust, spawnIncoming } from './particles';

// Breaks an element into a grid of blocks and hides/shows them one at a time. The element itself
// is never moved or re-laid-out: a CSS mask, redrawn from a canvas as blocks flip, hides the gone
// blocks, so it works over any background and nothing around it shifts.

const HIDDEN = 'linear-gradient(transparent, transparent)';
const MAX_MASK_PIXELS = 1_500_000;   // the mask canvas is downscaled past this

function setMask(el: HTMLElement, value: string | null) {
  const props = ['mask-image', '-webkit-mask-image'];
  const sizes = ['mask-size', '-webkit-mask-size'];
  const repeats = ['mask-repeat', '-webkit-mask-repeat'];
  if (value === null) {
    [...props, ...sizes, ...repeats].forEach((p) => el.style.removeProperty(p));
    return;
  }
  props.forEach((p) => el.style.setProperty(p, value));
  sizes.forEach((p) => el.style.setProperty(p, '100% 100%'));
  repeats.forEach((p) => el.style.setProperty(p, 'no-repeat'));
}

export const hide = (el: HTMLElement) => setMask(el, HIDDEN);
export const show = (el: HTMLElement) => setMask(el, null);

// The mask: one canvas whose opaque pixels are the visible blocks, encoded to a blob URL whenever
// it changes. The previous image stays as a second mask layer until the new one has had time to
// load, so the element never flashes while an image decodes (layers add together).
class BlockMask {
  private canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private scale: number;
  private urls: string[] = [];
  private encoding = false;
  private dirty = false;
  private disposed = false;

  constructor(private el: HTMLElement, w: number, h: number, private block: number, visible: boolean) {
    this.scale = Math.min(1, Math.sqrt(MAX_MASK_PIXELS / (w * h)));
    this.canvas.width = Math.max(1, Math.round(w * this.scale));
    this.canvas.height = Math.max(1, Math.round(h * this.scale));
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.fillStyle = '#000';
    if (visible) this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  set(col: number, row: number, visible: boolean) {
    // Snap both edges the same way so neighbouring blocks never leave a hairline gap
    const s = this.block * this.scale;
    const x = Math.floor(col * s), y = Math.floor(row * s);
    const w = Math.floor((col + 1) * s) - x, h = Math.floor((row + 1) * s) - y;
    if (visible) this.ctx.fillRect(x, y, w, h);
    else this.ctx.clearRect(x, y, w, h);
    this.dirty = true;
  }

  flush() {
    if (!this.dirty || this.encoding || this.disposed) return;
    this.dirty = false;
    this.encoding = true;
    this.canvas.toBlob((blob) => {
      this.encoding = false;
      if (this.disposed || !blob) return;
      this.urls.unshift(URL.createObjectURL(blob));
      while (this.urls.length > 2) URL.revokeObjectURL(this.urls.pop()!);
      setMask(this.el, this.urls.map((u) => `url(${u})`).join(', '));
    });
  }

  dispose() {
    this.disposed = true;
    this.urls.forEach((u) => URL.revokeObjectURL(u));
    this.urls = [];
  }
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fade(el: HTMLElement, out: boolean, duration: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    show(el);
    const anim = el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration, direction: out ? 'normal' : 'reverse', easing: 'ease',
    });
    const done = () => {
      signal.removeEventListener('abort', done);
      anim.cancel();
      if (out && !signal.aborted) hide(el);
      resolve();
    };
    anim.onfinish = done;
    signal.addEventListener('abort', done);
  });
}

function animate(el: HTMLElement, out: boolean, signal: AbortSignal): Promise<void> {
  const duration = out ? DISSOLVE_MS : RESTORE_MS;
  if (reducedMotion()) return fade(el, out, duration, signal);

  const start = el.getBoundingClientRect();
  if (!start.width || !start.height) {
    if (out) hide(el); else show(el);
    return Promise.resolve();
  }

  // Bigger targets get bigger pixels so the cell count (and the mask redraws) stay bounded
  const block = Math.max(BLOCK_SIZE, Math.ceil(Math.sqrt((start.width * start.height) / MAX_CELLS)));
  const cols = Math.ceil(start.width / block);
  const rows = Math.ceil(start.height / block);
  const n = cols * rows;

  // When each block flips: mostly a left-to-right sweep, with noise so the edge crumbles.
  // Coming back plays the same timeline in reverse, like a rewind.
  const times = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = ((i % cols) / cols) * SWEEP + Math.random() * (1 - SWEEP);
    times[i] = (out ? t : 1 - t) * duration;
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => times[a] - times[b]);

  const css = getComputedStyle(document.documentElement);
  const colors = PARTICLE_COLORS.map((v) => css.getPropertyValue(v).trim() || '#fff');
  const color = () => colors[(Math.random() * colors.length) | 0];
  const spawnChance = Math.min(1, PARTICLE_BUDGET / n);

  const mask = new BlockMask(el, start.width, start.height, block, !out);
  if (!out) hide(el);

  // Viewport position of a block, if it's on screen (no point spawning dust nobody sees)
  const onScreen = (rect: DOMRect, i: number) => {
    const x = rect.left + (i % cols) * block;
    const y = rect.top + Math.floor(i / cols) * block;
    return x > -block && y > -block && x < window.innerWidth && y < window.innerHeight ? [x, y] : null;
  };

  return new Promise((resolve) => {
    const t0 = performance.now();
    let flipped = 0;    // blocks whose visibility has changed
    let launched = 0;   // incoming pixels sent on their way (restore only)

    const finish = () => {
      mask.dispose();
      if (out && !signal.aborted) hide(el); else show(el);
      resolve();
    };

    const tick = (now: number) => {
      if (signal.aborted) return finish();
      const elapsed = now - t0;
      const rect = el.getBoundingClientRect();

      if (out) {
        while (flipped < n && times[order[flipped]] <= elapsed) {
          const i = order[flipped++];
          mask.set(i % cols, Math.floor(i / cols), false);
          const at = Math.random() < spawnChance && onScreen(rect, i);
          if (at) spawnDust(at[0], at[1], block, color());
        }
      } else {
        // Each pixel launches FLIGHT_MS before its slot fills in, landing as it appears
        while (launched < n && times[order[launched]] <= elapsed) {
          const i = order[launched++];
          const at = Math.random() < spawnChance && onScreen(rect, i);
          if (at) spawnIncoming(at[0], at[1], block, color(), FLIGHT_MS);
        }
        while (flipped < n && times[order[flipped]] + FLIGHT_MS <= elapsed) {
          const i = order[flipped++];
          mask.set(i % cols, Math.floor(i / cols), true);
        }
      }

      if (flipped >= n) return finish();
      mask.flush();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// Both resolve when done, or straight away (with the element fully shown) once `signal` aborts
export const dissolve = (el: HTMLElement, signal: AbortSignal) => animate(el, true, signal);
export const reassemble = (el: HTMLElement, signal: AbortSignal) => animate(el, false, signal);
