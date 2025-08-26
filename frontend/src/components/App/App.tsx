import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Terminal from '../Terminal';
import './App.css';

const navLinks = [
  { href: '/', label: 'Home', color: '#ffcc00' },
  { href: '/blogs', label: 'Blogs', color: '#00bfff' },
  { href: '/projects', label: 'Projects', color: '#ff66cc' },
  { href: '/timeline', label: 'Timeline', color: '#00ff90' },
];

const socials = [
  {
    href: 'https://github.com/asterbot',
    label: 'GitHub',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#eaeaea" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"/></svg>
    ),
  },
  {
    href: 'https://linkedin.com/in/arjun-sodhi',
    label: 'LinkedIn',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#00bfff" d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
    ),
  },
  {
    href: 'https://asterbot.itch.io',
    label: 'itch.io',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#ff66cc" d="M2 4.5A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v15A2.5 2.5 0 0 1 19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-15Zm2.5-.5a.5.5 0 0 0-.5.5v2.5h17V4.5a.5.5 0 0 0-.5-.5h-16Zm16 17a.5.5 0 0 0 .5-.5V8H3v12.5a.5.5 0 0 0 .5.5h16ZM7 10h10v2.5a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 12.5V10Zm1.5 2.5c0 .55.45 1 1 1h5a1 1 0 0 0 1-1V11h-7v1.5Zm-1.5 3.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"/></svg>
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

  return (
    <div className="app">
      <div className="minecraft-background-pattern" />
      
      {/* Socials bar (desktop only) */}
      {showSocials && (
        <div className="socials-bar">
          {socials.map(s => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} className="social-link">
              {s.icon}
            </a>
          ))}
        </div>
      )}
      
      {/* Navbar */}
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
      
      {/* Main content and sticky terminal */}
      <div className="main-content-container">
        {/* Main content area */}
        <div className={`main-content-area ${!showTerminal ? 'no-terminal' : ''}`}>
          <Outlet />
        </div>
        
        {/* Sticky terminal on the right */}
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
