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
    <section ref={trackSection} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{profile.name}</h1>
          <h2 className="text-base md:text-lg text-green-100 mb-3">{profile.title}</h2>
          <p className="text-sm text-green-50 max-w-xl mx-auto leading-relaxed">
            {profile.summary}
          </p>
        </div>

        <div className="flex justify-center space-x-3 flex-wrap gap-y-2">
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
      </div>
    </section>
  )
}