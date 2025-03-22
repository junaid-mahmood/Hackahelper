// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GitHubLoginButton from './GitHubLoginButton';
import GitHubCallback from "./GitHubCallback";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GitHubLoginButton />} />
        <Route path="/auth/github/callback" element={<GitHubCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
