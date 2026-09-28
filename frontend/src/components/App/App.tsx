import React, { useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Terminal from '../Terminal';
import { accentFor, pathLabel } from '../Terminal/data/directoryData/utils';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faItchIo, faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons';

const navLinks = [
  { href: '/', label: '~' },
  { href: '/projects', label: '~/projects/' },
  { href: '/blogs', label: '~/blogs/' },
  { href: '/timeline', label: '~/timeline/' },
];

const socials = [
  { href: 'https://github.com/asterbot', label: 'GitHub', icon: faGithub },
  { href: 'https://linkedin.com/in/arjun-sodhi', label: 'LinkedIn', icon: faLinkedin },
  { href: 'https://asterbot.itch.io', label: 'itch.io', icon: faItchIo },
  { href: 'https://discordapp.com/users/377810036669415425', label: 'Discord', icon: faDiscord },
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const focusTerminal = useRef<() => void>(() => {});

  const pathname = location.pathname.length > 1 && location.pathname.endsWith('/')
    ? location.pathname.slice(0, -1)
    : location.pathname;

  // Clicking anywhere on the page (that isn't a link/image/input) focuses the terminal input
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest && target.closest('a,img,button,input,textarea')) return;
    if (window.getSelection && String(window.getSelection())) return;
    focusTerminal.current();
  };

  return (
    <div className="app" onClick={handleClick}>
      <aside className="social-rail">
        <div className="social-rail-home">~</div>
        {socials.map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}>
            <FontAwesomeIcon icon={s.icon} className="social-icon" />
          </a>
        ))}
      </aside>

      <div className="main-column">
        <header className="prompt-bar">
          <span className="prompt-user">arjun@asterbot</span>
          <span className="prompt-colon">:</span>
          <span className="prompt-cwd" style={{ color: accentFor(pathname) }}>{pathLabel(pathname)}</span>
          <span className="prompt-spacer" />
          {navLinks.map((item) => (
            <button key={item.href} type="button" className="link-button nav-link" onClick={() => navigate(item.href)}>
              {item.label}
            </button>
          ))}
        </header>

        {/* The terminal sits beside the page content on every page */}
        <div className="split">
          <main className="page-content">
            <Outlet />
          </main>

          <Terminal onNavigate={navigate} currentLocation={pathname} focusRef={focusTerminal} />
        </div>
      </div>
    </div>
  );
};

export default App;
