import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Callback from './components/Callback'
import Setup from './pages/Setup'

// Simple auth check
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('github_token')
  if (!token) {
    return <Navigate to="/" replace />
  }
  return children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/github/callback" element={<Callback />} />
        <Route 
          path="/setup" 
          element={
            <PrivateRoute>
              <Setup />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  </StrictMode>,
)
