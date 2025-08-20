import React from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  const profileImg = 'https://placehold.co/120x120?text=CS+Kid';
  
  return (
    <div className="homepage-container">
      <img src={profileImg} alt="Profile" className="profile-image" />
      <h1 className="homepage-title">Hi, I'm a CS student at UWaterloo</h1>
      <p className="homepage-description">
        Welcome to my interactive portfolio! Explore my journey, projects, and blog, or try the terminal below.
      </p>
    </div>
  );
};

export default HomePage;
