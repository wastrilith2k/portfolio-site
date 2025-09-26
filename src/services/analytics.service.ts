// Google Analytics service
type GtagCommand = 'config' | 'event' | 'js';
type GtagConfig = Record<string, unknown>;
type GtagEvent = Record<string, unknown>;

declare global {
  interface Window {
    gtag: (
      command: GtagCommand,
      targetId?: string | Date,
      config?: GtagConfig | GtagEvent
    ) => void;
    dataLayer: Array<unknown>;
  }
}

const GA_MEASUREMENT_ID =
  import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.replace(/"/g, '') || '';

/**
 * Initialize Google Analytics
 */
export const initGoogleAnalytics = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  // Create gtag script
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gtagScript);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(
    command: GtagCommand,
    targetId?: string | Date,
    config?: GtagConfig | GtagEvent
  ) {
    window.dataLayer.push([command, targetId, config]);
  };

  // Configure Google Analytics
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

/**
 * Track page views
 */
export const trackPageView = (path: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
    page_location: `${window.location.origin}${path}`,
  });
};

/**
 * Track custom events
 */
export const trackEvent = (
  eventName: string,
  parameters?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    custom_parameters?: Record<string, string | number | boolean>;
  }
) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, {
    event_category: parameters?.event_category,
    event_label: parameters?.event_label,
    value: parameters?.value,
    ...parameters?.custom_parameters,
  });
};

/**
 * Track portfolio-specific events
 */
export const portfolioAnalytics = {
  // Track when user views a project
  trackProjectView: (projectId: string, projectTitle: string) => {
    trackEvent('view_project', {
      event_category: 'portfolio',
      event_label: projectTitle,
      custom_parameters: {
        project_id: projectId,
      },
    });
  },

  // Track chatbot interactions
  trackChatMessage: (messageType: 'user_message' | 'bot_response', messageContent?: string) => {
    trackEvent('chat_interaction', {
      event_category: 'chatbot',
      event_label: messageType,
      custom_parameters: messageContent ? {
        message_content: messageContent.substring(0, 500), // Limit content length for analytics
        message_length: messageContent.length,
      } : undefined,
    });
  },

  // Track chatbot opening/closing
  trackChatbotToggle: (action: 'open' | 'close') => {
    trackEvent('chatbot_toggle', {
      event_category: 'chatbot',
      event_label: action,
    });
  },

  // Track skill interactions
  trackSkillView: (skillName: string, skillCategory: string) => {
    trackEvent('view_skill', {
      event_category: 'portfolio',
      event_label: skillName,
      custom_parameters: {
        skill_category: skillCategory,
      },
    });
  },

  // Track contact form submissions
  trackContactForm: (action: 'started' | 'completed' | 'abandoned') => {
    trackEvent('contact_form', {
      event_category: 'engagement',
      event_label: action,
    });
  },

  // Track resume/CV downloads
  trackResumeDownload: () => {
    trackEvent('download_resume', {
      event_category: 'engagement',
      event_label: 'resume_pdf',
      value: 1,
    });
  },

  // Track social link clicks
  trackSocialClick: (platform: string, url: string) => {
    trackEvent('social_click', {
      event_category: 'social',
      event_label: platform,
      custom_parameters: {
        destination_url: url,
      },
    });
  },

  // Track portfolio section views
  trackSectionView: (sectionName: string) => {
    trackEvent('view_section', {
      event_category: 'portfolio',
      event_label: sectionName,
    });
  },
};

export default {
  initGoogleAnalytics,
  trackPageView,
  trackEvent,
  portfolioAnalytics,
};
