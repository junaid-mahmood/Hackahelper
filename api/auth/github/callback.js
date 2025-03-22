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
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello, {user.login}!</h1>
    </div>
  );
};

export default GitHubCallback;
