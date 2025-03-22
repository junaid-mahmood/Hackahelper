import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../supabase';

export default function Navbar() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Hackathon Hub
        </Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Home</Link>
        <Link to="/dashboard" className="navbar-item">Dashboard</Link>
        {user ? (
          <div className="navbar-end">
            <span className="navbar-item">
              {user.email}
            </span>
            <button className="button" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="navbar-item">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
} 