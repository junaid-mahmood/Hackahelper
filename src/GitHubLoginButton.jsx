// src/GitHubLoginButton.jsx
import React from 'react';

const GitHubLoginButton = () => {
  // Access environment variables provided by Vite
  const clientID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI; // Should be https://hackahelper-woad.vercel.app/auth/github/callback

  const handleLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div>
      <h1>Log in with GitHub</h1>
      <button onClick={handleLogin}>Log in with GitHub</button>
    </div>
  );
};

export default GitHubLoginButton;
