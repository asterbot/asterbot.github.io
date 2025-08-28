import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Terminal from '../Terminal';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub,  faItchIo ,faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons'


const navLinks = [
  { href: '/', label: 'Home', color: '#ffcc00' },
  { href: '/projects', label: 'Projects', color: '#a05cff' },
  { href: '/blogs', label: 'Blogs', color: '#00bfff' },
  { href: '/timeline', label: 'Timeline', color: '#00ff90' },
];

const socials = [
  {
    href: 'https://github.com/asterbot',
    label: 'GitHub',
    icon: (
      <FontAwesomeIcon className="icons" icon={faGithub} size="2x" style={{ color: 'white' }} />
    ),
  },
  {
    href: 'https://linkedin.com/in/arjun-sodhi',
    label: 'LinkedIn',
    icon: (
      <FontAwesomeIcon className="icons" icon={faLinkedin} size="2x" style={{ color: 'white' }} />
    ),
  },
  {
    href: 'https://asterbot.itch.io',
    label: 'itch.io',
    icon: (
      <FontAwesomeIcon className="icons" icon={faItchIo} size="2x" style={{ color: 'white' }} />
    ),
  },
  {
    href: 'https://discordapp.com/users/377810036669415425',
    label: 'discord',
    icon: (
      <FontAwesomeIcon className="icons" icon={faDiscord} size="2x" style={{ color: 'white' }} />
    ),
  },
];

const TERMINAL_MIN_SCREEN = 900;

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSocials, setShowSocials] = useState(true);
  const [showTerminal, setShowTerminal] = useState(window.innerWidth >= TERMINAL_MIN_SCREEN);

  useEffect(() => {
    const handleResize = () => {
      setShowSocials(window.innerWidth >= 700);
      setShowTerminal(window.innerWidth >= TERMINAL_MIN_SCREEN);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNavButtonStyle = (link: typeof navLinks[0]) => {
    return {
      '--active-color': link.color,
      '--active-color-dd': link.color + 'dd',
    } as React.CSSProperties;
  };

  if (location.pathname.endsWith("/") && location.pathname.length >= 2) location.pathname = location.pathname.slice(0,-1);
  // sometimes URL added "/" at end... idk why

  return (
    <div className="app">
      <div className="minecraft-background-pattern" />
      
      {showSocials && (
        <div className="socials-bar">
          {socials.map(s => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} className="social-link">
              {s.icon}
            </a>
          ))}
        </div>
      )}
      
      <nav className="app-navbar">
        {navLinks.map(link => (
          <button
            key={link.href}
            onClick={() => navigate(link.href)}
            className={`nav-button ${location.pathname === link.href ? 'active' : ''}`}
            style={getNavButtonStyle(link)}
          >
            {link.label}
          </button>
        ))}
      </nav>
      
      <div className="main-content-container">
        <div className={`main-content-area ${!showTerminal ? 'no-terminal' : ''}`}>
          <Outlet />
        </div>
        
        {showTerminal && (
          <div className="terminal-container">
            <Terminal onNavigate={navigate} currentLocation={location.pathname} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
