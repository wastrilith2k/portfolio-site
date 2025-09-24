import { usePortfolioAnalytics, useSectionTracking } from '../../hooks/useAnalytics'
import { profileData } from '../../data/portfolio-data'

export default function ProfileSection() {
  const { trackSocialClick } = usePortfolioAnalytics()
  const trackSection = useSectionTracking('profile')

  const handleSocialClick = (platform: string, url: string) => {
    trackSocialClick(platform.toLowerCase(), url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section ref={trackSection} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold">
            {profileData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{profileData.name}</h1>
          <h2 className="text-xl md:text-2xl text-blue-100 mb-6">{profileData.title}</h2>
          <p className="text-lg text-blue-50 max-w-2xl mx-auto leading-relaxed">
            {profileData.summary}
          </p>
        </div>

        <div className="flex justify-center space-x-4 flex-wrap">
          {profileData.socialLinks.map((link) => (
            <button
              key={link.platform}
              onClick={() => handleSocialClick(link.platform, link.url)}
              className="bg-white/20 hover:bg-white/30 transition-colors px-6 py-3 rounded-lg font-medium"
            >
              {link.platform}
            </button>
          ))}
          <a
            href={profileData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 hover:bg-white/30 transition-colors px-6 py-3 rounded-lg font-medium"
          >
            Resume
          </a>
          <a
            href={`mailto:${profileData.email}`}
            className="bg-white text-blue-600 hover:bg-blue-50 transition-colors px-6 py-3 rounded-lg font-medium"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  )
}