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
}

export const portfolioService = new PortfolioService()