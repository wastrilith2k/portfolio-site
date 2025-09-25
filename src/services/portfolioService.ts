import { db } from '../config/firebase'
import { doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { profileData, projectsData } from '../data/portfolio-data'

export interface ProfileData {
  name: string
  title: string
  summary: string
  location: string
  email: string
  phone: string
  resumeUrl: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface Skill {
  id?: string
  name: string
  category: string
  level: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  category: string
  status: 'completed' | 'ongoing' | 'archived'
  highlights: string[]
  links: {
    repository?: string
    live?: string
  }
}

export interface ChatbotContext {
  context: string
  updatedAt: string
}

class PortfolioService {
  // Profile methods
  async getProfile(): Promise<ProfileData> {
    try {
      const docRef = doc(db, 'portfolio', 'profile')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return docSnap.data() as ProfileData
      } else {
        // Initialize with default data if doesn't exist
        await this.updateProfile(profileData)
        return profileData
      }
    } catch (error) {
      console.error('Error getting profile:', error)
      return profileData // Fallback to static data
    }
  }

  async updateProfile(data: ProfileData): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'profile')
      await setDoc(docRef, data)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  // Skills methods
  async getSkills(): Promise<Skill[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'skills'))

      if (querySnapshot.empty) {
        // Initialize with default data if collection is empty
        await this.initializeSkills()
        return profileData.skills
      }

      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name,
          category: data.category,
          level: data.level
        } as Skill
      })
    } catch (error) {
      console.error('Error getting skills:', error)
      return profileData.skills // Fallback to static data
    }
  }

  async addSkill(skill: Omit<Skill, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'skills'), skill)
    } catch (error) {
      console.error('Error adding skill:', error)
      throw error
    }
  }

  async updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
    try {
      const docRef = doc(db, 'skills', id)
      await updateDoc(docRef, skill)
    } catch (error) {
      console.error('Error updating skill:', error)
      throw error
    }
  }

  async deleteSkill(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'skills', id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting skill:', error)
      throw error
    }
  }

  private async initializeSkills(): Promise<void> {
    try {
      const promises = profileData.skills.map(skill =>
        addDoc(collection(db, 'skills'), skill)
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Error initializing skills:', error)
    }
  }

  // Projects methods
  async getProjects(): Promise<Project[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'))

      if (querySnapshot.empty) {
        // Initialize with default data if collection is empty
        await this.initializeProjects()
        return projectsData
      }

      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Project))
    } catch (error) {
      console.error('Error getting projects:', error)
      return projectsData // Fallback to static data
    }
  }

  async addProject(project: Omit<Project, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'projects'), project)
    } catch (error) {
      console.error('Error adding project:', error)
      throw error
    }
  }

  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    try {
      const docRef = doc(db, 'projects', id)
      await updateDoc(docRef, project)
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'projects', id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  private async initializeProjects(): Promise<void> {
    try {
      const promises = projectsData.map(project =>
        addDoc(collection(db, 'projects'), project)
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Error initializing projects:', error)
    }
  }

  // Social Links methods
  async getSocialLinks(): Promise<SocialLink[]> {
    try {
      const docRef = doc(db, 'portfolio', 'profile')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        return data.socialLinks || profileData.socialLinks
      }

      return profileData.socialLinks
    } catch (error) {
      console.error('Error getting social links:', error)
      return profileData.socialLinks
    }
  }

  async updateSocialLinks(socialLinks: SocialLink[]): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'profile')
      await updateDoc(docRef, { socialLinks })
    } catch (error) {
      console.error('Error updating social links:', error)
      throw error
    }
  }

  // Chatbot Context methods
  async getChatbotContext(): Promise<string> {
    try {
      const docRef = doc(db, 'portfolio', 'chatbot-context')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as ChatbotContext
        return data.context
      }

      // Return default context if not found
      return this.getDefaultChatbotContext()
    } catch (error) {
      console.error('Error getting chatbot context:', error)
      return this.getDefaultChatbotContext()
    }
  }

  async updateChatbotContext(context: string): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'chatbot-context')
      await setDoc(docRef, {
        context,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating chatbot context:', error)
      throw error
    }
  }

  private getDefaultChatbotContext(): string {
    return `You are an AI assistant representing James Nicholas, a Senior Frontend Engineer based in Portland, OR.

KEY INFORMATION ABOUT JAMES:
- Senior Frontend Engineer with 8+ years React experience
- Currently building modern web applications with React, TypeScript, and Firebase
- Email: james@01webdevelopment.com
- GitHub: https://github.com/wastrilith2k
- LinkedIn: https://www.linkedin.com/in/james-nicholas-1a81534/

TECHNICAL SKILLS:
- Languages: JavaScript, TypeScript, Python, Java, PHP
- Frontend: React, Next.js, Tailwind CSS, CSS, React Query
- Backend: Node.js, PostgreSQL, REST APIs, GraphQL, MySQL
- DevOps: Docker, Git, CI/CD, Jenkins, Webpack
- Cloud: AWS, Firebase, Microsoft Azure, Google Cloud Platform

KEY PROJECTS:
1. Solo Adventuring with AI - AI-powered D&D Game Master with React, Firebase, Google Gemini Pro
2. Solo Adventuring Mobile - React Native companion app with TypeScript and Firebase
3. Portfolio Site - This interactive portfolio with admin system, AI chatbot, Firebase integration, and responsive design

EXPERIENCE HIGHLIGHTS:
- Built reusable UI components and integrated with back-end services
- Enhanced deployment efficiency and reduced operational costs
- Expertise in translating user requirements into efficient code
- Collaborative work with designers to ensure responsive user experience
- Strong background in React ecosystem, microservices, and cloud platforms

Respond as a knowledgeable assistant that can discuss James's background, skills, and projects in detail.

IMPORTANT: When users ask for detailed information about James's experience, skills, or want to see his work, encourage them to also check:
- LinkedIn: https://www.linkedin.com/in/james-nicholas-1a81534/ for professional experience and recommendations
- GitHub: https://github.com/wastrilith2k for code examples and project repositories

Always provide helpful information first, then suggest these resources for more detailed exploration.`
  }
}

export const portfolioService = new PortfolioService()