import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc,
  updateDoc, // Import updateDoc
  query, 
  orderBy 
} from 'firebase/firestore';
import type { Expense } from '../types';

const COLLECTION_NAME = 'expenses';

export const expensesAPI = {
  // 1. Get All
  getAll: async (): Promise<Expense[]> => {
    try {
      const ref = collection(db, COLLECTION_NAME);
      const q = query(ref, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Expense));
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }
  },

  // 2. Add
  add: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), expense);
      return { id: docRef.id, ...expense };
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  },

  // 3. Update (New)
  update: async (id: string, data: Partial<Expense>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  },

  // 4. Delete
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  }
};