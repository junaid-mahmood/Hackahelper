import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #0d1117;
  color: #c9d1d9;
`

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
`

const GitHubLogo = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 24px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNOCAwQzMuNTggMCAwIDMuNTggMCA4YzAgMy41NCAyLjI5IDYuNTMgNS40NyA3LjU5LjQuMDcuNTUtLjE3LjU1LS4zOCAwLS4xOS0uMDEtLjgyLS4wMS0xLjQ5LTIuMDEuMzctMi41My0uNDktMi42OS0uOTQtLjA5LS4yMy0uNDgtLjk0LS44Mi0xLjEzLS4yOC0uMTUtLjY4LS41Mi0uMDEtLjUzLjYzLS4wMSAxLjA4LjU4IDEuMjMuODIuNzIgMS4yMSAxLjg3Ljg3IDIuMzMuNjYuMDctLjUyLjI4LS44Ny41MS0xLjA3LTEuNzgtLjItMy42NC0uODktMy42NC0zLjk1IDAtLjg3LjMxLTEuNTkuODItMi4xNS0uMDgtLjItLjM2LTEuMDIuMDgtMi4xMiAwIDAgLjY3LS4yMSAyLjIuODIuNjQtLjE4IDEuMzItLjI3IDItLjI3LjY4IDAgMS4zNi4wOSAyIC4yNyAxLjUzLTEuMDQgMi4yLS44MiAyLjItLjgyLjQ0IDEuMS4xNiAxLjkyLjA4IDIuMTIuNTEuNTYuODIgMS4yNy44MiAyLjE1IDAgMy4wNy0xLjg3IDMuNzUtMy42NSAzLjk1LjI5LjI1LjU0LjczLjU0IDEuNDggMCAxLjA3LS4wMSAxLjkzLS4wMSAyLjIgMCAuMjEuMTUuNDYuNTUuMzhBOC4wMTMgOC4wMTMgMCAwMDE2IDhjMC00LjQyLTMuNTgtOC04LTh6Ij48L3BhdGg+PC9zdmc+');
  background-size: contain;
  background-repeat: no-repeat;
  filter: brightness(0) invert(1);
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 24px;
  text-align: center;
`

const SignInButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #238636;
  border: 1px solid rgba(240, 246, 252, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  max-width: 250px;

  &:hover {
    background-color: #2ea043;
    border-color: rgba(240, 246, 252, 0.1);
  }
`

const ErrorMessage = styled.div`
  color: #f85149;
  background-color: rgba(248, 81, 73, 0.1);
  border: 1px solid #f8514980;
  border-radius: 6px;
  padding: 12px;
  margin: 12px 0;
  font-size: 14px;
  width: 100%;
  max-width: 350px;
  text-align: center;
`

const ErrorActions = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
`

const ErrorButton = styled.button`
  background: transparent;
  color: #58a6ff;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
  
  &:hover {
    color: #79c0ff;
  }
`

function App() {
  const [error, setError] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const errorType = searchParams.get('error')
    const errorMessage = searchParams.get('message')
    
    if (errorType) {
      let displayMessage = 'Authentication failed. '
      
      switch (errorType) {
        case 'config_error':
          displayMessage += 'Missing GitHub configuration.'
          break
        case 'github_error':
          displayMessage += errorMessage || 'GitHub authorization failed.'
          break
        case 'token_error':
          displayMessage += errorMessage || 'Failed to exchange code for access token.'
          break
        case 'no_token':
          displayMessage += 'No access token received from GitHub.'
          break
        default:
          displayMessage += errorMessage || 'Unknown error occurred.'
      }
      
      setError(displayMessage)
      
      // Clear error from URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [location])

  const handleSignIn = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
    const redirectUri = import.meta.env.VITE_REDIRECT_URL
    const scope = 'repo'
    
    if (!clientId) {
      console.error('Missing GitHub client ID in environment variables')
      setError('Configuration error. GitHub client ID is missing.')
      return
    }
    
    if (!redirectUri) {
      console.error('Missing redirect URL in environment variables')
      setError('Configuration error. Redirect URL is missing.')
      return
    }
    
    // Log the redirect URI for debugging
    console.log('Using redirect URI:', redirectUri)
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <Container>
      <SignInContainer>
        <GitHubLogo />
        <Title>Sign in to GitHub</Title>
        
        {error && (
          <ErrorMessage>
            {error}
            <ErrorActions>
              <ErrorButton onClick={clearError}>Dismiss</ErrorButton>
              <ErrorButton onClick={handleSignIn}>Try Again</ErrorButton>
            </ErrorActions>
          </ErrorMessage>
        )}
        
        <SignInButton onClick={handleSignIn}>
          Continue with GitHub
        </SignInButton>
      </SignInContainer>
    </Container>
  )
}

export default App
