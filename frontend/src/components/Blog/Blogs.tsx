import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Blog.css';
import blogEntries from './blogEntries';

// Renders the blog list as a `git log --graph --all`: the newest post on a side
// branch that merges down into main, and every other post as a commit on main.
const Blogs: React.FC = () => {
  const navigate = useNavigate();
  const [head, ...rest] = blogEntries;

  return (
    <div>
      <div className="section-rule"><span className="section-path blogs-accent">~/blogs</span></div>
      <h1 className="section-title blogs-accent">Blogs</h1>
      <div className="section-hint">git log --graph --all &middot; click a commit to read it</div>

      <div className="git-log">
        {head && (
          <>
            <div className="git-row">
              <span className="git-main">│</span>
              <span className="git-branch">●</span>
              <button type="button" className="link-button git-commit" onClick={() => navigate('/blogs/' + head.id)}>{head.title}</button>
              <span className="git-ref">({head.branch})</span>
            </div>
            <div className="git-row">
              <span className="git-main">│</span>
              <span className="git-branch">╱</span>
            </div>
          </>
        )}
        {rest.map((entry, i) => (
          <React.Fragment key={entry.id}>
            {i > 0 && <div className="git-row"><span className="git-main">│</span></div>}
            <div className="git-row">
              <span className="git-main">●</span>
              <span className="git-col" />
              <button type="button" className="link-button git-commit" onClick={() => navigate('/blogs/' + entry.id)}>{entry.title}</button>
              <span className="git-ref">({entry.branch})</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
