import { useState, useEffect } from 'react';
import { FaGithub, FaCodeBranch, FaFireAlt, FaTasks, FaHistory, FaLaptopCode, FaEdit, FaCalendarAlt, FaChartLine, FaUsers } from 'react-icons/fa';

function Dashboard() {
  // Sample data - would be replaced with actual GitHub API integration
  const projectData = {
    name: "Hackahelper",
    repo: "username/hackahelper",
    branch: "main",
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    completionPercentage: 68,
    commitHistory: [12, 8, 15, 22, 18, 30, 25]
  };

  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Frontend Lead",
      currentTask: "Implement Dashboard UI",
      commits: 48,
    },
    {
      id: 2,
      name: "Sam Chen",
      avatar: "https://i.pravatar.cc/150?img=2",
      role: "Backend Developer",
      currentTask: "API Integration",
      commits: 35,
    },
    {
      id: 3,
      name: "Taylor Ross",
      avatar: "https://i.pravatar.cc/150?img=3",
      role: "DevOps Engineer",
      currentTask: "Setup Deployment Pipeline",
      commits: 27,
    },
    {
      id: 4,
      name: "Jamie Lee",
      avatar: "https://i.pravatar.cc/150?img=4",
      role: "AI Specialist",
      currentTask: "Implement AI Features",
      commits: 19,
    }
  ];

  const tasks = [
    { id: 1, title: "Setup project structure", status: "Completed", priority: "Medium", assignee: 1 },
    { id: 2, title: "Create UI components", status: "In Progress", priority: "High", assignee: 1 },
    { id: 3, title: "Design database schema", status: "Completed", priority: "High", assignee: 2 },
    { id: 4, title: "Implement authentication", status: "In Progress", priority: "Critical", assignee: 2 },
    { id: 5, title: "Setup CI/CD pipeline", status: "In Progress", priority: "Medium", assignee: 3 },
    { id: 6, title: "Configure Docker containers", status: "To Do", priority: "Low", assignee: 3 },
    { id: 7, title: "Train AI model", status: "To Do", priority: "Medium", assignee: 4 },
    { id: 8, title: "Write documentation", status: "Review", priority: "Low", assignee: 4 }
  ];

  const commits = [
    { id: 1, user: 1, message: "Add responsive dashboard layout", time: "2 minutes ago", sha: "8a4d3f2" },
    { id: 2, user: 2, message: "Implement user authentication", time: "25 minutes ago", sha: "c5e78a1" },
    { id: 3, user: 3, message: "Update Docker configuration", time: "3 hours ago", sha: "9b2d7e4" },
    { id: 4, user: 1, message: "Fix responsive layout on mobile", time: "5 hours ago", sha: "6f1a2b3" },
    { id: 5, user: 4, message: "Initial model training setup", time: "yesterday", sha: "3c8d9e6" }
  ];

  // States
  const [timeRemaining, setTimeRemaining] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [deadline, setDeadline] = useState(projectData.deadline);
  const [liveCommit, setLiveCommit] = useState(null);

  // Initialize deadline date and time
  useEffect(() => {
    setDeadlineDate(deadline.toISOString().split('T')[0]);
    setDeadlineTime(
      `${deadline.getHours().toString().padStart(2, '0')}:${deadline.getMinutes().toString().padStart(2, '0')}`
    );
  }, [deadline]);

  // Calculate time remaining until deadline
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = deadline - now;
      
      const days = Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const minutes = Math.max(0, Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
      const seconds = Math.max(0, Math.floor((difference % (1000 * 60)) / 1000));
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(timer);
  }, [deadline]);

  // Update deadline when user edits it
  const updateDeadline = () => {
    const newDeadline = new Date(`${deadlineDate}T${deadlineTime}`);
    setDeadline(newDeadline);
    setIsEditingDeadline(false);
  };

  // Simulate live commit updates
  useEffect(() => {
    const simulateNewCommit = () => {
      const users = [1, 2, 3, 4];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const commitMessages = [
        "Update UI components",
        "Fix API response handling",
        "Refactor authentication logic",
        "Optimize database queries",
        "Add unit tests",
        "Update documentation"
      ];
      const randomMessage = commitMessages[Math.floor(Math.random() * commitMessages.length)];
      
      const newCommit = {
        id: Date.now(),
        user: randomUser,
        message: randomMessage,
        time: "just now",
        sha: Math.random().toString(16).substring(2, 8)
      };
      
      setLiveCommit(newCommit);
      
      // Reset after displaying animation
      setTimeout(() => {
        setLiveCommit(null);
      }, 5000);
    };
    
    const commitInterval = setInterval(simulateNewCommit, 15000);
    return () => clearInterval(commitInterval);
  }, []);

  // Helper functions
  const getTeamMemberById = (id) => teamMembers.find(member => member.id === id);

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === "Completed").length,
    inProgress: tasks.filter(task => task.status === "In Progress").length,
    review: tasks.filter(task => task.status === "Review").length,
    todo: tasks.filter(task => task.status === "To Do").length
  };

  // Generate content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-layout">
            {/* Left column */}
            <div className="column left-column">
              <div className="card progress-card">
                <div className="progress-circle-wrapper">
                  <div className="progress-circle">
                    <svg viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#00c2ff" />
                          <stop offset="100%" stopColor="#5f27cd" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="42" fill="none" className="progress-bg" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="42" 
                        fill="none" 
                        className="progress-fill"
                        style={{
                          strokeDasharray: 263.89,
                          strokeDashoffset: 263.89 * (1 - projectData.completionPercentage / 100),
                          stroke: "url(#progressGradient)"
                        }}
                      />
                    </svg>
                    <div className="progress-text">{projectData.completionPercentage}%</div>
                  </div>
                  <h3 className="progress-title">Project Completion</h3>
                </div>
                
                <div className="task-status">
                  <div className="task-status-item">
                    <span className="status-label">Completed</span>
                    <div className="status-bar">
                      <div 
                        className="status-fill completed"
                        style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="status-count">{taskStats.completed}</span>
                  </div>
                  <div className="task-status-item">
                    <span className="status-label">In Progress</span>
                    <div className="status-bar">
                      <div 
                        className="status-fill in-progress"
                        style={{ width: `${(taskStats.inProgress / taskStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="status-count">{taskStats.inProgress}</span>
                  </div>
                  <div className="task-status-item">
                    <span className="status-label">To Do</span>
                    <div className="status-bar">
                      <div 
                        className="status-fill todo"
                        style={{ width: `${(taskStats.todo / taskStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="status-count">{taskStats.todo}</span>
                  </div>
                </div>
              </div>
              
              <div className="card commit-history-card">
                <div className="card-header">
                  <h3><FaHistory /> Commit Activity</h3>
                </div>
                <div className="commit-bars">
                  {projectData.commitHistory.map((count, index) => (
                    <div key={index} className="commit-bar-wrapper">
                      <div 
                        className="commit-bar" 
                        style={{ 
                          height: `${(count / Math.max(...projectData.commitHistory)) * 100}%`,
                        }}
                        title={`${count} commits`}
                      ></div>
                      <div className="commit-day">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Middle column */}
            <div className="column middle-column">
              <div className="card deadline-card">
                <div className="deadline-header">
                  <h3><FaFireAlt /> Hackathon Countdown</h3>
                  <button 
                    className="edit-deadline-btn"
                    onClick={() => setIsEditingDeadline(!isEditingDeadline)}
                  >
                    <FaEdit />
                  </button>
                </div>
                {isEditingDeadline ? (
                  <div className="deadline-editor">
                    <div className="deadline-inputs">
                      <input
                        type="date"
                        value={deadlineDate}
                        onChange={(e) => setDeadlineDate(e.target.value)}
                      />
                      <input
                        type="time"
                        value={deadlineTime}
                        onChange={(e) => setDeadlineTime(e.target.value)}
                      />
                    </div>
                    <button className="save-deadline-btn" onClick={updateDeadline}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="countdown">
                    <div className="countdown-item">
                      <div className="countdown-value">{timeRemaining.days}</div>
                      <div className="countdown-label">days</div>
                    </div>
                    <div className="countdown-divider">:</div>
                    <div className="countdown-item">
                      <div className="countdown-value">{timeRemaining.hours}</div>
                      <div className="countdown-label">hours</div>
                    </div>
                    <div className="countdown-divider">:</div>
                    <div className="countdown-item">
                      <div className="countdown-value">{timeRemaining.minutes}</div>
                      <div className="countdown-label">min</div>
                    </div>
                    <div className="countdown-divider">:</div>
                    <div className="countdown-item">
                      <div className="countdown-value">{timeRemaining.seconds}</div>
                      <div className="countdown-label">sec</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="card tasks-card">
                <div className="card-header">
                  <h3><FaTasks /> Active Tasks</h3>
                </div>
                <div className="task-list">
                  {tasks
                    .filter(task => task.status === "In Progress")
                    .slice(0, 3)
                    .map(task => (
                      <div key={task.id} className={`task-item-small priority-${task.priority.toLowerCase()}`}>
                        <div className="task-content">
                          <div className="task-title-small">{task.title}</div>
                          <div className="task-meta">
                            <img 
                              src={getTeamMemberById(task.assignee).avatar} 
                              alt={getTeamMemberById(task.assignee).name}
                              className="task-assignee-avatar" 
                            />
                            <span className="task-priority">{task.priority}</span>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
              
              <div className="card metrics-card">
                <div className="metrics-wrapper">
                  <div className="metric">
                    <div className="metric-value">{taskStats.total}</div>
                    <div className="metric-label">Tasks</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">{commits.length}</div>
                    <div className="metric-label">Commits</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">{teamMembers.length}</div>
                    <div className="metric-label">Team</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column */}
            <div className="column right-column">
              <div className="card recent-commits-card">
                <div className="card-header">
                  <h3><FaLaptopCode /> Recent Commits</h3>
                </div>
                <div className="recent-commits-list">
                  {commits.slice(0, 4).map(commit => (
                    <div key={commit.id} className="recent-commit">
                      <img 
                        src={getTeamMemberById(commit.user).avatar} 
                        alt={getTeamMemberById(commit.user).name}
                        className="commit-avatar" 
                      />
                      <div className="commit-details">
                        <div className="commit-message">{commit.message}</div>
                        <div className="commit-meta">
                          <span className="commit-author">{getTeamMemberById(commit.user).name}</span>
                          <span className="commit-time">{commit.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card team-card">
                <div className="card-header">
                  <h3><FaUsers /> Team Activity</h3>
                </div>
                <div className="team-members-list">
                  {teamMembers.slice(0, 3).map(member => (
                    <div key={member.id} className="team-member-item">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="team-member-avatar" 
                      />
                      <div className="team-member-details">
                        <div className="team-member-name">{member.name}</div>
                        <div className="team-member-task">{member.currentTask}</div>
                      </div>
                      <div className="team-member-stats">
                        <span className="team-member-commits">{member.commits}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="tasks-tab-content">
            <div className="card">
              <div className="card-header">
                <h3><FaTasks /> All Tasks</h3>
              </div>
              <div className="task-list full-list">
                {tasks.map(task => (
                  <div key={task.id} className={`task-item-small priority-${task.priority.toLowerCase()}`}>
                    <div className="task-content">
                      <div className="task-title-small">{task.title}</div>
                      <div className="task-meta">
                        <div className="task-status-badge">{task.status}</div>
                        <img 
                          src={getTeamMemberById(task.assignee).avatar} 
                          alt={getTeamMemberById(task.assignee).name}
                          className="task-assignee-avatar" 
                        />
                        <span className="task-priority">{task.priority}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="team-tab-content">
            <div className="card">
              <div className="card-header">
                <h3><FaUsers /> Team Members</h3>
              </div>
              <div className="team-members-list full-list">
                {teamMembers.map(member => (
                  <div key={member.id} className="team-member-item">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="team-member-avatar" 
                    />
                    <div className="team-member-details">
                      <div className="team-member-name">{member.name}</div>
                      <div className="team-member-role">{member.role}</div>
                      <div className="team-member-task">{member.currentTask}</div>
                    </div>
                    <div className="team-member-stats">
                      <span className="team-member-commits">{member.commits}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="repo-info">
          <h1><FaGithub /> {projectData.name}</h1>
          <div className="repo-branch"><FaCodeBranch /> {projectData.branch}</div>
        </div>
      </div>
      
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button 
            className={`tab ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            Team
          </button>
        </div>
      </div>
      
      {liveCommit && (
        <div className="commit-toast">
          <img 
            src={getTeamMemberById(liveCommit.user).avatar} 
            alt={getTeamMemberById(liveCommit.user).name}
            className="commit-toast-avatar" 
          />
          <div className="commit-toast-content">
            <strong>{getTeamMemberById(liveCommit.user).name}</strong> just committed: {liveCommit.message}
          </div>
        </div>
      )}
      
      <div className="dashboard-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default Dashboard; 