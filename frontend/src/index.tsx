import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Blog from './Blog';
import Projects from './Projects';
import Timeline from './Timeline';

const HomePage: React.FC = () => {
  const profileImg = 'https://placehold.co/120x120?text=CS+Kid';
  return (
    <div style={{ background: '#181a20', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.18)', padding: '3rem 2.5rem', maxWidth: 480, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem auto' }}>
      <img src={profileImg} alt="Profile" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 24, border: '4px solid #ffcc00', background: '#fff' }} />
      <h1 style={{ color: '#ffcc00', fontWeight: 800, fontSize: '2.3rem', marginBottom: 12, letterSpacing: 1 }}>Hi, I'm a CS student at UWaterloo</h1>
      <p style={{ color: '#eaeaea', fontSize: '1.15rem', marginBottom: 32, textAlign: 'center', maxWidth: 400 }}>
        Welcome to my interactive portfolio! Explore my journey, projects, and blog, or try the terminal below.
      </p>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<Blog />} />
          <Route path="projects" element={<Projects />} />
          <Route path="timeline" element={<Timeline />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
