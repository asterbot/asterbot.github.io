import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App, Blog, Projects, Timeline, HomePage } from './components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
