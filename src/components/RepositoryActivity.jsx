import { useState, useEffect } from 'react';
import { getRepositoryCommits } from '../services/github';

export default function RepositoryActivity({ repository }) {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    if (!repository || !repository.owner || !repository.name) {
      setError('Repository information is incomplete');
      setLoading(false);
      return;
    }
    
    const fetchCommits = async () => {
      try {
        setLoading(true);
        
        const commitData = await getRepositoryCommits(
          repository.owner.login,
          repository.name
        );
        
        setCommits(commitData);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        console.error('Error fetching commits:', err);
        setError('Failed to load repository activity. ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommits();
    
    const intervalId = setInterval(() => {
      fetchCommits();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [repository]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (loading && commits.length === 0) {
    return <div className="loading">Loading repository activity...</div>;
  }
  
  if (error && commits.length === 0) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="repository-activity">
      <div className="activity-header">
        <h3>Recent Commits</h3>
        <div className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
          {loading && <span className="refreshing"> (Refreshing...)</span>}
        </div>
      </div>
      
      {commits.length === 0 ? (
        <p>No commits found for this repository.</p>
      ) : (
        <ul className="commit-list">
          {commits.slice(0, 10).map((commit) => (
            <li key={commit.sha} className="commit-item">
              <div className="commit-info">
                <div className="commit-message">{commit.commit.message}</div>
                <div className="commit-author">
                  {commit.author ? (
                    <img src={commit.author.avatar_url} alt={commit.author.login} className="author-avatar" />
                  ) : (
                    <span className="author-initials">
                      {commit.commit.author.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="author-name">
                    {commit.author ? commit.author.login : commit.commit.author.name}
                  </span>
                </div>
                <div className="commit-date">{formatDate(commit.commit.author.date)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 