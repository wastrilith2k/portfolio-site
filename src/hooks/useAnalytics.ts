import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackPageView,
  portfolioAnalytics,
} from '../services/analytics.service';

/**
 * Hook for tracking page views automatically
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when location changes
    trackPageView(location.pathname, document.title);
  }, [location.pathname]);
};

/**
 * Hook for portfolio-specific analytics
 */
export const usePortfolioAnalytics = () => {
  return {
    trackProjectView: useCallback((projectId: string, projectTitle: string) => {
      portfolioAnalytics.trackProjectView(projectId, projectTitle);
    }, []),

    trackChatMessage: useCallback(
      (messageType: 'user_message' | 'bot_response', messageContent?: string) => {
        portfolioAnalytics.trackChatMessage(messageType, messageContent);
      },
      []
    ),

    trackChatbotToggle: useCallback(
      (action: 'open' | 'close') => {
        portfolioAnalytics.trackChatbotToggle(action);
      },
      []
    ),

    trackSkillView: useCallback((skillName: string, skillCategory: string) => {
      portfolioAnalytics.trackSkillView(skillName, skillCategory);
    }, []),

    trackContactForm: useCallback(
      (action: 'started' | 'completed' | 'abandoned') => {
        portfolioAnalytics.trackContactForm(action);
      },
      []
    ),

    trackResumeDownload: useCallback(() => {
      portfolioAnalytics.trackResumeDownload();
    }, []),

    trackSocialClick: useCallback((platform: string, url: string) => {
      portfolioAnalytics.trackSocialClick(platform, url);
    }, []),

    trackSectionView: useCallback((sectionName: string) => {
      portfolioAnalytics.trackSectionView(sectionName);
    }, []),
  };
};

/**
 * Hook for tracking section views with intersection observer
 */
export const useSectionTracking = (sectionName: string, threshold = 0.5) => {
  const { trackSectionView } = usePortfolioAnalytics();

  const trackSection = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              trackSectionView(sectionName);
              // Only track once per session
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold }
      );

      observer.observe(node);

      return () => observer.disconnect();
    },
    [sectionName, trackSectionView, threshold]
  );

  return trackSection;
};
