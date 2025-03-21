// src/GitHubLoginButton.jsx
import React from 'react';
import { FaGithub } from 'react-icons/fa';

const GitHubLoginButton = () => {
  // Access environment variables provided by Vite
  const clientID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  // Use the exact redirect URI that's registered in GitHub OAuth App settings
  const redirectUri = 'https://hackahelper-woad.vercel.app/auth/github/callback';

  // Debug environment variables
  console.log('Environment Variables:', {
    clientID,
    redirectUri,
    allEnvVars: import.meta.env
  });

  const handleLogin = () => {
    if (!clientID) {
      console.error('GitHub Client ID is not set!');
      alert('GitHub Client ID is not configured. Please check the application settings.');
      return;
    }

    // Add repo and user scopes for repository read/write access
    const scopes = ['repo', 'user'].join(' ');
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    console.log('Redirecting to:', githubAuthUrl);
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="hero-content">
      <div className="grid-background">
        <div className="glow-animation"></div>
        <div className="glow-animation"></div>
        <div className="glow-animation"></div>
      </div>
      <h1 className="app-title">HackaHelper</h1>
      <p className="hero-subtitle">
        Streamline your hackathon workflow with GitHub integration
      </p>
      <button onClick={handleLogin} className="github-btn large-btn">
        <FaGithub /> Log in with GitHub
      </button>
    </div>
  );
};

export default GitHubLoginButton;
