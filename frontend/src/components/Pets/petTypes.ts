export interface PetType {
  id: string;
  name: string;
  base: string;    // sprite path prefix, completed as `${base}_${anim}_8fps.gif`
  icon: string;
  speed: number;
  h: number;       // rendered sprite height in px
}

// Sprites from vscode-pets (MIT), vendored under /public/media
const petTypes: PetType[] = [
  { id: 'dog',    name: 'dog',         base: '/media/dog/brown',           icon: '/media/dog/icon.png',           speed: 1.3, h: 40 },
  { id: 'fox',    name: 'fox',         base: '/media/fox/red',             icon: '/media/fox/icon.png',           speed: 1.5, h: 40 },
  { id: 'crab',   name: 'crab',        base: '/media/crab/red',            icon: '/media/crab/icon.png',          speed: 0.8, h: 34 },
  { id: 'clippy', name: 'clippy',      base: '/media/clippy/yellow',       icon: '/media/clippy/icon_yellow.png', speed: 1.0, h: 44 },
  { id: 'duck',   name: 'duck',        base: '/media/rubber-duck/yellow',  icon: '/media/rubber-duck/icon.png',   speed: 0.9, h: 36 },
  { id: 'snake',  name: 'snake',       base: '/media/snake/green',         icon: '/media/snake/icon.png',         speed: 0.7, h: 38 },
];

export default petTypes;
