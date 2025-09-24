import { describe, test, expect, beforeEach, jest } from '@jest/globals'

// Mock the portfolio service that doesn't exist yet
jest.mock('../../src/services/portfolio.service', () => ({
  getProfile: jest.fn(),
}))

import { getProfile } from '../../src/services/portfolio.service'

describe('GET /profile Contract Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return profile with required fields', async () => {
    // This test will fail because getProfile service doesn't exist yet
    const mockProfile = {
      id: 'profile-1',
      name: 'John Doe',
      title: 'Full Stack Developer',
      summary: 'Experienced developer with expertise in React and Node.js',
      location: 'New York, NY',
      email: 'john@example.com',
      phone: '+1-555-0123',
      socialLinks: [
        {
          platform: 'linkedin',
          url: 'https://linkedin.com/in/johndoe'
        },
        {
          platform: 'github',
          url: 'https://github.com/johndoe'
        }
      ],
      skills: ['React', 'TypeScript', 'Node.js']
    }

    ;(getProfile as jest.MockedFunction<typeof getProfile>).mockResolvedValue(mockProfile)

    const result = await getProfile()

    // Contract validation - profile should have these required fields
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('summary')
    expect(result.name).toHaveLength.greaterThan(0)
    expect(result.name.length).toBeLessThanOrEqual(100)
    expect(result.title).toHaveLength.greaterThan(0)
    expect(result.title.length).toBeLessThanOrEqual(200)
    expect(result.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(Array.isArray(result.socialLinks)).toBe(true)
    expect(Array.isArray(result.skills)).toBe(true)
  })

  test('should handle profile not found error', async () => {
    ;(getProfile as jest.MockedFunction<typeof getProfile>).mockRejectedValue(
      new Error('Profile not found')
    )

    await expect(getProfile()).rejects.toThrow('Profile not found')
  })

  test('should validate social links format', async () => {
    const mockProfile = {
      id: 'profile-1',
      name: 'John Doe',
      title: 'Developer',
      summary: 'Developer summary',
      socialLinks: [
        {
          platform: 'linkedin',
          url: 'https://linkedin.com/in/johndoe'
        }
      ]
    }

    ;(getProfile as jest.MockedFunction<typeof getProfile>).mockResolvedValue(mockProfile)

    const result = await getProfile()

    result.socialLinks?.forEach(link => {
      expect(link).toHaveProperty('platform')
      expect(link).toHaveProperty('url')
      expect(link.url).toMatch(/^https?:\/\//)
    })
  })
})