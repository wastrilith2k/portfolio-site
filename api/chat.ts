import Anthropic from '@anthropic-ai/sdk'
import { chatbotContext, getContextForTopic } from '../src/data/chatbot-context'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || '',
})

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, conversationHistory = [] } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Get relevant context based on the user's message
    const contextualInfo = getContextForTopic(message)

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-5) // Only include last 5 messages for context
      .map((msg: any) => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n')

    // Create comprehensive system prompt
    const systemPrompt = `You are an AI assistant representing James Nicholas, a Senior Frontend Engineer. You have access to his complete professional profile and should answer questions as if you're an intelligent assistant that knows everything about James's background, skills, and experience.

IMPORTANT CONTEXT ABOUT JAMES:
${JSON.stringify(chatbotContext, null, 2)}

CONTEXTUAL INFORMATION FOR THIS QUERY:
${contextualInfo}

CONVERSATION HISTORY:
${conversationContext}

Please respond as an intelligent assistant that can provide detailed, accurate information about James Nicholas. Be conversational, helpful, and knowledgeable. If asked about technical details, provide specific examples from his experience. If asked about contact information, provide his actual details. Always respond in a professional yet friendly manner.

Current question: ${message}`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: systemPrompt
        }
      ]
    })

    const responseText = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I apologize, but I had trouble generating a response.'

    return res.status(200).json({
      response: responseText,
      context: 'james-portfolio-assistant'
    })

  } catch (error) {
    console.error('Anthropic API error:', error)
    return res.status(500).json({
      error: 'Failed to generate response',
      response: "I'm having trouble connecting to the AI service right now. Please try again later, or feel free to contact James directly at james@01webdevelopment.com or 503-810-7738."
    })
  }
}