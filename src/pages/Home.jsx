import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

function Home() {
  return (
    <div className="home-page">
      <div className="grid-background"></div>
      <div className="glow-animation"></div>
      <div className="glow-animation"></div>
      <div className="glow-animation"></div>
      
      <div className="container">
        <div className="hero-content">
          <h1 className="app-title">HackaHelper</h1>
          <p className="hero-subtitle">Your AI-powered companion for hackathons and coding projects</p>
          
          <div className="cta-container">
            <Link to="/setup" className="github-btn large-btn">
              <FaGithub size={28} />
              Login with GitHub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 