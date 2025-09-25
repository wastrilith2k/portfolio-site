import { useState, useEffect } from 'react'
import { usePortfolioAnalytics, useSectionTracking } from '../../hooks/useAnalytics'
import { portfolioService, Skill } from '../../services/portfolioService'
import { profileData } from '../../data/portfolio-data'

export default function SkillsSection() {
  const { trackSkillView } = usePortfolioAnalytics()
  const trackSection = useSectionTracking('skills')
  const [skills, setSkills] = useState<Skill[]>(profileData.skills)

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await portfolioService.getSkills()
        setSkills(data)
      } catch (error) {
        console.error('Error loading skills:', error)
      }
    }
    loadSkills()
  }, [])

  const handleSkillClick = (skill: Skill) => {
    trackSkillView(skill.name, skill.category)
  }

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'advanced': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'beginner': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <section ref={trackSection} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Skills & Technologies</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Technologies and tools I work with, organized by category and proficiency level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category} className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{category}</h3>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => handleSkillClick(skill)}
                  >
                    <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                      {skill.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-6 bg-blue-50 rounded-lg px-6 py-4">
            <div className="text-sm text-blue-600">
              <span className="font-medium">Legend:</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor('advanced')}`}>
                Advanced
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor('intermediate')}`}>
                Intermediate
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor('beginner')}`}>
                Beginner
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}