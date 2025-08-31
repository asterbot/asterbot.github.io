import React from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage-hero">
      {/* <img src={require('./img/pfp.png')} alt="Profile" className="profile-image" /> */}

      <div className="hero-content">
        <h1 className="typing-animation">
          A <span className="accent">Developer</span> at heart
        </h1>
      </div>


      <div className="intro-box">
        <div className="intro-text">
          <span className="question">Who am I?</span> "Huge nerd" doesn't even scratch the surface.
          <br /><br />
          I love making things with code, whether it's games, apps, system-level projects or anything in between, I'm always trying new things with software!<br />
          Check out <a href="/projects"><span className="link"> my projects  &raquo;</span></a>
          <br /><br />
          You can also check out my socials on the left and feel free to reach out :D
          <br /><br />
          <span className="motto"><i>Coding my chaos, one commit at a time!</i></span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
