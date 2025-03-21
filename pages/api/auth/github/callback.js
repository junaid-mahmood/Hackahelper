import axios from 'axios';

export default async function handler(req, res) {
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    console.log('Received code:', code);
    console.log('Environment check:', {
      clientId: process.env.VITE_GITHUB_CLIENT_ID ? 'Set' : 'Not set',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not set'
    });

    // Exchange the code for an access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    console.log('Token response:', tokenResponse.data);

    const { access_token, error_description } = tokenResponse.data;

    if (!access_token) {
      console.error('Failed to get access token:', tokenResponse.data);
      return res.status(400).json({ 
        error: 'Failed to get access token',
        details: error_description || tokenResponse.data
      });
    }

    // Get the user data using the access token
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    });

    // Store the access token securely (you might want to use a session or secure cookie)
    // For now, we'll send it back to the client
    return res.status(200).json({ 
      user: userResponse.data,
      access_token // You might want to remove this in production
    });
  } catch (error) {
    console.error('Error in GitHub callback:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to authenticate with GitHub',
      details: error.response?.data || error.message 
    });
  }
} 