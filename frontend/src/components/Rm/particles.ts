// One full-viewport canvas shared by every rm effect, drawing the "dust" pixels that fly off
// (or back onto) whatever is being removed. It only animates while there are particles.

type Particle = {
  x: number; y: number;                       // current position (viewport px)
  vx: number; vy: number;                     // drift in px/ms (outgoing dust)
  fromX: number; fromY: number;               // flight path (incoming pixels)
  toX: number; toY: number;
  incoming: boolean;
  size: number;
  color: string;
  born: number;
  life: number;
};

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let frame = 0;
let last = 0;

function resize() {
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.className = 'rm-particles';
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100vw', height: '100vh',
    pointerEvents: 'none', zIndex: '9999',
  });
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
}

function step(now: number) {
  if (!ctx) return;
  const dt = Math.min(48, now - last);
  last = now;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles = particles.filter((p) => now - p.born < p.life);
  for (const p of particles) {
    const t = Math.max(0, (now - p.born) / p.life);
    let alpha: number;
    if (p.incoming) {
      const e = 1 - Math.pow(1 - t, 3);   // ease out: fast start, gentle landing
      p.x = p.fromX + (p.toX - p.fromX) * e;
      p.y = p.fromY + (p.toY - p.fromY) * e;
      alpha = 0.25 + 0.75 * t;
    } else {
      p.vy -= 0.00035 * dt;               // dust floats upward as it goes
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      alpha = 1 - t;
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;

  frame = particles.length ? requestAnimationFrame(step) : 0;
}

function start() {
  if (frame) return;
  last = performance.now();
  frame = requestAnimationFrame(step);
}

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

// A pixel breaking off at (x, y) and drifting away up and to the right
export function spawnDust(x: number, y: number, size: number, color: string) {
  ensureCanvas();
  particles.push({
    x, y, fromX: x, fromY: y, toX: x, toY: y,
    vx: rand(0.04, 0.22), vy: rand(-0.12, 0.02),
    incoming: false,
    size: size * rand(0.5, 1),
    color,
    born: performance.now(),
    life: rand(600, 1300),
  });
  start();
}

// A pixel flying back in from the right to land at (x, y) after `life` ms
export function spawnIncoming(x: number, y: number, size: number, color: string, life: number) {
  ensureCanvas();
  const fromX = x + rand(60, 240);
  const fromY = y - rand(-30, 160);
  particles.push({
    x: fromX, y: fromY, fromX, fromY, toX: x, toY: y,
    vx: 0, vy: 0,
    incoming: true,
    size,
    color,
    born: performance.now(),
    life,
  });
  start();
}

export function clearParticles() {
  particles = [];
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
}
