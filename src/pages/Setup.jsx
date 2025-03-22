import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

function Setup() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [teamEmail, setTeamEmail] = useState('');

  return (
    <div className="setup-page">
      <div className="grid-background"></div>
      <div className="glow-animation"></div>
      <div className="glow-animation"></div>
      <div className="glow-animation"></div>
      
      <div className="container">
        <div className="setup-container">
          {/* Project Creation Card */}
          <div className="setup-card">
            <h2 className="setup-heading">Create Your Hackathon Project</h2>
            
            <div className="form-group">
              <label htmlFor="projectName">Project Name</label>
              <input 
                type="text" 
                id="projectName" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="setup-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="projectDescription">Project Description</label>
              <textarea 
                id="projectDescription" 
                value={projectDescription} 
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your project"
                className="setup-textarea"
                rows={5}
              />
            </div>
            
            <div className="setup-actions">
              <button className="setup-btn github-btn">
                <FaGithub size={20} />
                Create GitHub Repository
              </button>
              
              <button className="setup-btn secondary-btn">
                Import Existing Repository
              </button>
            </div>
          </div>
          
          {/* Team Invitation Card */}
          <div className="setup-card">
            <h2 className="setup-heading">Invite Team Members</h2>
            
            <div className="team-invite">
              <input 
                type="email" 
                placeholder="Enter email address" 
                value={teamEmail}
                onChange={(e) => setTeamEmail(e.target.value)}
                className="setup-input"
              />
              <button className="invite-btn">Send Invite</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setup; 