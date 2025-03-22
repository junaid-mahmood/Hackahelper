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
    const { name, description } = request.body
    const token = request.headers.authorization?.split('Bearer ')[1]

    if (!token) {
      return response.status(401).json({ error: 'No authorization token provided' })
    }

    const octokit = new Octokit({ auth: token })

    const githubResponse = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      private: true,
      auto_init: true,
    })

    return response.status(200).json(githubResponse.data)
  } catch (error) {
    console.error('Error creating repository:', error)
    return response.status(500).json({ error: 'Failed to create repository' })
  }
} 