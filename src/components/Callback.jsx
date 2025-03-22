import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #0d1117;
  color: #c9d1d9;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
`

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #30363d;
  border-radius: 50%;
  border-top-color: #2ea043;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const Message = styled.p`
  margin: 0;
  font-size: 16px;
  color: #c9d1d9;
`

function Callback() {
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Authentication failed. Redirecting...')

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    const errorParam = new URLSearchParams(window.location.search).get('error')
    
    if (errorParam) {
      setError(true)
      setErrorMessage(`Authentication error: ${errorParam}. Redirecting...`)
      setTimeout(() => navigate('/'), 3000)
      return
    }
    
    if (code) {
      try {
        // Redirect to the backend callback endpoint
        window.location.href = `/api/auth/github/callback?code=${code}`
      } catch (err) {
        console.error('Error redirecting to callback:', err)
        setError(true)
        setErrorMessage('Failed to complete authentication. Redirecting...')
        setTimeout(() => navigate('/'), 3000)
      }
    } else {
      setError(true)
      setErrorMessage('No authorization code received. Redirecting...')
      setTimeout(() => navigate('/'), 3000)
    }
  }, [navigate])

  return (
    <Container>
      <LoadingContainer>
        <Spinner />
        <Message>
          {error ? errorMessage : 'Authenticating with GitHub...'}
        </Message>
      </LoadingContainer>
    </Container>
  )
}

export default Callback 