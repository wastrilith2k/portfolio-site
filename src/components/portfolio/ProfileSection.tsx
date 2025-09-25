import { useState, useEffect } from 'react';
import { useSectionTracking } from '../../hooks/useAnalytics';
import { portfolioService, ProfileData } from '../../services/portfolioService';
import { profileData } from '../../data/portfolio-data';

export default function ProfileSection() {
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

  return (
    <section
      ref={trackSection}
      className="bg-gradient-to-r from-green-700 to-green-800 text-white py-4"
    >
      <p className="text-white text-center leading-relaxed max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {profile.summary}
      </p>
    </section>
  );
}
