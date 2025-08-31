import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Terminal from '../Terminal';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub,  faItchIo ,faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons'


const navLinks = [
  { href: '/', label: 'Home'},
  { href: '/projects', label: 'Projects'},
  { href: '/blogs', label: 'Blogs'},
  { href: '/timeline', label: 'Timeline'},
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
const SOCIALS_MIN_SCREEN = 1200

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSocials, setShowSocials] = useState(window.innerWidth >= SOCIALS_MIN_SCREEN);
  const [showTerminal, setShowTerminal] = useState(window.innerWidth >= TERMINAL_MIN_SCREEN);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const wideEnough = window.innerWidth >= SOCIALS_MIN_SCREEN;
      setShowSocials(wideEnough);
      setShowTerminal(window.innerWidth >= TERMINAL_MIN_SCREEN);

      if (wideEnough) {
        setSocialsOpen(!(window.innerWidth >= SOCIALS_MIN_SCREEN));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (location.pathname.endsWith("/") && location.pathname.length >= 2) {
    location.pathname = location.pathname.slice(0, -1);
  }

  return (
    <div className="app">
      <div className="background-pattern" />

      {showSocials ? (
        <div className="socials-bar">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              className="social-link"
            >
              {s.icon}
            </a>
          ))}
        </div>
      ) : (
        <div className="socials-toggle" onClick={() => setSocialsOpen(!socialsOpen)}>
          {/* Sleeping Hamburger! */}
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {socialsOpen && (
        <div className="socials-bar expanded">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              className="social-link"
            >
              {s.icon}
            </a>
          ))}
        </div>
      )}

      <nav className="app-navbar">
        <div className="navbar-left" onClick={()=>navigate('/')}>Arjun</div>
        <div className={`navbar-right ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                navigate(item.href);
                setIsMenuOpen(false);
              }}
              className="nav-link"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
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