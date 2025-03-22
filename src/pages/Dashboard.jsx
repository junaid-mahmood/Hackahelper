import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import CreateRepository from '../components/CreateRepository';
import AddCollaborators from '../components/AddCollaborators';
import RepositoryActivity from '../components/RepositoryActivity';
import { getUserRepositories } from '../services/github';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [view, setView] = useState('repos');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('github_token');
    const code = sessionStorage.getItem('github_auth_code');

    if (token || code) {
      setIsAuthenticated(true);
      fetchRepositories();
    }
  }, []);

  const fetchRepositories = async () => {
    try {
      setLoadingRepos(true);
      setError(null);

      const repoData = await getUserRepositories();
      setRepositories(repoData);
      console.log('Fetched repositories:', repoData);
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError(err.message || 'Failed to load repositories. Please check your GitHub permissions.');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleRepositoryCreated = (newRepo) => {
    fetchRepositories();

    if (newRepo && newRepo.id) {
      setSelectedRepo(newRepo);
      setView('manage');
    }
  };

  const handleCollaboratorAdded = () => {};

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="dashboard error-container">
        <h1>GitHub Access Required</h1>
        <p>
          We need access to your GitHub account to use the dashboard features.
          Please log in with GitHub.
        </p>
        <button className="button" onClick={() => window.location.href = '/login'}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Your Hackathon Dashboard!</h1>
        <p className="dashboard-subtitle">
          Manage your repositories and collaborators for hackathon projects
        </p>
      </div>

      <div className="dashboard-navigation">
        <button 
          className={`nav-button ${view === 'repos' ? 'active' : ''}`}
          onClick={() => setView('repos')}
        >
          My Repositories
        </button>
        <button 
          className={`nav-button ${view === 'create' ? 'active' : ''}`}
          onClick={() => setView('create')}
        >
          Create Repository
        </button>
        {selectedRepo && (
          <button 
            className={`nav-button ${view === 'manage' ? 'active' : ''}`}
            onClick={() => setView('manage')}
          >
            Manage {selectedRepo.name}
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="dashboard-content">
        {view === 'repos' && (
          <div className="repositories-section">
            <h2>Your GitHub Repositories</h2>
            {loadingRepos ? (
              <p>Loading repositories...</p>
            ) : repositories.length === 0 ? (
              <div className="empty-state">
                <p>You don't have any repositories yet.</p>
                <button 
                  className="button"
                  onClick={() => setView('create')}
                >
                  Create Your First Repository
                </button>
              </div>
            ) : (
              <div className="repo-list">
                {repositories.map(repo => (
                  <div key={repo.id} className="repo-card">
                    <h3>{repo.name}</h3>
                    <p>{repo.description || 'No description provided'}</p>
                    <div className="repo-meta">
                      <span className="repo-visibility">
                        {repo.private ? 'Private' : 'Public'}
                      </span>
                      <span className="repo-language">
                        {repo.language || 'No language detected'}
                      </span>
                    </div>
                    <button 
                      className="button"
                      onClick={() => {
                        setSelectedRepo(repo);
                        setView('manage');
                      }}
                    >
                      Manage Repository
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'create' && (
          <CreateRepository 
            onRepositoryCreated={handleRepositoryCreated}
          />
        )}

        {view === 'manage' && selectedRepo && (
          <div className="manage-repository">
            <div className="repo-header">
              <h2>{selectedRepo.name}</h2>
              <a 
                href={selectedRepo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="view-on-github"
              >
                View on GitHub
              </a>
            </div>

            <div className="repo-details">
              <p>{selectedRepo.description || 'No description provided'}</p>
              <div className="repo-meta">
                <span>
                  {selectedRepo.private ? 'Private' : 'Public'} repository
                </span>
                {selectedRepo.language && (
                  <span>Main language: {selectedRepo.language}</span>
                )}
              </div>
            </div>

            <div className="repo-management-grid">
              <div className="grid-item">
                <AddCollaborators 
                  repository={selectedRepo}
                  onCollaboratorAdded={handleCollaboratorAdded}
                />
              </div>

              <div className="grid-item">
                <RepositoryActivity 
                  repository={selectedRepo}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
