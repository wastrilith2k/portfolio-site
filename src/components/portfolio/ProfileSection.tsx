import { useState, useEffect } from 'react'
import { usePortfolioAnalytics, useSectionTracking } from '../../hooks/useAnalytics'
import { portfolioService, ProfileData } from '../../services/portfolioService'
import { profileData } from '../../data/portfolio-data'

export default function ProfileSection() {
  const { trackSocialClick } = usePortfolioAnalytics()
  const trackSection = useSectionTracking('profile')
  const [profile, setProfile] = useState<ProfileData>(profileData)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await portfolioService.getProfile()
        setProfile(data)
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
    loadProfile()
  }, [])

  const handleSocialClick = (platform: string, url: string) => {
    trackSocialClick(platform.toLowerCase(), url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section ref={trackSection} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="text-left">
            <h1 className="text-xl md:text-2xl font-bold">{profile.name}</h1>
            <h2 className="text-sm md:text-base text-green-100">{profile.title}</h2>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          {profileData.socialLinks.map((link) => (
            <button
              key={link.platform}
              onClick={() => handleSocialClick(link.platform, link.url)}
              className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg font-medium text-sm"
            >
              {link.platform}
            </button>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg font-medium text-sm"
          >
            Resume
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="bg-white text-green-600 hover:bg-green-50 transition-colors px-4 py-2 rounded-lg font-medium text-sm"
          >
            Contact Me
          </a>
        </div>

        {/* Mobile buttons - show below on small screens */}
        <div className="md:hidden mt-4 flex justify-center space-x-2 flex-wrap gap-y-2">
          {profileData.socialLinks.map((link) => (
            <button
              key={link.platform}
              onClick={() => handleSocialClick(link.platform, link.url)}
              className="bg-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded text-xs"
            >
              {link.platform}
            </button>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded text-xs"
          >
            Resume
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="bg-white text-green-600 hover:bg-green-50 transition-colors px-3 py-1 rounded text-xs"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  )
}