// Every knob for the `rm` gag lives here

export const BLOCK_SIZE = 8;            // px per "pixel" the content breaks into
export const MAX_CELLS = 8000;          // big targets (a whole page) use bigger pixels to stay under this

export const DISSOLVE_MS = 1400;        // time to fully disintegrate
export const SIKE_DELAY_MS = 3000;      // how long the empty space sits there before the reveal
export const RESTORE_DELAY_MS = 2000;   // how long the reveal shows before things come back
export const RESTORE_MS = 1400;         // time to fully reassemble
export const FLIGHT_MS = 450;           // how long a returning pixel flies before it lands

export const SWEEP = 0.65;              // 0 = random static, 1 = a clean left-to-right wipe
export const PARTICLE_BUDGET = 1800;    // max dust particles per element per pass

// CSS variables the dust is coloured from (resolved at run time)
export const PARTICLE_COLORS = ['--fg', '--red', '--pink', '--lav', '--peri'];
