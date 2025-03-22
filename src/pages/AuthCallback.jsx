import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { exchangeCodeForToken } from '../services/proxy';

export default function AuthCallback() {
  const [authComplete, setAuthComplete] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code received from GitHub');
        }
        
        console.log('Received GitHub code:', code);
        
        try {
          const tokenData = await exchangeCodeForToken(code);
          
          if (tokenData.error) {
            throw new Error(tokenData.error_description || 'Failed to exchange code for token');
          }
          
          if (tokenData.access_token) {
            localStorage.setItem('github_token', tokenData.access_token);
            console.log('GitHub token stored successfully');
            
            if (tokenData.token_type) {
              localStorage.setItem('github_token_type', tokenData.token_type);
            }
            
            if (tokenData.scope) {
              localStorage.setItem('github_token_scope', tokenData.scope);
            }
          } else {
            console.log('No access token received, using auth code directly');
          }
        } catch (tokenError) {
          console.error('Token exchange error:', tokenError);
        }
        
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('Supabase session error:', sessionError);
        }
        
        if (data && data.session) {
          console.log('Supabase session found');
        } else {
          console.log('No Supabase session found');
        }
        
        setAuthComplete(true);
      } catch (err) {
        console.error('Error during auth callback:', err);
        setError(err.message);
      }
    };

    if (location.search.includes('code=')) {
      handleAuthCallback();
    }
  }, [location]);

  if (error) {
    return (
      <div className="auth-callback">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <p className="debug-info">URL parameters: {location.search}</p>
        <a href="/login" className="button">Return to login</a>
      </div>
    );
  }

  if (authComplete) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="auth-callback">
      <h2>Completing Authentication...</h2>
      <p>Please wait while we finish setting up your account.</p>
    </div>
  );
} 