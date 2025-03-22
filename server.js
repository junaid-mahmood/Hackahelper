import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { Octokit } from '@octokit/rest';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  
  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  
  // Handle GitHub callback
  app.get('/api/auth/github/callback', async (req, res) => {
    try {
      const code = req.query.code;
      
      if (!code) {
        return res.redirect('/?error=no_code');
      }
      
      const clientId = process.env.VITE_GITHUB_CLIENT_ID;
      const clientSecret = process.env.VITE_GITHUB_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        console.error('Missing GitHub credentials in environment variables');
        return res.redirect('/?error=config_error');
      }
      
      // Exchange the code for an access token
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      
      const { access_token } = tokenResponse.data;
      
      if (access_token) {
        // Redirect to the setup page with the token
        return res.redirect(`/setup?token=${access_token}`);
      }
      
      return res.redirect('/?error=auth_failed');
    } catch (error) {
      console.error('Error in GitHub OAuth callback:', error);
      return res.redirect('/?error=auth_failed');
    }
  });
  
  // Handle create repository request
  app.post('/api/github/create-repo', express.json(), async (req, res) => {
    try {
      const { name, description } = req.body;
      const token = req.headers.authorization?.split('Bearer ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No authorization token provided' });
      }
      
      const octokit = new Octokit({ auth: token });
      
      const githubResponse = await octokit.repos.createForAuthenticatedUser({
        name,
        description,
        private: true,
        auto_init: true,
      });
      
      return res.status(200).json(githubResponse.data);
    } catch (error) {
      console.error('Error creating repository:', error);
      return res.status(500).json({ error: 'Failed to create repository' });
    }
  });
  
  // Handle invite collaborator request
  app.post('/api/github/invite-collaborator', express.json(), async (req, res) => {
    try {
      const { repo, email } = req.body;
      const token = req.headers.authorization?.split('Bearer ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No authorization token provided' });
      }
      
      const octokit = new Octokit({ auth: token });
      
      // First, get the authenticated user's information
      const { data: user } = await octokit.users.getAuthenticated();
      
      // Add the collaborator
      const githubResponse = await octokit.repos.addCollaborator({
        owner: user.login,
        repo,
        username: email, // GitHub will handle email-to-username resolution
        permission: 'push'
      });
      
      return res.status(200).json(githubResponse.data);
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      return res.status(500).json({ error: 'Failed to invite collaborator' });
    }
  });
  
  // Catch all other requests and serve the index.html
  app.use('*', async (req, res) => {
    // Serve the index.html
    res.sendFile(resolve(__dirname, 'index.html'));
  });
  
  app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
  });
}

createServer(); 