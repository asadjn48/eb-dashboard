import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import type { Income } from '../types';

const COLLECTION_NAME = 'income';

export const incomeAPI = {
  // 1. Get All Income Records
  getAll: async (): Promise<Income[]> => {
    try {
      const ref = collection(db, COLLECTION_NAME);
      const q = query(ref, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Income));
    } catch (error) {
      console.error("Error fetching income:", error);
      return [];
    }
  },

  // 2. Add New Budget/Income
  add: async (income: Omit<Income, 'id'>): Promise<Income> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), income);
      return { id: docRef.id, ...income };
    } catch (error) {
      console.error("Error recording income:", error);
      throw error;
    }
  }
};