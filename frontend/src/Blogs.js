import React from 'react';
import Blog from './Blogs/blog_test';

// Reusable CommitLink Component
const CommitLink = ({ message, url }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <a 
      href={url} 
      onClick={handleClick} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        color: 'white', 
        textDecoration: isHovered ? 'underline' : 'none', 
        cursor: 'pointer' 
      }}
    >
      {message}
    </a>
  );
};

// Commit Component with more flexibility
const Commit = ({ 
    x, 
    y, 
    message, 
    url, 
    color = "gray", 
    textOffset = { x: 20, y: 5 }
  }) => {
  return (
    <>
      <circle 
        cx={x} 
        cy={y} 
        r="10" 
        fill={color} 
      />
      <text 
        x={x + textOffset.x} 
        y={y + textOffset.y} 
        style={{ fontSize: '0.875rem', fill: 'white' }}
      >
        <CommitLink message={message} url={url} />
      </text>
    </>
  );
};

// Branch Line Component
const BranchLine = ({ 
  startX, 
  startY, 
  endX, 
  endY, 
  color = "gray", 
  strokeWidth = 2 
  }) => (
  <line 
    x1={startX} 
    y1={startY} 
    x2={endX} 
    y2={endY} 
    stroke={color} 
    strokeWidth={strokeWidth} 
  />
);

const GitGraphVisualization = () => {
  return (
    <div>
      <div className="git-graph-container">
        <svg 
          viewBox="0 0 400 300" 
          className="git-graph-svg"
        >
          {/* Main branch vertical line */}
          <BranchLine startX={200} startY={50} endX={200} endY={250} />
          
          {/* Commits */}
          <Commit 
            x={200} 
            y={250} 
            message="Initial commit" 
            url="/initial" 
          />

          <Commit 
            x={200} 
            y={120} 
            message="Lol" 
            url="/master-update" 
            color="blue" 
          />

          {/* Feature branches */}
          <BranchLine 
            startX={200} 
            startY={120} 
            endX={250} 
            endY={80} 
            color="blue" 
          />
          <Commit 
            x={250} 
            y={80} 
            message="Hi" 
            url="/feature1" 
            color="blue"
          />

          <BranchLine 
            startX={200} 
            startY={120} 
            endX={150} 
            endY={80} 
            color="turquoise" 
          />
          <Commit 
            x={150} 
            y={80} 
            message="Bye" 
            url="/feature2" 
            color="turquoise"
          />

          <BranchLine 
            startX={200} 
            startY={120} 
            endX={250} 
            endY={80} 
            color="blue" 
          />
          <Commit 
            x={250} 
            y={80} 
            message="Hi" 
            url="/feature1" 
            color="blue"
          />

        </svg>
      </div>
      <Blog />
    </div>

  );
};

export default GitGraphVisualization;