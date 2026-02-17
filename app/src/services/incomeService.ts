


import { db } from '@/firebase'; 
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import type { Income } from '@/types';

const COLLECTION_NAME = 'income';

export const incomeAPI = {
  getAll: async (): Promise<Income[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Income[];
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  },

  add: async (income: Omit<Income, 'id'>) => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), income);
    return { ...income, id: docRef.id };
  },

  // FIX: Added delete method
  delete: async (id: string) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};