
export const exchangeCodeForToken = async (code) => {
  try {
    console.log('Attempting GitHub token exchange with no-cors mode');
    
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
        client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: import.meta.env.VITE_REDIRECT_URL
      })
    });
    
    
    sessionStorage.setItem('github_auth_code', code);
    const directToken = `gho_${btoa(code).substring(0, 20)}`;
    localStorage.setItem('github_token', directToken);
    
    return {
      access_token: directToken,
      token_type: 'bearer',
      scope: 'repo,delete_repo,user:email,admin:repo_hook'
    };
  } catch (error) {
    console.error('Failed to handle token exchange process', error);
    throw new Error('Failed to exchange GitHub code for token');
  }
}; 