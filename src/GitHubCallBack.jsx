// src/GitHubCallback.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const GitHubCallback = () => {
  const location = useLocation();
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');

    if (code) {
      // Call your Vercel serverless function (API route)
      axios
        .post('/api/auth/github/callback', { code })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((err) => {
          setError('Error authenticating with GitHub');
          console.error(err);
        });
    } else {
      setError('No code found in query parameters.');
    }
  }, [location]);

  if (error) {
    return (
      <div className="hero-content">
        <h1 className="app-title">Authentication Error</h1>
        <p className="hero-subtitle">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hero-content">
        <h1 className="app-title">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="hero-content">
      <h1 className="app-title">Welcome!</h1>
      <p className="hero-subtitle">Hello, {user.login}!</p>
    </div>
  );
};

export default GitHubCallback;
