import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  portfolioService,
  ProfileData,
  Project,
  Skill,
} from '../../services/portfolioService';
import ChatbotEditor from './ChatbotEditor';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'projects' | 'skills' | 'chatbot'
  >('profile');

  // Data states
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState<ProfileData | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({});

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, projectsData, skillsData] = await Promise.all([
        portfolioService.getProfile(),
        portfolioService.getProjects(),
        portfolioService.getSkills(),
      ]);

      setProfile(profileData);
      setProjects(projectsData);
      setSkills(skillsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Profile methods
  const handleSaveProfile = async () => {
    if (!profileForm) return;

    setSaving(true);
    try {
      await portfolioService.updateProfile(profileForm);
      setProfile(profileForm);
      setEditingProfile(false);
      setProfileForm(null);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelProfileEdit = () => {
    setEditingProfile(false);
    setProfileForm(null);
  };

  // Project methods
  const handleAddProject = async () => {
    if (!projectForm.title || !projectForm.description) return;

    setSaving(true);
    try {
      await portfolioService.addProject({
        title: projectForm.title,
        description: projectForm.description,
        technologies: projectForm.technologies || [],
        category: projectForm.category || 'web',
        status: projectForm.status || 'ongoing',
        highlights: (projectForm.highlights || [])
          .map(line => line.trim())
          .filter(line => line.length > 0),
        links: projectForm.links || {},
      } as Project);

      await loadData();
      setShowAddProject(false);
      setProjectForm({});
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Error adding project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProject = async (id: string) => {
    if (!projectForm.title || !projectForm.description) return;

    setSaving(true);
    try {
      const cleanedProjectForm = {
        ...projectForm,
        highlights: (projectForm.highlights || [])
          .map(line => line.trim())
          .filter(line => line.length > 0),
      };
      await portfolioService.updateProject(id, cleanedProjectForm);
      await loadData();
      setEditingProject(null);
      setProjectForm({});
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setSaving(true);
    try {
      await portfolioService.deleteProject(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Skill methods
  const handleAddSkill = async () => {
    if (!skillForm.name || !skillForm.category || !skillForm.level) return;

    setSaving(true);
    try {
      await portfolioService.addSkill(skillForm as Skill);
      await loadData();
      setShowAddSkill(false);
      setSkillForm({});
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Error adding skill. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSkill = async (id: string) => {
    if (!skillForm.name || !skillForm.category || !skillForm.level) return;

    setSaving(true);
    try {
      await portfolioService.updateSkill(id, skillForm);
      await loadData();
      setEditingSkill(null);
      setSkillForm({});
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Error updating skill. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    setSaving(true);
    try {
      await portfolioService.deleteSkill(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Error deleting skill. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, name: 'Profile', icon: '👤' },
    { id: 'projects' as const, name: 'Projects', icon: '🚀' },
    { id: 'skills' as const, name: 'Skills', icon: '⚡' },
    { id: 'chatbot' as const, name: 'AI Chatbot', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Portfolio Admin
              </h1>
              <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'profile' && profile && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                {!editingProfile ? (
                  <button
                    onClick={() => {
                      setEditingProfile(true);
                      setProfileForm({ ...profile });
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelProfileEdit}
                      disabled={saving}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={
                      editingProfile ? profileForm?.name || '' : profile.name
                    }
                    onChange={e =>
                      profileForm &&
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly={!editingProfile}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={
                      editingProfile ? profileForm?.title || '' : profile.title
                    }
                    onChange={e =>
                      profileForm &&
                      setProfileForm({ ...profileForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly={!editingProfile}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary
                  </label>
                  <textarea
                    value={
                      editingProfile
                        ? profileForm?.summary || ''
                        : profile.summary
                    }
                    onChange={e =>
                      profileForm &&
                      setProfileForm({
                        ...profileForm,
                        summary: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly={!editingProfile}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={
                      editingProfile ? profileForm?.email || '' : profile.email
                    }
                    onChange={e =>
                      profileForm &&
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly={!editingProfile}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={
                      editingProfile
                        ? profileForm?.location || ''
                        : profile.location
                    }
                    onChange={e =>
                      profileForm &&
                      setProfileForm({
                        ...profileForm,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly={!editingProfile}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={
                      editingProfile ? profileForm?.phone || '' : profile.phone
                    }
                    onChange={e =>
                      profileForm &&
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly={!editingProfile}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Projects Management</h2>
                <button
                  onClick={() => setShowAddProject(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Project
                </button>
              </div>

              {/* Add Project Modal */}
              {showAddProject && (
                <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
                  <h3 className="text-lg font-semibold mb-4">
                    Add New Project
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={projectForm.title || ''}
                        onChange={e =>
                          setProjectForm({
                            ...projectForm,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={projectForm.status || 'ongoing'}
                        onChange={e =>
                          setProjectForm({
                            ...projectForm,
                            status: e.target.value as 'completed' | 'ongoing' | 'archived',
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={projectForm.description || ''}
                        onChange={e =>
                          setProjectForm({
                            ...projectForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technologies (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={projectForm.technologies?.join(', ') || ''}
                        onChange={e =>
                          setProjectForm({
                            ...projectForm,
                            technologies: e.target.value
                              .split(', ')
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repository URL
                      </label>
                      <input
                        type="url"
                        value={projectForm.links?.repository || ''}
                        onChange={e =>
                          setProjectForm({
                            ...projectForm,
                            links: {
                              ...projectForm.links,
                              repository: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Highlights (one per line)
                      </label>
                      <textarea
                        value={projectForm.highlights?.join('\n') || ''}
                        onChange={e =>
                          setProjectForm({
                            ...projectForm,
                            highlights: e.target.value.split('\n'),
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={handleAddProject}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Adding...' : 'Add Project'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddProject(false);
                        setProjectForm({});
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Projects List */}
              <div className="space-y-4">
                {projects.map(project => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {editingProject === project.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={projectForm.title || project.title}
                              onChange={e =>
                                setProjectForm({
                                  ...projectForm,
                                  title: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Status
                            </label>
                            <select
                              value={projectForm.status || project.status}
                              onChange={e =>
                                setProjectForm({
                                  ...projectForm,
                                  status: e.target.value as 'completed' | 'ongoing' | 'archived',
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              <option value="ongoing">Ongoing</option>
                              <option value="completed">Completed</option>
                              <option value="archived">Archived</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea
                              value={
                                projectForm.description || project.description
                              }
                              onChange={e =>
                                setProjectForm({
                                  ...projectForm,
                                  description: e.target.value,
                                })
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Technologies (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={
                                projectForm.technologies?.join(', ') ||
                                project.technologies.join(', ')
                              }
                              onChange={e =>
                                setProjectForm({
                                  ...projectForm,
                                  technologies: e.target.value
                                    .split(', ')
                                    .filter(Boolean),
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Repository URL
                            </label>
                            <input
                              type="url"
                              value={
                                projectForm.links?.repository ||
                                project.links.repository ||
                                ''
                              }
                              onChange={e =>
                                setProjectForm({
                                  ...projectForm,
                                  links: {
                                    ...projectForm.links,
                                    repository: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Highlights (one per line)
                            </label>
                            <textarea
                              value={
                                projectForm.highlights?.join('\n') ||
                                project.highlights.join('\n')
                              }
                              onChange={e =>
                                setProjectForm({
                                  ...projectForm,
                                  highlights: e.target.value.split('\n'),
                                })
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleUpdateProject(project.id)}
                            disabled={saving}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingProject(null);
                              setProjectForm({});
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {project.title}
                            </h3>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : project.status === 'ongoing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <div className="space-x-2">
                            <button
                              onClick={() => {
                                setEditingProject(project.id);
                                setProjectForm(project);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map(tech => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Skills Management</h2>
                <button
                  onClick={() => setShowAddSkill(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Skill
                </button>
              </div>

              {/* Add Skill Modal */}
              {showAddSkill && (
                <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
                  <h3 className="text-lg font-semibold mb-4">Add New Skill</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={skillForm.name || ''}
                        onChange={e =>
                          setSkillForm({ ...skillForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={skillForm.category || ''}
                        onChange={e =>
                          setSkillForm({
                            ...skillForm,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Category</option>
                        <option value="Language">Language</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Architecture">Architecture</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level
                      </label>
                      <select
                        value={skillForm.level || ''}
                        onChange={e =>
                          setSkillForm({ ...skillForm, level: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={handleAddSkill}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Adding...' : 'Add Skill'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSkill(false);
                        setSkillForm({});
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Skills by Category */}
              {Object.entries(
                skills.reduce(
                  (acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  },
                  {} as Record<string, Skill[]>
                )
              ).map(([category, categorySkills]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map(skill => (
                      <div
                        key={skill.id || skill.name}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        {editingSkill === (skill.id || skill.name) ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={skillForm.name || skill.name}
                              onChange={e =>
                                setSkillForm({
                                  ...skillForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <select
                              value={skillForm.level || skill.level}
                              onChange={e =>
                                setSkillForm({
                                  ...skillForm,
                                  level: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                            <div className="space-x-1">
                              <button
                                onClick={() =>
                                  handleUpdateSkill(skill.id || skill.name)
                                }
                                disabled={saving}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSkill(null);
                                  setSkillForm({});
                                }}
                                className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium">{skill.name}</h4>
                              <div className="space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingSkill(skill.id || skill.name);
                                    setSkillForm(skill);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-xs"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSkill(skill.id || skill.name)
                                  }
                                  className="text-red-600 hover:text-red-800 text-xs"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                skill.level === 'Advanced' ||
                                skill.level === 'Expert'
                                  ? 'bg-green-100 text-green-800'
                                  : skill.level === 'Intermediate'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {skill.level}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'chatbot' && <ChatbotEditor />}
        </div>
      </div>
    </div>
  );
}
