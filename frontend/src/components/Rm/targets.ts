// What `rm` can point at. Page elements opt in with `data-rm="<key>"` (e.g. "project:age");
// these two special keys cover the bigger targets.
export const EVERYTHING = 'everything';   // the whole site except the terminal
export const PAGE = 'page';               // the current page's content

export interface RmRequest {
  route: string;    // the page the targets live on (the terminal navigates there first)
  keys: string[];
}

const SELECTORS: Record<string, string[]> = {
  [EVERYTHING]: ['.social-rail', '.prompt-bar', '.page-content'],
  [PAGE]: ['.page-content'],
};

const selectorsFor = (key: string) => SELECTORS[key] ?? [`[data-rm="${CSS.escape(key)}"]`];

const isRendered = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
};

// Every on-screen element for these keys
function find(keys: string[]) {
  const found = keys.map((key) =>
    selectorsFor(key).flatMap((s) => Array.from(document.querySelectorAll<HTMLElement>(s))).filter(isRendered)
  );
  return { all: Array.from(new Set(found.flat())), complete: found.every((els) => els.length > 0) };
}

// After a navigation the targets may take a moment to show up (blog posts are fetched), so keep
// looking for a little while, then go with whatever turned up.
export function waitForTargets(keys: string[], signal: AbortSignal, timeout = 1500): Promise<HTMLElement[]> {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const look = () => {
      if (signal.aborted) return resolve([]);
      const { all, complete } = find(keys);
      if (complete || performance.now() - t0 > timeout) return resolve(all);
      requestAnimationFrame(look);
    };
    requestAnimationFrame(look);
  });
}
