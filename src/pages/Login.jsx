import { useState } from 'react';
import { signInWithGitHub } from '../supabase';

export default function Login() {
  const [error, setError] = useState(null);

  const handleGitHubLogin = async () => {
    try {
      const client_id = import.meta.env.VITE_GITHUB_CLIENT_ID;
      const redirect_uri = import.meta.env.VITE_REDIRECT_URL;
      
      const scopes = [
        'repo',             
        'admin:repo_hook',  
        'user:email',       
        'delete_repo'       
      ].join('%20');
      
      const githubURL = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${scopes}`;
      
      // Redirect to GitHub
      window.location.href = githubURL;
    } catch (err) {
      console.error('Exception during login:', err);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome to Hackathon Hub</h1>
      <p>Connect your GitHub account to get started</p>
      
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <p>Please make sure GitHub provider is enabled in your Supabase project.</p>
        </div>
      )}
      
      <button className="github-button" onClick={handleGitHubLogin}>
        Connect with GitHub
      </button>
    </div>
  );
} 