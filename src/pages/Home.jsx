import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <section className="hero">
        <h1>Hackathon Hub</h1>
        <p>The ultimate platform for hackathon enthusiasts</p>
        
        {user ? (
          <Link to="/dashboard" className="cta-button">
            Go to Dashboard
          </Link>
        ) : (
          <Link to="/login" className="cta-button">
            Get Started
          </Link>
        )}
      </section>
      
      <section className="features">
        <div className="feature-card">
          <h2>Connect with GitHub</h2>
          <p>Link your GitHub account to showcase your projects</p>
        </div>
        
        <div className="feature-card">
          <h2>Find Hackathons</h2>
          <p>Discover upcoming hackathons that match your interests</p>
        </div>
        
        <div className="feature-card">
          <h2>Build Your Profile</h2>
          <p>Create a portfolio to showcase your hackathon achievements</p>
        </div>
      </section>
    </div>
  );
} 