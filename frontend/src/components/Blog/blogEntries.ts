export interface BlogEntry {
  id: string;      // folder under /public/blogfiles/
  title: string;
  branch: string;  // shown in parentheses after the title, like `git log --graph`
}

// Newest first. The first entry sits on a side branch, the rest on main.
const blogEntries: BlogEntry[] = [
  { id: 'sleep_sort', title: 'Sleep Sort', branch: 'CS stuff' },
  { id: 'initial_commit', title: 'Initial Commit', branch: 'main' },
];

export default blogEntries;
