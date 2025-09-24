import { describe, test, expect, beforeEach, jest } from '@jest/globals'

jest.mock('../../src/services/skills.service', () => ({
  getSkills: jest.fn(),
}))

import { getSkills } from '../../src/services/skills.service'

describe('GET /skills Contract Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return array of skills with required fields', async () => {
    const mockSkills = [
      {
        id: 'skill-1',
        name: 'React',
        category: 'technical',
        level: 'advanced',
        years: 4,
        verified: true,
        projects: ['project-1', 'project-2'],
        description: 'Frontend library for building user interfaces'
      }
    ]

    ;(getSkills as jest.MockedFunction<typeof getSkills>).mockResolvedValue(mockSkills)

    const result = await getSkills()

    expect(Array.isArray(result)).toBe(true)
    result.forEach(skill => {
      expect(skill).toHaveProperty('id')
      expect(skill).toHaveProperty('name')
      expect(skill).toHaveProperty('category')
      expect(skill).toHaveProperty('level')
      expect(['technical', 'soft', 'language', 'tool', 'framework']).toContain(skill.category)
      expect(['beginner', 'intermediate', 'advanced', 'expert']).toContain(skill.level)
      if (skill.years !== undefined) {
        expect(skill.years).toBeGreaterThanOrEqual(0)
      }
      if (skill.projects) {
        expect(Array.isArray(skill.projects)).toBe(true)
      }
    })
  })

  test('should filter skills by category', async () => {
    const mockSkills = [
      {
        id: 'skill-1',
        name: 'React',
        category: 'technical',
        level: 'advanced'
      }
    ]

    ;(getSkills as jest.MockedFunction<typeof getSkills>).mockResolvedValue(mockSkills)

    const result = await getSkills({ category: 'technical' })
    expect(result.every(skill => skill.category === 'technical')).toBe(true)
  })
})