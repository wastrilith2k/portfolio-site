import { BrowserRouter as Router } from 'react-router-dom'
import { usePageTracking } from './hooks/useAnalytics'
import ProfileSection from './components/portfolio/ProfileSection'
import ProjectsSection from './components/portfolio/ProjectsSection'
import SkillsSection from './components/portfolio/SkillsSection'
import ChatSection from './components/chat/ChatSection'

function AppContent() {
  usePageTracking() // Track page views automatically

  return (
    <div className="min-h-screen">
      <ProfileSection />
      <ProjectsSection />
      <SkillsSection />
      <ChatSection />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App