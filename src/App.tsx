import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { usePageTracking } from './hooks/useAnalytics'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProfileSection from './components/portfolio/ProfileSection'
import ProjectsSection from './components/portfolio/ProjectsSection'
import SkillsSection from './components/portfolio/SkillsSection'
import FloatingChatbot from './components/chat/FloatingChatbot'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'

function PortfolioPage() {
  usePageTracking()

  return (
    <div className="min-h-screen">
      <ProfileSection />
      <ProjectsSection />
      <SkillsSection />
      <FloatingChatbot />

      {/* Admin Access Button */}
      <div className="fixed bottom-4 left-4 z-40">
        <a
          href="/admin"
          className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full shadow-lg text-xs opacity-20 hover:opacity-100 transition-all duration-300"
          title="Admin Access"
        >
          ⚙️
        </a>
      </div>
    </div>
  )
}

function AdminRoute() {
  const { user, isAdmin } = useAuth()

  if (!user) {
    return <AdminLogin />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this area.</p>
          <a href="/" className="text-green-600 hover:text-green-700">Return to Portfolio</a>
        </div>
      </div>
    )
  }

  return <AdminDashboard />
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/admin" element={<AdminRoute />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App