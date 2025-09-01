import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App, Blog, Blogs, Projects, Timeline, HomePage } from './components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const params = new URLSearchParams(window.location.search);
const originalPath = params.get("path") || "/";
window.history.replaceState(null, "", originalPath);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="blogs/:id" element = {<Blog />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="projects" element={<Projects />} />
          <Route path="timeline" element={<Timeline />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
