
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  deleteDoc,
} from 'firebase/firestore';
import type { Project, ProjectFilters } from '../types';

const COLLECTION_NAME = 'projects';

export const projectAPI = {
  // 1. Get All Projects
  getAll: async (filters?: ProjectFilters): Promise<Project[]> => {
    try {
      const ref = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(ref);
      
      let projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));

      // Client-side filtering
      if (filters) {
        if (filters.type) {
           projects = projects.filter(p => p.type === filters.type);
        }
        if (filters.status) {
           projects = projects.filter(p => p.status === filters.status);
        }
        if (filters.search) {
          const s = filters.search.toLowerCase();
          projects = projects.filter(p => 
            p.name.toLowerCase().includes(s) || 
            p.client.toLowerCase().includes(s)
          );
        }
      }
      return projects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  },

  // 2. Get Single Project
  getById: async (id: string): Promise<Project | undefined> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Project;
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching project:", error);
      return undefined;
    }
  },

  // 3. Add Project
  add: async (project: Omit<Project, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), project);
      return docRef.id;
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  },

  // 4. Update Project
  update: async (id: string, data: Partial<Project>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  // 5. Delete Project
  delete: async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
  }
};