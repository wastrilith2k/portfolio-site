import { describe, test, expect, beforeEach, jest } from '@jest/globals'

// Mock window.gtag
const mockGtag = jest.fn()
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true,
})

Object.defineProperty(window, 'dataLayer', {
  value: [],
  writable: true,
})

import { initGoogleAnalytics, trackPageView, trackEvent, portfolioAnalytics } from '../../src/services/analytics.service'

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGtag.mockClear()

    // Mock environment variable
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_FIREBASE_MEASUREMENT_ID: '"G-ZZ0C51N2CQ"',
      },
      writable: true,
    })
  })

  test('should initialize Google Analytics', () => {
    initGoogleAnalytics()

    // Check if gtag script is added to document head
    const scripts = document.head.querySelectorAll('script')
    const gtagScript = Array.from(scripts).find(script =>
      script.src.includes('googletagmanager.com/gtag/js')
    )

    expect(gtagScript).toBeDefined()
    expect(window.dataLayer).toBeDefined()
    expect(window.gtag).toBeDefined()
  })

  test('should track page views', () => {
    // Initialize first
    window.gtag = mockGtag

    trackPageView('/about', 'About Page')

    expect(mockGtag).toHaveBeenCalledWith('config', 'G-ZZ0C51N2CQ', {
      page_path: '/about',
      page_title: 'About Page',
      page_location: 'http://localhost/about',
    })
  })

  test('should track custom events', () => {
    window.gtag = mockGtag

    trackEvent('test_event', {
      event_category: 'test',
      event_label: 'test_label',
      value: 1,
      custom_parameters: {
        custom_param: 'custom_value',
      },
    })

    expect(mockGtag).toHaveBeenCalledWith('event', 'test_event', {
      event_category: 'test',
      event_label: 'test_label',
      value: 1,
      custom_param: 'custom_value',
    })
  })

  test('should track project views', () => {
    window.gtag = mockGtag

    portfolioAnalytics.trackProjectView('project-1', 'E-commerce Platform')

    expect(mockGtag).toHaveBeenCalledWith('event', 'view_project', {
      event_category: 'portfolio',
      event_label: 'E-commerce Platform',
      project_id: 'project-1',
    })
  })

  test('should track chatbot interactions', () => {
    window.gtag = mockGtag

    portfolioAnalytics.trackChatMessage('user_message')

    expect(mockGtag).toHaveBeenCalledWith('event', 'chat_interaction', {
      event_category: 'chatbot',
      event_label: 'user_message',
    })
  })

  test('should track skill views', () => {
    window.gtag = mockGtag

    portfolioAnalytics.trackSkillView('React', 'technical')

    expect(mockGtag).toHaveBeenCalledWith('event', 'view_skill', {
      event_category: 'portfolio',
      event_label: 'React',
      skill_category: 'technical',
    })
  })

  test('should track contact form interactions', () => {
    window.gtag = mockGtag

    portfolioAnalytics.trackContactForm('completed')

    expect(mockGtag).toHaveBeenCalledWith('event', 'contact_form', {
      event_category: 'engagement',
      event_label: 'completed',
    })
  })

  test('should track resume downloads', () => {
    window.gtag = mockGtag

    portfolioAnalytics.trackResumeDownload()

    expect(mockGtag).toHaveBeenCalledWith('event', 'download_resume', {
      event_category: 'engagement',
      event_label: 'resume_pdf',
      value: 1,
    })
  })

  test('should track social link clicks', () => {
    window.gtag = mockGtag

    portfolioAnalytics.trackSocialClick('linkedin', 'https://linkedin.com/in/johndoe')

    expect(mockGtag).toHaveBeenCalledWith('event', 'social_click', {
      event_category: 'social',
      event_label: 'linkedin',
      destination_url: 'https://linkedin.com/in/johndoe',
    })
  })

  test('should handle missing measurement ID gracefully', () => {
    // Mock missing environment variable
    Object.defineProperty(import.meta, 'env', {
      value: {},
      writable: true,
    })

    // Should not throw error
    expect(() => {
      initGoogleAnalytics()
      trackPageView('/test')
      trackEvent('test_event')
    }).not.toThrow()
  })
})