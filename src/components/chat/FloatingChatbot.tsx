import { useState, useEffect } from 'react'
import { usePortfolioAnalytics } from '../../hooks/useAnalytics'
import { portfolioService } from '../../services/portfolioService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function FloatingChatbot () {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [portfolioContext, setPortfolioContext] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm an AI assistant that can answer questions about James's experience, projects, and skills. What would you like to know?",
      timestamp: new Date().toISOString()
    }
  ])

  const { trackChatMessage } = usePortfolioAnalytics()

  // Load chatbot context on mount
  useEffect(() => {
    const loadContext = async () => {
      try {
        const context = await portfolioService.getChatbotContext()
        setPortfolioContext(context)
      } catch (error) {
        console.error('Error loading chatbot context:', error)
      }
    }
    loadContext()
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    trackChatMessage('user_message')
    setMessage('')
    setIsTyping(true)

    // Skip if no context loaded yet
    if (!portfolioContext) {
      setIsTyping(false)
      return
    }

    // Call Gemini AI API directly
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${portfolioContext}\n\nUser question: ${userMessage.content}\n\nPlease provide a helpful, informative response about James Nicholas based on the context above.`
            }]
          }]
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.candidates[0]?.content?.parts[0]?.text || "I'm sorry, I couldn't generate a response right now.",
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, botResponse])
      trackChatMessage('bot_response')
      setIsTyping(false)
    } catch (error) {
      console.error('AI response error:', error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact James directly at james@01webdevelopment.com.",
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorResponse])
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open AI Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 h-96 border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-green-100">Ask about James's experience</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-700 rounded p-1"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about James..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}