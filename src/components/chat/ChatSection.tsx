import { useState } from 'react'
import { usePortfolioAnalytics, useSectionTracking } from '../../hooks/useAnalytics'

export default function ChatSection() {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>>([
    {
      id: '1',
      role: 'assistant' as const,
      content: "Hi! I'm an AI assistant that can answer questions about James's experience, projects, and skills. What would you like to know?",
      timestamp: new Date().toISOString()
    }
  ])

  const { trackChatMessage } = usePortfolioAnalytics()
  const trackSection = useSectionTracking('chat')

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    trackChatMessage('user_message')
    setMessage('')
    setIsTyping(true)

    // Simulate AI response (replace with actual Gemini API call)
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `Thanks for your question! This is a simulated response. In the full implementation, I would use Google Gemini AI to provide detailed answers about James's experience, projects, and technical skills. The AI would have context about all the portfolio data shown above.`,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, botResponse])
      trackChatMessage('bot_response')
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <section ref={trackSection} className="py-20 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Chat with AI Assistant</h2>
          <p className="text-xl text-gray-300">
            Ask questions about my experience, projects, or skills!
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about my experience, projects, or skills..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>💡 This is a demo interface. The full version will use Google Gemini AI for intelligent responses.</p>
        </div>
      </div>
    </section>
  )
}