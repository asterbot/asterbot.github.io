import React from 'react';
import './Blog.css';
import CommitGraph from './CommitGraph';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      title: 'Building a Terminal Interface in React',
      excerpt: 'Exploring the challenges and solutions when creating an interactive terminal component for a web portfolio, including command parsing and navigation synchronization.',
      date: '2024-01-15',
      readMore: 'Read More'
    },
    {
      title: 'The Art of Game Development',
      excerpt: 'A deep dive into the creative process behind indie game development, from concept to final product, and the lessons learned along the way.',
      date: '2024-01-10',
      readMore: 'Read More'
    },
    {
      title: 'Machine Learning in Creative Applications',
      excerpt: 'How artificial intelligence is revolutionizing creative industries, from music generation to visual art, and the ethical considerations involved.',
      date: '2024-01-05',
      readMore: 'Read More'
    }
  ];

  return (
    <div className="blog-container">
      <CommitGraph />
    </div>
  );
};

export default Blog;
