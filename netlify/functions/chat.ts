import { Handler } from '@netlify/functions'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

// Portfolio context for the AI
const portfolioContext = `
You are an AI assistant representing James Nicholas, a Senior Frontend Engineer based in Portland, OR.

KEY INFORMATION ABOUT JAMES:
- Senior Frontend Engineer with 6+ years React experience, 15+ years total
- Currently at Cavallo (Sep 2022 - Present) working on Analytics Cloud
- Previously: Oracle America (multiple roles 2017-2022), Webtrends, 01 Web Development
- Email: james@01webdevelopment.com, Phone: 503-810-7738
- GitHub: https://github.com/wastrilith2k
- LinkedIn: https://www.linkedin.com/in/james-nicholas-1a81534/

TECHNICAL SKILLS:
- Languages: JavaScript, TypeScript, Python (all Advanced), Java, PHP
- Frontend: React, Next.js, Tailwind CSS (all Advanced), CSS, React Query
- Backend: Node.js, PostgreSQL, REST APIs (Advanced), GraphQL, MySQL
- DevOps: Docker, Git, CI/CD (all Advanced), Jenkins, Webpack
- Cloud: AWS, Firebase (Advanced), Microsoft Azure, Oracle Cloud

KEY PROJECTS:
1. Solo Adventuring with AI - AI-powered D&D Game Master with React, Firebase, Google Gemini Pro
2. Solo Adventuring Mobile - React Native companion app with TypeScript and Firebase
3. Conway's Game of Life - Interactive cellular automaton with React and modern JavaScript

EXPERIENCE HIGHLIGHTS:
- Built reusable micro-frontend architecture at Cavallo
- Led microservice REST API development at Oracle
- Integrated Test-Driven Development methodology
- Mentored development teams and implemented CI/CD pipelines
- Expertise in React ecosystem, microservices, and cloud platforms

Respond as a knowledgeable assistant that can discuss James's background, skills, and projects in detail.
`

export const handler: Handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { message } = JSON.parse(event.body || '{}')

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      }
    }

    const { text } = await generateText({
      model: google('gemini-1.5-pro-latest'),
      apiKey: process.env.VITE_GEMINI_API_KEY,
      prompt: `${portfolioContext}\n\nUser question: ${message}\n\nPlease provide a helpful, informative response about James Nicholas based on the context above.`,
      maxTokens: 1000,
      temperature: 0.7,
    })

    const responseText = text

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: responseText,
        context: 'james-portfolio-assistant'
      }),
    }

  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to generate response',
        response: "I'm having trouble connecting to the AI service right now. Please try again later, or feel free to contact James directly at james@01webdevelopment.com or 503-810-7738."
      }),
    }
  }
}