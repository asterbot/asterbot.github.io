import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pets from '../Pets';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="section-rule"><span className="section-path">~</span></div>

      <h1 className="hero-title">
        A <span className="accent">Developer</span> at heart<span className="cursor" />
      </h1>

      <div className="intro-box">
        <div><span className="question">Who am I?</span> A "huge nerd" doesn't even scratch the surface.</div>
        <div className="gap" />
        <div>I love making things with code, whether it's games, apps, system-level projects or anything in between, I'm always trying new things with software!</div>
        {/* <div>Check out <button type="button" className="link-button underline-link" onClick={() => navigate('/projects')}>my projects &raquo;</button></div> */}
        <div className="gap" />
        {/* <div>You can also check out my socials on the left and feel free to reach out :D</div>
        <div className="gap" /> */}
        <div className="motto">Coding my chaos!</div>
      </div>

      <Pets />
    </div>
  );
};

export default HomePage;
