import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import type { Note } from '../types';

const COLLECTION_NAME = 'notes';

export const noteAPI = {
  getAll: async (): Promise<Note[]> => {
    try {
      const ref = collection(db, COLLECTION_NAME);
      const q = query(ref, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
    } catch (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
  },

  add: async (note: Omit<Note, 'id'>): Promise<Note> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), note);
    return { id: docRef.id, ...note };
  },

  update: async (id: string, data: Partial<Note>): Promise<void> => {
    await updateDoc(doc(db, COLLECTION_NAME, id), data);
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};