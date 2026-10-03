export interface Branch {
  name: string;   // shown on the chip and in the `(branch)` tag
  color: string;
}

/*
 * ADD A BRANCH HERE.
 *
 * The first entry is the trunk: it is drawn in the leftmost lane, never forks,
 * and carries the `(HEAD -> name)` tag. Every other branch forks off it.
 * A branch's lane is its index in this array, so reordering re-draws the graph.
 */
const branches: Branch[] = [
  { name: 'main',     color: '#bdc2ff' },
  // { name: 'co-op',    color: '#a9dcc5' },
  // { name: 'music',    color: '#e9d8a6' },
  // { name: 'games',    color: '#ffb4ab' },
  { name: 'cs-stuff', color: '#e7b9d5' },
];

export default branches;
