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
 *
 * The graph lays itself out from this order: each branch forks off the trunk
 * just below its oldest commit, so you never hand-place a line.
 */
const posts: Post[] = [
  // { id: 'lorem_ipsum_dolor',      title: 'Lorem Ipsum Dolor Sit',   branch: 'co-op' },
  // { id: 'consectetur_adipiscing', title: 'Consectetur Adipiscing',  branch: 'cs-stuff' },
  // { id: 'sed_do_eiusmod',         title: 'Sed Do Eiusmod',          branch: 'music' },
  // { id: 'tempor_incididunt',      title: 'Tempor Incididunt',       branch: 'main' },
  // { id: 'ut_labore_et_dolore',    title: 'Ut Labore Et Dolore',     branch: 'games' },
  // { id: 'magna_aliqua',           title: 'Magna Aliqua',            branch: 'co-op' },
  // { id: 'ut_enim_ad_minim',       title: 'Ut Enim Ad Minim',        branch: 'cs-stuff' },
  // { id: 'quis_nostrud',           title: 'Quis Nostrud',            branch: 'music' },
  // { id: 'exercitation_ullamco',   title: 'Exercitation Ullamco',    branch: 'main' },
  // { id: 'laboris_nisi',           title: 'Laboris Nisi',            branch: 'games' },
  // { id: 'aliquip_ex_ea',          title: 'Aliquip Ex Ea',           branch: 'cs-stuff' },
  // { id: 'commodo_consequat',      title: 'Commodo Consequat',       branch: 'games' },
  {
    id: 'sleep_sort', title: 'Sleep Sort', branch: 'cs-stuff',
    blurb: 'A blog where I analyze a random algorithm posted on 4chan for some reason',
  },
  {
    id: 'initial_commit', title: 'Initial Commit', branch: 'main',
    blurb: 'An initial blog for my website!',
  },
];

export default posts;
