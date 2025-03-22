import { useState } from 'react';
import { addCollaborator } from '../services/github';

export default function AddCollaborators({ repository, onCollaboratorAdded }) {
  const [username, setUsername] = useState('');
  const [permission, setPermission] = useState('push');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username) {
      setError('Username is required');
      return;
    }
    
    if (!repository || !repository.owner || !repository.name) {
      setError('Repository information is incomplete');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await addCollaborator(
        repository.owner.login,
        repository.name,
        username,
        permission
      );
      
      console.log('Collaborator added successfully:', {
        repo: repository.name,
        username,
        permission
      });
      
      setSuccessMessage(`Successfully invited ${username} as a collaborator`);
      setUsername('');
      
      if (onCollaboratorAdded) {
        onCollaboratorAdded(username, permission);
      }
    } catch (err) {
      console.error('Error adding collaborator:', err);
      setError(err.message || 'Failed to add collaborator. Please check the username and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-collaborators-container">
      <h3>Add Collaborators</h3>
      
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
      
      <form onSubmit={handleSubmit} className="add-collaborator-form">
        <div className="form-group">
          <label htmlFor="username">GitHub Username*</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            placeholder="Enter GitHub username"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="permission">Permission Level</label>
          <select
            id="permission"
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            disabled={isLoading}
          >
            <option value="pull">Read (Pull only)</option>
            <option value="push">Write (Push & Pull)</option>
            <option value="admin">Admin (Full access)</option>
            <option value="maintain">Maintain (Push, Pull & some admin)</option>
            <option value="triage">Triage (Read & Issues management)</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="add-collaborator-button"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Collaborator'}
        </button>
      </form>
    </div>
  );
} 