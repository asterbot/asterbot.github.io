import React from 'react';

// Demo data: branches and commits
const blogData = [
  { branch: 'main', color: '#ffcc00', commits: [
    { id: 'c1', msg: 'Welcome to my blog!', date: '2024-01-01' },
    { id: 'c2', msg: 'My first term at UWaterloo', date: '2024-02-01' },
  ]},
  { branch: 'cs', color: '#00bfff', commits: [
    { id: 'c3', msg: 'Cool CS project', date: '2024-03-01' },
    { id: 'c4', msg: 'Learning algorithms', date: '2024-04-01' },
  ]},
];

const maxCommits = Math.max(...blogData.map(b => b.commits.length));

const Blog: React.FC = () => {
  return (
    <div style={{ background: '#23272e', minHeight: '100vh', color: '#fff', padding: '2rem', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ color: '#ffcc00', marginBottom: 32 }}>Blog Git Graph</h2>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: '4rem', minHeight: 320, justifyContent: 'center' }}>
        {blogData.map((branch, branchIdx) => (
          <div key={branch.branch} style={{ position: 'relative', minWidth: 180 }}>
            {/* Branch label */}
            <div style={{ color: branch.color, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, letterSpacing: 1 }}>{branch.branch}</div>
            {/* Vertical line for branch */}
            <div style={{ position: 'absolute', left: 32, top: 32, bottom: 0, width: 4, background: branch.color, borderRadius: 2, zIndex: 0 }}></div>
            {/* Commits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: 24 }}>
              {Array.from({ length: maxCommits }).map((_, i) => {
                const commit = branch.commits[i];
                return commit ? (
                  <div key={commit.id} style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    {/* Node */}
                    <div style={{ background: branch.color, borderRadius: '50%', width: 28, height: 28, border: '2px solid #fff', marginRight: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}></div>
                    {/* Commit message and date */}
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{commit.msg}</div>
                      <div style={{ color: '#aaa', fontSize: 13 }}>{commit.date}</div>
                    </div>
                  </div>
                ) : (
                  // Empty space for alignment
                  <div key={i} style={{ height: 28 + 16 }}></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '2.5rem', color: '#aaa', fontSize: 15, textAlign: 'center' }}>
        Each branch is a blog topic. Each commit is a blog post.<br />
        <span style={{ color: '#ffcc00' }}>main</span> and <span style={{ color: '#00bfff' }}>cs</span> are example topics.
      </div>
    </div>
  );
};

export default Blog;


