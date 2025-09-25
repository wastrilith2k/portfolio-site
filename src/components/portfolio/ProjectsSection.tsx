import { useState, useEffect } from 'react'
import { usePortfolioAnalytics, useSectionTracking } from '../../hooks/useAnalytics'
import { portfolioService, Project } from '../../services/portfolioService'
import { projectsData } from '../../data/portfolio-data'

export default function ProjectsSection() {
  const { trackProjectView } = usePortfolioAnalytics()
  const trackSection = useSectionTracking('projects')
  const [projects, setProjects] = useState<Project[]>(projectsData)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await portfolioService.getProjects()
        setProjects(data)
      } catch (error) {
        console.error('Error loading projects:', error)
      }
    }
    loadProjects()
  }, [])

  const handleProjectClick = (project: Project) => {
    trackProjectView(project.id, project.title)
    const links = project.links as any
    if (links.live) {
      window.open(links.live, '_blank', 'noopener,noreferrer')
    } else if (links.repository) {
      window.open(links.repository, '_blank', 'noopener,noreferrer')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section ref={trackSection} className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Here are some of the projects I've worked on, showcasing different technologies and approaches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {project.highlights.slice(0, 3).map((highlight, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {highlight}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-3">
                  {(project.links as any).live && (
                    <span className="text-blue-600 text-sm font-medium">Live Demo</span>
                  )}
                  {project.links.repository && (
                    <span className="text-gray-600 text-sm">Source Code</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}