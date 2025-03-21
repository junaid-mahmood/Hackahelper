// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GitHubLoginButton from './GitHubLoginButton';
import GitHubCallback from "./GitHubCallback";
import './App.css';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<GitHubLoginButton />} />
          <Route path="/auth/github/callback" element={<GitHubCallback />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
