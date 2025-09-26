import { useState, useEffect } from 'react';
import {
  usePortfolioAnalytics,
  useSectionTracking,
} from '../../hooks/useAnalytics';
import { portfolioService, ProfileData } from '../../services/portfolioService';
import { profileData } from '../../data/portfolio-data';

export default function HeaderSection() {
  const { trackSocialClick, trackResumeDownload } = usePortfolioAnalytics();
  const trackSection = useSectionTracking('profile');
  const [profile, setProfile] = useState<ProfileData>(profileData);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await portfolioService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handleSocialClick = (platform: string, url: string) => {
    trackSocialClick(platform.toLowerCase(), url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getUtilityIcon = (type: 'resume' | 'contact') => {
    switch (type) {
      case 'resume':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case 'contact':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  return (
    <section
      ref={trackSection}
      className="bg-gradient-to-r from-green-700 to-green-800 text-white py-4"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
            {profile.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </div>
          <div className="text-left">
            <h1 className="text-xl md:text-2xl font-bold">{profile.name}</h1>
            <h2 className="text-sm md:text-base text-green-200">
              {profile.title}
            </h2>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          {profileData.socialLinks.map(link => (
            <button
              key={link.platform}
              onClick={() => handleSocialClick(link.platform, link.url)}
              className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg"
              title={link.platform}
              aria-label={`Visit ${link.platform} profile`}
            >
              {getIcon(link.platform)}
            </button>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackResumeDownload()}
            className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg"
            title="View Resume"
            aria-label="View Resume"
          >
            {getUtilityIcon('resume')}
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="bg-white text-green-700 hover:bg-green-50 transition-colors p-3 rounded-lg"
            title="Contact Me"
            aria-label="Send email"
          >
            {getUtilityIcon('contact')}
          </a>
        </div>

        {/* Mobile buttons - show below on small screens */}
        <div className="md:hidden mt-4 flex justify-center space-x-2 flex-wrap gap-y-2">
          {profileData.socialLinks.map(link => (
            <button
              key={link.platform}
              onClick={() => handleSocialClick(link.platform, link.url)}
              className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded"
              title={link.platform}
              aria-label={`Visit ${link.platform} profile`}
            >
              {getIcon(link.platform)}
            </button>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackResumeDownload()}
            className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded"
            title="View Resume"
            aria-label="View Resume"
          >
            {getUtilityIcon('resume')}
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="bg-white text-green-700 hover:bg-green-50 transition-colors p-2 rounded"
            title="Contact Me"
            aria-label="Send email"
          >
            {getUtilityIcon('contact')}
          </a>
        </div>
      </div>
    </section>
  );
}
