import { describe, test, expect, beforeEach, jest } from '@jest/globals'

jest.mock('../../src/services/resume.service', () => ({
  getResumeData: jest.fn(),
}))

import { getResumeData } from '../../src/services/resume.service'

describe('GET /resume Contract Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return resume data with required structure', async () => {
    const mockResumeData = {
      personalInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-0123',
        location: 'New York, NY'
      },
      summary: 'Experienced full-stack developer with 5+ years...',
      workExperience: [
        {
          company: 'Tech Corp',
          position: 'Senior Developer',
          startDate: '2022-01-01',
          endDate: null,
          location: 'Remote',
          description: 'Lead development of web applications...',
          achievements: ['Improved performance by 40%', 'Led team of 4 developers']
        }
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2018-09-01',
          endDate: '2022-05-01',
          gpa: 3.8
        }
      ],
      lastUpdated: '2023-12-01T10:00:00Z'
    }

    ;(getResumeData as jest.MockedFunction<typeof getResumeData>).mockResolvedValue(mockResumeData)

    const result = await getResumeData()

    // Validate structure
    expect(result).toHaveProperty('personalInfo')
    expect(result).toHaveProperty('summary')
    expect(result).toHaveProperty('workExperience')
    expect(result).toHaveProperty('education')
    expect(result).toHaveProperty('lastUpdated')

    // Validate personal info
    expect(result.personalInfo).toHaveProperty('name')
    expect(result.personalInfo).toHaveProperty('email')

    // Validate work experience array
    expect(Array.isArray(result.workExperience)).toBe(true)
    result.workExperience.forEach(experience => {
      expect(experience).toHaveProperty('company')
      expect(experience).toHaveProperty('position')
      expect(experience).toHaveProperty('startDate')
      expect(experience.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      if (experience.endDate) {
        expect(experience.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      }
    })

    // Validate education array
    expect(Array.isArray(result.education)).toBe(true)
    result.education.forEach(edu => {
      expect(edu).toHaveProperty('institution')
      expect(edu).toHaveProperty('degree')
      expect(edu).toHaveProperty('field')
      if (edu.gpa) {
        expect(edu.gpa).toBeGreaterThanOrEqual(0)
        expect(edu.gpa).toBeLessThanOrEqual(4)
      }
    })

    // Validate timestamp
    expect(result.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  test('should handle resume data not found', async () => {
    ;(getResumeData as jest.MockedFunction<typeof getResumeData>).mockRejectedValue(
      new Error('Resume data not found')
    )

    await expect(getResumeData()).rejects.toThrow('Resume data not found')
  })
})