import React, { useEffect, useRef } from 'react';
import './Pets.css';
import petTypes, { PetType } from './petTypes';

const MAX_PETS = 20;
const MAX_BALLS = 5;
const GROUND = 8;        // height of the ground strip at the bottom of the yard
const GRAVITY = 0.45; 
const BOUNCE = -0.7;

interface Pet {
  t: PetType;
  el: HTMLImageElement;
  x: number;
  dir: 1 | -1;
  mode: 'idle' | 'walk';
  next: number;    // timestamp of the next idle/walk decision
  lock: number;    // busy being petted until this timestamp
  carry: number;   // carrying the ball until this timestamp
  anim: string;
}

interface Ball {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const Pets: React.FC = () => {
  const yardRef = useRef<HTMLDivElement>(null);
  const pets = useRef<Pet[]>([]);
  const balls = useRef<Ball[]>([]);

  const placePet = (p: Pet, floor: number) => {
    p.el.style.transform = `translate(${p.x}px,${floor - p.t.h}px) scaleX(${p.dir})`;
  };

  const setAnim = (p: Pet, anim: string) => {
    if (p.anim === anim) return;
    p.anim = anim;
    p.el.src = `${p.t.base}_${anim}_8fps.gif`;
  };

  const petPet = (p: Pet) => {
    const yard = yardRef.current;
    if (!yard) return;
    p.lock = performance.now() + 1300;
    setAnim(p, 'swipe');

    const heart = document.createElement('span');
    heart.textContent = '♥';
    const w = p.el.offsetWidth || 40;
    heart.className = 'pet-heart';
    heart.style.left = `${p.x + w / 2 - 5}px`;
    heart.style.top = `${yard.clientHeight - GROUND - p.t.h - 18}px`;
    yard.appendChild(heart);
    const anim = heart.animate(
      [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-34px)', opacity: 0 }],
      { duration: 1100, easing: 'ease-out' }
    );
    anim.onfinish = () => heart.remove();
  };

  const spawnPet = (typeId: string) => {
    const yard = yardRef.current;
    const t = petTypes.find((x) => x.id === typeId);
    if (!t) return;

    if (pets.current.length >= MAX_PETS) pets.current.shift()?.el.remove();

    const el = document.createElement('img');
    el.draggable = false;
    el.alt = t.name;
    el.className = 'pet-sprite';
    el.style.height = `${t.h}px`;

    const W = yard ? yard.clientWidth : 600;
    const p: Pet = {
      t, el,
      x: 20 + Math.random() * Math.max(40, W - 120),
      dir: Math.random() < 0.5 ? -1 : 1,
      mode: 'idle', next: 0, lock: 0, carry: 0, anim: '',
    };
    el.addEventListener('click', (ev) => { ev.stopPropagation(); petPet(p); });
    pets.current.push(p);
    yard?.appendChild(el);
    setAnim(p, 'idle');
    // Place it on the ground immediately so it never renders at the yard's corner
    placePet(p, yard ? yard.clientHeight - GROUND : t.h);
  };

  const addBall = (x: number, y: number, vx: number, vy: number) => {
    const yard = yardRef.current;
    if (!yard) return;
    if (balls.current.length >= MAX_BALLS) balls.current.shift()?.el.remove();

    const el = document.createElement('div');
    el.className = 'pet-ball';
    yard.appendChild(el);
    balls.current.push({ el, x, y, vx, vy, r: 6 });
  };

  const throwBall = () => {
    const yard = yardRef.current;
    if (!yard) return;
    const fromLeft = Math.random() < 0.5;
    addBall(
      fromLeft ? 10 : yard.clientWidth - 22, 20,
      (fromLeft ? 1 : -1) * (4 + Math.random() * 4),
      -3 - Math.random() * 3
    );
  };

  const yardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    addBall(x - 6, Math.min(y - 6, r.height - 30), (Math.random() - 0.5) * 8, -4 - Math.random() * 3);
  };

  const clearPets = () => {
    pets.current.forEach((p) => p.el.remove());
    balls.current.forEach((b) => b.el.remove());
    pets.current = [];
    balls.current = [];
  };

  useEffect(() => {
    let raf = 0;
    let lastT = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const yard = yardRef.current;
      const last = lastT || now;
      lastT = now;
      if (!yard) return;

      const dt = Math.min(now - last, 50) / 16.67;
      const W = yard.clientWidth;
      const floor = yard.clientHeight - GROUND;

      for (const b of balls.current) {
        b.vy += GRAVITY * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.y > floor - b.r * 2) {
          b.y = floor - b.r * 2;
          b.vy *= BOUNCE;
          b.vx *= 0.82;
          if (Math.abs(b.vy) < 1) b.vy = 0;
        }
        if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * 0.8; }
        if (b.x > W - b.r * 2) { b.x = W - b.r * 2; b.vx = -Math.abs(b.vx) * 0.8; }
        if (b.y >= floor - b.r * 2 - 0.5) b.vx *= Math.pow(0.97, dt);
        b.el.style.transform = `translate(${b.x}px,${b.y}px)`;
      }

      const ball = balls.current[0];
      for (const p of pets.current) {
        const w = p.el.offsetWidth || 40;
        let moving = 0;

        if (p.lock > now) {
          setAnim(p, 'swipe');
        } else if (ball && p.carry < now) {
          // Chase the ball, and pick it up on contact
          const dx = (ball.x + ball.r) - (p.x + w / 2);
          p.dir = dx < 0 ? -1 : 1;
          if (Math.abs(dx) > 6) moving = p.t.speed * 2.4;
          setAnim(p, 'run');
          if (Math.abs(dx) < 14 && ball.y > floor - 40) {
            ball.el.remove();
            balls.current.shift();
            p.carry = now + 4500;
            p.mode = 'walk';
            p.next = now + 1500;
          }
        } else if (p.carry > now) {
          setAnim(p, 'with_ball');
          if (now > p.next) {
            p.dir = Math.random() < 0.5 ? -1 : 1;
            p.next = now + 1200 + Math.random() * 1500;
          }
          moving = p.t.speed * 0.9;
        } else {
          if (now > p.next) {
            p.mode = Math.random() < 0.45 ? 'idle' : 'walk';
            if (p.mode === 'walk') p.dir = Math.random() < 0.5 ? -1 : 1;
            p.next = now + 1800 + Math.random() * 3200;
          }
          setAnim(p, p.mode === 'walk' ? 'walk' : 'idle');
          if (p.mode === 'walk') moving = p.t.speed;
        }

        p.x += p.dir * moving * dt;
        if (p.x < 0) { p.x = 0; if (!ball) p.dir = 1; }
        if (p.x > W - w) { p.x = W - w; if (!ball) p.dir = -1; }
        placePet(p, floor);
      }
    };

    spawnPet('dog');
    raf = requestAnimationFrame(tick);

    const petsOnUnmount = pets.current;
    const ballsOnUnmount = balls.current;
    return () => {
      cancelAnimationFrame(raf);
      petsOnUnmount.forEach((p) => p.el.remove());
      ballsOnUnmount.forEach((b) => b.el.remove());
      pets.current = [];
      balls.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pets">
      <div className="section-rule"><span className="section-path">~/.pets</span></div>

      <div className="pets-controls">
        <span className="pets-label">spawn</span>
        {petTypes.map((t) => (
          <button key={t.id} type="button" className="link-button pet-button" title={`spawn ${t.name}`} onClick={() => spawnPet(t.id)}>
            <img src={t.icon} alt="" />
            <span>{t.name}</span>
          </button>
        ))}

        <span className="pets-divider" />

        <button type="button" className="link-button pet-button ball-button" onClick={throwBall}>
          <span className="ball-dot" />
          <span>ball</span>
        </button>

        <button type="button" className="link-button pet-button pets-clear" onClick={clearPets}>rm -rf</button>
      </div>

      <div ref={yardRef} className="pets-yard" onClick={yardClick}>
        <div className="pets-ground" />
        <div className="pets-yard-hint">click the yard to throw a ball &middot; click a pet to pet it</div>
      </div>

      <div className="pets-credit">
        sprites from <a href="https://github.com/tonybaloney/vscode-pets" target="_blank" rel="noopener noreferrer">vscode-pets</a> (MIT)
        {' '}&middot; dog by NVPH Studio (CC BY-ND 4.0) &middot; fox by Elthen &middot; clippy, duck, crab, snake by Marc Duiker
      </div>
    </div>
  );
};

export default Pets;
