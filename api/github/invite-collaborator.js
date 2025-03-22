import { Octokit } from '@octokit/rest'

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response.status(204).end()
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { repo, email } = request.body
    const token = request.headers.authorization?.split('Bearer ')[1]

    if (!token) {
      return response.status(401).json({ error: 'No authorization token provided' })
    }

    const octokit = new Octokit({ auth: token })

    // First, get the authenticated user's information
    const { data: user } = await octokit.users.getAuthenticated()

    // Add the collaborator
    const githubResponse = await octokit.repos.addCollaborator({
      owner: user.login,
      repo,
      username: email, // GitHub will handle email-to-username resolution
      permission: 'push'
    })

    return response.status(200).json(githubResponse.data)
  } catch (error) {
    console.error('Error inviting collaborator:', error)
    return response.status(500).json({ error: 'Failed to invite collaborator' })
  }
} 