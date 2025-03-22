import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px;
  background-color: #0d1117;
  color: #c9d1d9;
`

const Card = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 24px;
  margin-bottom: 24px;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 24px;
  color: #c9d1d9;
`

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #c9d1d9;
`

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  background-color: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #c9d1d9;
  margin-bottom: 16px;

  &:focus {
    border-color: #58a6ff;
    outline: none;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 8px 12px;
  background-color: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #c9d1d9;
  margin-bottom: 16px;
  resize: vertical;

  &:focus {
    border-color: #58a6ff;
    outline: none;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`

const Button = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.primary ? '#ffffff' : '#c9d1d9'};
  background-color: ${props => props.primary ? '#238636' : '#21262d'};
  border: 1px solid rgba(240, 246, 252, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${props => props.primary ? '#2ea043' : '#30363d'};
  }
`

const TeamSection = styled.div`
  margin-top: 24px;
`

const EmailInput = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  input {
    flex: 1;
    margin-bottom: 0;
  }
`

function Setup() {
  const navigate = useNavigate()
  const location = useLocation()
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token')
    if (token) {
      localStorage.setItem('github_token', token)
      // Clear the token from the URL
      navigate('/setup', { replace: true })
    } else if (!localStorage.getItem('github_token')) {
      // If no token in URL or localStorage, redirect to login
      navigate('/')
    }
  }, [location, navigate])

  const handleCreateRepo = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('github_token')
      if (!token) {
        throw new Error('No GitHub token found')
      }

      const response = await axios.post('/api/github/create-repo', {
        name: projectName,
        description: projectDescription,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('Repository created:', response.data)
      // Clear form after successful creation
      setProjectName('')
      setProjectDescription('')
    } catch (error) {
      console.error('Error creating repository:', error)
      alert('Failed to create repository. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('github_token')
      if (!token) {
        throw new Error('No GitHub token found')
      }

      const response = await axios.post('/api/github/invite-collaborator', {
        repo: projectName,
        email: email
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('Invitation sent:', response.data)
      setEmail('')
      alert('Invitation sent successfully!')
    } catch (error) {
      console.error('Error sending invitation:', error)
      alert('Failed to send invitation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
          <Message>Processing your request...</Message>
        </LoadingContainer>
      </Container>
    )
  }

  return (
    <Container>
      <Card>
        <Title>Create Your Hackathon Project</Title>
        <Label>Project Name</Label>
        <Input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
        <Label>Project Description</Label>
        <TextArea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Enter project description"
        />
        <ButtonGroup>
          <Button primary onClick={handleCreateRepo} disabled={loading || !projectName}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Create GitHub Repository
          </Button>
          <Button disabled={loading}>Import Existing Repository</Button>
        </ButtonGroup>
      </Card>

      <Card>
        <Title>Invite Team Members</Title>
        <EmailInput>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            disabled={!projectName}
          />
          <Button 
            primary 
            onClick={handleInvite} 
            disabled={loading || !email || !projectName}
          >
            Send Invite
          </Button>
        </EmailInput>
      </Card>
    </Container>
  )
}

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

export default Setup 