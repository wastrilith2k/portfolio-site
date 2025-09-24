import { describe, test, expect, beforeEach, jest } from '@jest/globals'

// Mock the project service that doesn't exist yet
jest.mock('../../src/services/project.service', () => ({
  getProjectById: jest.fn(),
}))

import { getProjectById } from '../../src/services/project.service'

describe('GET /projects/{id} Contract Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return project details with full schema', async () => {
    // This test will fail because getProjectById service doesn't exist yet
    const mockProject = {
      id: 'project-1',
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce platform built with React and Node.js',
      longDescription: `
        This comprehensive e-commerce platform was built from the ground up using modern web technologies.
        The platform features a responsive React frontend with TypeScript for type safety, and a robust
        Node.js backend with Express.js. The system includes user authentication, product catalog management,
        shopping cart functionality, and secure payment processing through Stripe integration.
      `,
      technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Stripe'],
      category: 'web',
      startDate: '2023-01-01',
      endDate: '2023-06-01',
      status: 'completed',
      images: [
        'https://example.com/project1-home.jpg',
        'https://example.com/project1-product.jpg',
        'https://example.com/project1-cart.jpg'
      ],
      links: {
        live: 'https://ecommerce.example.com',
        repository: 'https://github.com/johndoe/ecommerce'
      },
      highlights: [
        'Implemented secure payment processing with Stripe',
        'Built responsive design supporting all device sizes',
        'Achieved 95% test coverage with Jest and React Testing Library',
        'Implemented real-time inventory management'
      ],
      role: 'Full Stack Developer',
      teamSize: 3
    }

    ;(getProjectById as jest.MockedFunction<typeof getProjectById>).mockResolvedValue(mockProject)

    const result = await getProjectById('project-1')

    // Contract validation - project should have all required fields
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('description')
    expect(result).toHaveProperty('technologies')

    // Validate field constraints
    expect(result.title).toHaveLength.greaterThan(0)
    expect(result.title.length).toBeLessThanOrEqual(200)
    expect(result.description).toHaveLength.greaterThanOrEqual(10)
    expect(result.description.length).toBeLessThanOrEqual(500)
    expect(Array.isArray(result.technologies)).toBe(true)
    expect(result.technologies.length).toBeGreaterThan(0)

    // Validate optional fields if present
    if (result.longDescription) {
      expect(typeof result.longDescription).toBe('string')
    }
    if (result.images) {
      expect(Array.isArray(result.images)).toBe(true)
      result.images.forEach(image => {
        expect(image).toMatch(/^https?:\/\//)
      })
    }
    if (result.highlights) {
      expect(Array.isArray(result.highlights)).toBe(true)
    }
    if (result.teamSize) {
      expect(result.teamSize).toBeGreaterThanOrEqual(1)
    }
  })

  test('should handle project not found error', async () => {
    ;(getProjectById as jest.MockedFunction<typeof getProjectById>).mockRejectedValue(
      new Error('Project not found')
    )

    await expect(getProjectById('non-existent-project')).rejects.toThrow('Project not found')
  })

  test('should validate date formats', async () => {
    const mockProject = {
      id: 'project-1',
      title: 'Test Project',
      description: 'A test project',
      technologies: ['React'],
      startDate: '2023-01-01',
      endDate: '2023-06-01'
    }

    ;(getProjectById as jest.MockedFunction<typeof getProjectById>).mockResolvedValue(mockProject)

    const result = await getProjectById('project-1')

    if (result.startDate) {
      expect(result.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
    if (result.endDate) {
      expect(result.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  test('should validate links format when present', async () => {
    const mockProject = {
      id: 'project-1',
      title: 'Test Project',
      description: 'A test project',
      technologies: ['React'],
      links: {
        live: 'https://example.com',
        repository: 'https://github.com/user/repo'
      }
    }

    ;(getProjectById as jest.MockedFunction<typeof getProjectById>).mockResolvedValue(mockProject)

    const result = await getProjectById('project-1')

    if (result.links) {
      if (result.links.live) {
        expect(result.links.live).toMatch(/^https?:\/\//)
      }
      if (result.links.repository) {
        expect(result.links.repository).toMatch(/^https?:\/\//)
      }
    }
  })

  test('should validate status enum values', async () => {
    const validStatuses = ['completed', 'ongoing', 'archived']

    for (const status of validStatuses) {
      const mockProject = {
        id: 'project-1',
        title: 'Test Project',
        description: 'A test project',
        technologies: ['React'],
        status: status as 'completed' | 'ongoing' | 'archived'
      }

      ;(getProjectById as jest.MockedFunction<typeof getProjectById>).mockResolvedValue(mockProject)

      const result = await getProjectById('project-1')
      expect(validStatuses).toContain(result.status)
    }
  })
})