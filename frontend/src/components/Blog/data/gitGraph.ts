import branches from './branches';
import posts, { Post } from './posts';

const DIM = '#46464f';
const TRUNK = 0;

export interface GraphCell {
  text: string;
  color: string;
}

export interface GraphRow {
  key: string;
  cells: GraphCell[];      // the ASCII lane art, one cell per span
  isCommit: boolean;
  id?: string;
  hash?: string;
  title?: string;
  titleColor?: string;
  tag?: string;            // `(HEAD -> main)` / `(cs-stuff)`, on a branch's newest commit
  tagColor?: string;
}

/** Lane a post sits in: the index of its branch, falling back to the trunk. */
export function laneOf(post: Post): number {
  const i = branches.findIndex((b) => b.name === post.branch);
  return i === -1 ? TRUNK : i;
}

export function postById(id: string | undefined): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function branchOf(post: Post) {
  return branches[laneOf(post)];
}

export function postsOnLane(lane: number): Post[] {
  return posts.filter((p) => laneOf(p) === lane);
}

/** Stable 7-char pseudo commit hash, so each post always shows the same one. */
export function shortHash(s: string): string {
  let x = 7;
  for (const ch of s) x = (x * 31 + ch.charCodeAt(0)) >>> 0;
  return x.toString(16).padStart(7, '0').slice(0, 7);
}

type Row = { post: Post } | { fork: number };

/**
 * Lay the posts out as git log rows. Posts are newest first; each non-trunk
 * branch gets a fork row just below its oldest commit, where it rejoins the
 * trunk. Nothing here is hand-placed — it all follows from posts.ts.
 */
function layout(): Row[] {
  const rows: Row[] = [];
  posts.forEach((post, i) => {
    rows.push({ post });
    const lane = laneOf(post);
    const isOldestOnBranch = !posts.slice(i + 1).some((p) => laneOf(p) === lane);
    if (lane !== TRUNK && isOldestOnBranch) rows.push({ fork: lane });
  });
  return rows;
}

/**
 * Build the renderable graph. `selected` dims every lane but one; null shows all.
 */
export default function buildGraph(selected: number | null): GraphRow[] {
  const rows = layout();
  const lastLane = branches.length - 1;
  const laneOfRow = (r: Row) => ('post' in r ? laneOf(r.post) : r.fork);

  // First (newest) and last row each lane occupies, so we know where to draw its line
  const head: Record<number, number> = {};
  const end: Record<number, number> = {};
  rows.forEach((r, i) => {
    const lane = laneOfRow(r);
    if ('post' in r && head[lane] === undefined) head[lane] = i;
    if ('fork' in r) end[lane] = i;
  });
  end[TRUNK] = rows.length - 1;

  const col = (lane: number) =>
    selected === null || selected === lane ? branches[lane].color : DIM;

  return rows.map((r, i) => {
    const forking = laneOfRow(r);
    const cells: GraphCell[] = [];

    for (let lane = 0; lane <= lastLane; lane++) {
      const active = head[lane] !== undefined && i >= head[lane] && i <= end[lane];
      let glyph = ' ';
      let gap = '  ';
      let glyphColor = col(lane);
      let gapColor = col(lane);

      if ('post' in r) {
        if (lane === forking) glyph = '●';
        else if (active) glyph = '│';
      } else if (lane === TRUNK) {
        // the trunk receives the branch rejoining it
        glyph = '├';
        gap = '──';
        gapColor = col(forking);
      } else if (lane < forking) {
        glyph = '─';
        gap = '──';
        glyphColor = col(forking);
        gapColor = col(forking);
      } else if (lane === forking) {
        glyph = '╯';
      } else if (active) {
        glyph = '│';
      }

      cells.push({ text: glyph, color: glyphColor });
      if (lane !== lastLane) cells.push({ text: gap, color: gapColor });
    }

    if (!('post' in r)) {
      return { key: `fork-${forking}-${i}`, cells, isCommit: false };
    }

    const post = r.post;
    const lit = selected === null || selected === forking;
    const isBranchHead = head[forking] === i;
    return {
      key: post.id,
      cells,
      isCommit: true,
      id: post.id,
      hash: shortHash(post.id),
      title: post.title,
      titleColor: lit ? branches[forking].color : DIM,
      tag: isBranchHead
        ? forking === TRUNK
          ? `(HEAD → ${branches[TRUNK].name})`
          : `(${branches[forking].name})`
        : undefined,
      tagColor: col(forking),
    };
  });
}
