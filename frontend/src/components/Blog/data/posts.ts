export interface Post {
  id: string;      // folder under /public/blogfiles/<id>/index.md, and the /blogs/<id> route
  title: string;
  branch: string;  // must match a name in branches.ts
  blurb?: string;  // shown by the terminal's `cat`; falls back to the title
}

/*
 * ADD A BLOG HERE — newest first.
 *
 * This list is the whole story: it drives the commit graph, the routes, the
 * terminal's blogs/ directory and the branch chips. The only other thing a new
 * post needs is its markdown at public/blogfiles/<id>/index.md.
 */
const posts: Post[] = [
  { id: 'startup_culture', title: "How I find working at a startup", branch: "co-op"},
  { id: 'motive', title: "Embedded software is cool!", branch: "co-op"},
  { id: 'sf', title: "Living in SF!", branch: "main"},
  { id: 'ai_thoughts', title: "My thoughts on AI", branch: "main"},
  { id: 'celeste', title: "Climbing mount celeste!", branch: "games"},
  { id: 'cool_graphics', title: "Graphics is cool!", branch: 'cs-stuff'},
  { id: 'undertale', title: "My thoughts on Undertale", branch: "games"},
  { id: 'working_at_ford', title: "Working at Ford", branch: 'co-op'},
  { id: 'fork_bomb', title: "Fork Bombs", branch: 'cs-stuff' },
  { id: 'isa', title: 'Teaching at a University!', branch: 'co-op' },
  { id: 'sleep_sort', title: 'Sleep Sort', branch: 'cs-stuff'},
  { id: 'initial_commit', title: 'Initial Commit', branch: 'main' },
];

export default posts;
