import { useState } from 'react';
import { createRepository } from '../services/github';

export default function CreateRepository({ onRepositoryCreated }) {
  const [repoName, setRepoName] = useState('');
  const [repoDescription, setRepoDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!repoName) {
      setError('Repository name is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const repoData = {
        name: repoName,
        description: repoDescription,
        private: isPrivate
      };
      
      const newRepo = await createRepository(repoData);
      console.log('Repository created successfully:', newRepo);
      
      setSuccessMessage(`Repository "${newRepo.name}" created successfully!`);
      
      setRepoName('');
      setRepoDescription('');
      setIsPrivate(false);
      
      if (onRepositoryCreated) {
        onRepositoryCreated(newRepo);
      }
    } catch (err) {
      console.error('Error creating repository:', err);
      setError(err.message || 'Failed to create repository. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-repo-container">
      <h2>Create New Repository</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="create-repo-form">
        <div className="form-group">
          <label htmlFor="repo-name">Repository Name*</label>
          <input
            id="repo-name"
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., my-hackathon-project"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="repo-description">Description</label>
          <textarea
            id="repo-description"
            value={repoDescription}
            onChange={(e) => setRepoDescription(e.target.value)}
            disabled={isLoading}
            placeholder="A short description of your repository"
            rows={3}
          />
        </div>
        
        <div className="form-group checkbox-group">
          <input
            id="repo-private"
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            disabled={isLoading}
          />
          <label htmlFor="repo-private">Private Repository</label>
        </div>
        
        <button
          type="submit"
          className="create-repo-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Repository'}
        </button>
      </form>
    </div>
  );
} 