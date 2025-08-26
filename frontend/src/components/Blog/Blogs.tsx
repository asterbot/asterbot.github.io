import React from 'react';
import './Blog.css';
import CommitGraph from './CommitGraph';

const Blogs: React.FC = () => {
  return (
    <div className="blog-container">
      <div className="blog-title">Blogs</div>
      <CommitGraph />
    </div>
  );
};

export default Blogs;
