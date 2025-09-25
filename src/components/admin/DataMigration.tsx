import { useState } from 'react'
import { portfolioService } from '../../services/portfolioService'
import { profileData, projectsData } from '../../data/portfolio-data'

export default function DataMigration() {
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMigration = async () => {
    setMigrating(true)
    setError(null)

    try {
      console.log('🚀 Starting data migration to Firestore...')

      // Migrate profile data
      console.log('📝 Migrating profile data...')
      await portfolioService.updateProfile({
        name: profileData.name,
        title: profileData.title,
        summary: profileData.summary,
        location: profileData.location,
        email: profileData.email,
        phone: profileData.phone,
        resumeUrl: profileData.resumeUrl
      })
      console.log('✅ Profile data migrated successfully')

      // Migrate projects data
      console.log('🚀 Migrating projects data...')
      for (const project of projectsData) {
        await portfolioService.addProject({
          title: project.title,
          description: project.description,
          technologies: project.technologies,
          category: project.category,
          status: project.status as any,
          highlights: project.highlights,
          links: project.links
        })
        console.log(`✅ Project "${project.title}" migrated successfully`)
      }

      // Migrate skills data
      console.log('⚡ Migrating skills data...')
      for (const skill of profileData.skills) {
        await portfolioService.addSkill({
          name: skill.name,
          category: skill.category,
          level: skill.level
        })
        console.log(`✅ Skill "${skill.name}" migrated successfully`)
      }

      setMigrated(true)
      console.log('🎉 Data migration completed successfully!')

    } catch (error) {
      console.error('❌ Error during migration:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setMigrating(false)
    }
  }

  if (migrated) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Migration Completed Successfully!</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>All portfolio data has been migrated to Firestore:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Profile information</li>
                <li>{projectsData.length} projects</li>
                <li>{profileData.skills.length} skills</li>
              </ul>
              <p className="mt-2">You can now refresh the page to see data loaded from Firestore.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Initialize Firestore Data</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Click below to migrate your portfolio data from static files to Firestore.</p>
              <p className="text-xs text-blue-600 mt-1">
                This is a one-time operation that will populate your Firestore database.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleMigration}
          disabled={migrating}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {migrating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Migrating...</span>
            </>
          ) : (
            <span>Migrate Data</span>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            <strong>Migration Error:</strong> {error}
          </p>
        </div>
      )}
    </div>
  )
}