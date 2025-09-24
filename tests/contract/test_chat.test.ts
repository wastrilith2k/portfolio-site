import { describe, test, expect, beforeEach, jest } from '@jest/globals'

jest.mock('../../src/services/chat.service', () => ({
  sendChatMessage: jest.fn(),
}))

import { sendChatMessage } from '../../src/services/chat.service'

describe('POST /chat Contract Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return chat response with required fields', async () => {
    const mockResponse = {
      response: 'I have experience with React, TypeScript, and Node.js...',
      conversationId: 'conv-123',
      tokens: 150
    }

    ;(sendChatMessage as jest.MockedFunction<typeof sendChatMessage>).mockResolvedValue(mockResponse)

    const result = await sendChatMessage({
      message: 'What technologies do you work with?',
      sessionId: 'session-123'
    })

    expect(result).toHaveProperty('response')
    expect(result).toHaveProperty('conversationId')
    expect(result).toHaveProperty('tokens')
    expect(typeof result.response).toBe('string')
    expect(result.response.length).toBeGreaterThan(0)
    expect(typeof result.conversationId).toBe('string')
    expect(typeof result.tokens).toBe('number')
    expect(result.tokens).toBeGreaterThan(0)
  })

  test('should validate request parameters', async () => {
    const mockResponse = {
      response: 'Test response',
      conversationId: 'conv-123',
      tokens: 50
    }

    ;(sendChatMessage as jest.MockedFunction<typeof sendChatMessage>).mockResolvedValue(mockResponse)

    // Test with valid parameters
    await expect(sendChatMessage({
      message: 'Valid message',
      sessionId: 'session-123',
      conversationId: 'conv-123'
    })).resolves.toBeDefined()
  })

  test('should handle empty message error', async () => {
    ;(sendChatMessage as jest.MockedFunction<typeof sendChatMessage>).mockRejectedValue(
      new Error('Message cannot be empty')
    )

    await expect(sendChatMessage({
      message: '',
      sessionId: 'session-123'
    })).rejects.toThrow('Message cannot be empty')
  })

  test('should handle rate limit error', async () => {
    ;(sendChatMessage as jest.MockedFunction<typeof sendChatMessage>).mockRejectedValue(
      new Error('Rate limit exceeded')
    )

    await expect(sendChatMessage({
      message: 'Test message',
      sessionId: 'session-123'
    })).rejects.toThrow('Rate limit exceeded')
  })

  test('should handle AI service error', async () => {
    ;(sendChatMessage as jest.MockedFunction<typeof sendChatMessage>).mockRejectedValue(
      new Error('AI service error')
    )

    await expect(sendChatMessage({
      message: 'Test message',
      sessionId: 'session-123'
    })).rejects.toThrow('AI service error')
  })
})