const GITHUB_API_URL = 'https://api.github.com';

const getAuthHeader = () => {
  const storedToken = localStorage.getItem('github_token');
  
  if (storedToken) {
    return `Bearer ${storedToken}`;
  }
  
  const authCode = sessionStorage.getItem('github_auth_code');
  if (authCode) {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_GITHUB_CLIENT_SECRET;
    const credentials = btoa(`${clientId}:${clientSecret}`);
    
    return `Basic ${credentials}`;
  }
  
  throw new Error('No GitHub authentication available. Please log in again.');
};

export const createRepository = async (repoData) => {
  try {
    const response = await fetch(`${GITHUB_API_URL}/user/repos`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        name: repoData.name,
        description: repoData.description,
        private: repoData.private,
        auto_init: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create repository');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating repository:', error);
    throw error;
  }
};

export const addCollaborator = async (owner, repo, username, permission = 'push') => {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/collaborators/${username}`, {
      method: 'PUT',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({ permission })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add collaborator');
    }

    return true;
  } catch (error) {
    console.error('Error adding collaborator:', error);
    throw error;
  }
};

export const getRepository = async (owner, repo) => {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': getAuthHeader(),
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get repository');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting repository:', error);
    throw error;
  }
};

export const getRepositoryCommits = async (owner, repo) => {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/commits`, {
      headers: {
        'Authorization': getAuthHeader(),
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get commits');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting commits:', error);
    throw error;
  }
};

export const createWebhook = async (owner, repo, webhookUrl) => {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/hooks`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: ['push', 'pull_request', 'issues'],
        config: {
          url: webhookUrl,
          content_type: 'json',
          insecure_ssl: '0'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create webhook');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating webhook:', error);
    throw error;
  }
};

export const getUserRepositories = async () => {
  try {
    console.log('Fetching repositories with GitHub auth...');
    
    const response = await fetch(`${GITHUB_API_URL}/user/repos?sort=updated`, {
      headers: {
        'Authorization': getAuthHeader(),
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get repositories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting repositories:', error);
    throw error;
  }
}; 