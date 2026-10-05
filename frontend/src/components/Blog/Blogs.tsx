import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Blog.css';
import branches from './data/branches';
import buildGraph, { postsOnLane } from './data/gitGraph';

// The blog index as `git log --graph --all`: one row per post, lanes per branch,
// with chips to filter down to a single branch. Everything is derived from
// data/posts.ts and data/branches.ts.
const Blogs: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const rows = buildGraph(selected);

  return (
    <div>
      <div className="section-rule"><span className="section-path blogs-accent">~/blogs</span></div>
      <h1 className="section-title blogs-accent">Blogs</h1>
      <div className="section-hint">git log --graph --all &middot; click a commit to read it</div>
      <div className="section-hint">All blogs are written without AI! This is all human slop</div>

      <div className="branch-chips">
        <button
          type="button"
          className="link-button branch-chip"
          style={{ borderColor: selected === null ? 'var(--fg)' : 'var(--line)' }}
          onClick={() => setSelected(null)}
        >
          --all
        </button>
        {branches.map((branch, lane) => (
          <button
            key={branch.name}
            type="button"
            className="link-button branch-chip"
            style={{
              borderColor: selected === lane ? branch.color : 'var(--line)',
              color: selected === null || selected === lane ? 'var(--fg)' : 'var(--dim)',
            }}
            onClick={() => setSelected((s) => (s === lane ? null : lane))}
          >
            <span style={{ color: branch.color }}>&#9679;</span>
            <span>{branch.name}</span>
            <span className="branch-chip-count">{postsOnLane(lane).length}</span>
          </button>
        ))}
      </div>

      <div className="git-log">
        {rows.map((row) => (
          <div key={row.key} className="git-row" data-rm={row.isCommit ? `blog:${row.id}` : undefined}>
            <span className="git-lanes">
              {row.cells.map((cell, i) => (
                <span key={i} style={{ color: cell.color }}>{cell.text}</span>
              ))}
            </span>
            {row.isCommit && (
              <div className="git-commit-line">
                <span className="git-hash" style={{ color: row.tagColor }}>{row.hash}</span>
                {row.tag && <span className="git-ref" style={{ color: row.tagColor }}>{row.tag}</span>}
                <button
                  type="button"
                  className="link-button git-commit"
                  title={row.title}
                  style={{ color: row.titleColor }}
                  onClick={() => navigate('/blogs/' + row.id)}
                >
                  {row.title}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
