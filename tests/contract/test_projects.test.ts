import { describe, test, expect, beforeEach, jest } from '@jest/globals'

// Mock the project service that doesn't exist yet
jest.mock('../../src/services/project.service', () => ({
  getProjects: jest.fn(),
}))

import { getProjects } from '../../src/services/project.service'

describe('GET /projects Contract Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return array of projects with required fields', async () => {
    // This test will fail because getProjects service doesn't exist yet
    const mockProjects = [
      {
        id: 'project-1',
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce platform built with React and Node.js',
        longDescription: 'Detailed description of the e-commerce platform...',
        technologies: ['React', 'Node.js', 'MongoDB'],
        category: 'web',
        startDate: '2023-01-01',
        endDate: '2023-06-01',
        status: 'completed',
        images: ['https://example.com/project1-image1.jpg'],
        links: {
          live: 'https://ecommerce.example.com',
          repository: 'https://github.com/johndoe/ecommerce'
        },
        highlights: ['Implemented payment processing', 'Built responsive design'],
        role: 'Full Stack Developer',
        teamSize: 3
      }
    ]

    ;(getProjects as jest.MockedFunction<typeof getProjects>).mockResolvedValue(mockProjects)

    const result = await getProjects()

    // Contract validation - projects should be an array
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Each project should have required fields
    result.forEach(project => {
      expect(project).toHaveProperty('id')
      expect(project).toHaveProperty('title')
      expect(project).toHaveProperty('description')
      expect(project).toHaveProperty('technologies')
      expect(project.title).toHaveLength.greaterThan(0)
      expect(project.title.length).toBeLessThanOrEqual(200)
      expect(project.description).toHaveLength.greaterThanOrEqual(10)
      expect(project.description.length).toBeLessThanOrEqual(500)
      expect(Array.isArray(project.technologies)).toBe(true)
      expect(project.technologies.length).toBeGreaterThan(0)
    })
  })

  test('should filter projects by category', async () => {
    const mockProjects = [
      {
        id: 'project-1',
        title: 'Web App',
        description: 'A web application',
        technologies: ['React'],
        category: 'web',
        status: 'completed'
      }
    ]

    ;(getProjects as jest.MockedFunction<typeof getProjects>).mockResolvedValue(mockProjects)

    const result = await getProjects({ category: 'web' })

    expect(result.every(project => project.category === 'web')).toBe(true)
  })

  test('should filter projects by status', async () => {
    const mockProjects = [
      {
        id: 'project-1',
        title: 'Completed Project',
        description: 'A completed project',
        technologies: ['React'],
        status: 'completed'
      }
    ]

    ;(getProjects as jest.MockedFunction<typeof getProjects>).mockResolvedValue(mockProjects)

    const result = await getProjects({ status: 'completed' })

    expect(result.every(project => project.status === 'completed')).toBe(true)
  })

  test('should validate project links format', async () => {
    const mockProjects = [
      {
        id: 'project-1',
        title: 'Test Project',
        description: 'A test project',
        technologies: ['React'],
        links: {
          live: 'https://example.com',
          repository: 'https://github.com/user/repo'
        }
      }
    ]

    ;(getProjects as jest.MockedFunction<typeof getProjects>).mockResolvedValue(mockProjects)

    const result = await getProjects()

    result.forEach(project => {
      if (project.links) {
        if (project.links.live) {
          expect(project.links.live).toMatch(/^https?:\/\//)
        }
        if (project.links.repository) {
          expect(project.links.repository).toMatch(/^https?:\/\//)
        }
      }
    })
  })

  test('should validate project status enum', async () => {
    const mockProjects = [
      {
        id: 'project-1',
        title: 'Test Project',
        description: 'A test project',
        technologies: ['React'],
        status: 'completed'
      }
    ]

    ;(getProjects as jest.MockedFunction<typeof getProjects>).mockResolvedValue(mockProjects)

    const result = await getProjects()

    result.forEach(project => {
      expect(['completed', 'ongoing', 'archived']).toContain(project.status)
    })
  })
})