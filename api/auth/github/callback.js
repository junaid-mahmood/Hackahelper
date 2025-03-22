import axios from 'axios'

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response.status(204).end()
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const code = request.query.code

    if (!code) {
      return response.redirect('/?error=no_code')
    }

    // Check for environment variables with and without VITE_ prefix
    const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID
    const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.VITE_GITHUB_CLIENT_SECRET
    let redirectUri = process.env.REDIRECT_URL || process.env.VITE_REDIRECT_URL
    
    // Make sure the redirectUri is properly formatted
    if (redirectUri) {
      // Ensure the redirect URI starts with http:// or https://
      if (!redirectUri.startsWith('http://') && !redirectUri.startsWith('https://')) {
        redirectUri = `https://${redirectUri}`;
      }
      
      // Remove any trailing slashes
      redirectUri = redirectUri.replace(/\/+$/, '');
    }
    
    console.log('Environment variables check:', {
      hasGithubClientId: !!process.env.GITHUB_CLIENT_ID,
      hasViteGithubClientId: !!process.env.VITE_GITHUB_CLIENT_ID,
      hasGithubClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      hasViteGithubClientSecret: !!process.env.VITE_GITHUB_CLIENT_SECRET,
      redirectUrlValue: redirectUri || 'not-set'
    })
    
    if (!clientId || !clientSecret) {
      console.error('Missing GitHub credentials in environment variables')
      return response.redirect('/?error=config_error')
    }

    // Log the parameters we're sending to GitHub
    console.log('GitHub token exchange parameters:', {
      client_id: clientId,
      code_length: code.length,
      redirect_uri: redirectUri
    })

    try {
      // Build the query string manually
      const body = new URLSearchParams();
      body.append('client_id', clientId);
      body.append('client_secret', clientSecret);
      body.append('code', code);
      
      if (redirectUri) {
        body.append('redirect_uri', redirectUri);
      }
      
      console.log('Attempting GitHub token exchange with params:', body.toString());
      
      // Using native fetch instead of axios
      const fetchResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
      });
      
      console.log('GitHub token response status:', fetchResponse.status);
      
      const data = await fetchResponse.json().catch(e => {
        console.error('Error parsing JSON response:', e);
        return {};
      });
      
      console.log('GitHub token response data:', JSON.stringify(data));
      
      if (fetchResponse.status !== 200) {
        console.error(`GitHub returned non-200 status: ${fetchResponse.status}`);
        return response.redirect(`/?error=github_error&message=GitHub API returned status ${fetchResponse.status}`);
      }
      
      if (data.error) {
        console.error('GitHub token error:', data);
        return response.redirect(`/?error=github_error&message=${data.error_description || data.error}`);
      }
      
      const access_token = data.access_token;
      
      if (access_token) {
        // Get the base URL
        const host = request.headers.host || '';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;
        
        console.log('Redirecting with token to setup page, baseUrl:', baseUrl);
        
        // Redirect to the setup page with the token
        return response.redirect(`${baseUrl}/setup?token=${access_token}`);
      } else {
        console.error('No access token in GitHub response:', data);
        return response.redirect('/?error=no_token');
      }
    } catch (tokenError) {
      console.error('Token exchange error:', tokenError.message);
      console.error('Token exchange error stack:', tokenError.stack);
      return response.redirect(`/?error=token_error&message=${encodeURIComponent(tokenError.message)}`);
    }
  } catch (error) {
    console.error('Error in GitHub OAuth callback:', error);
    console.error('Error stack:', error.stack);
    const errorMessage = error.message || 'Unknown error';
    return response.redirect(`/?error=auth_failed&message=${encodeURIComponent(errorMessage)}`);
  }
} 