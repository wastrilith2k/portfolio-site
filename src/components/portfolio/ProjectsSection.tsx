import { useState, useEffect } from 'react';
import {
  usePortfolioAnalytics,
  useSectionTracking,
} from '../../hooks/useAnalytics';
import { portfolioService, Project } from '../../services/portfolioService';
import { projectsData } from '../../data/portfolio-data';

export default function ProjectsSection() {
  const { trackProjectView } = usePortfolioAnalytics();
  const trackSection = useSectionTracking('projects');
  const [projects, setProjects] = useState<Project[]>(projectsData);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await portfolioService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadProjects();
  }, []);

  const handleProjectClick = (project: Project) => {
    trackProjectView(project.id, project.title);
    if (project.links.live) {
      window.open(project.links.live, '_blank', 'noopener,noreferrer');
    } else if (project.links.repository) {
      window.open(project.links.repository, '_blank', 'noopener,noreferrer');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section ref={trackSection} className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Featured Projects
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Here are some of the projects I&rsquo;ve worked on, showcasing different
            technologies and approaches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                  {project.description}
                </p>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map(tech => (
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

                <div className="space-y-1">
                  {project.highlights.slice(0, 2).map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center text-xs text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {highlight}
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex space-x-3">
                  {project.links.live && (
                    <span className="text-blue-600 text-sm font-medium">
                      Live Demo
                    </span>
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
  );
}
