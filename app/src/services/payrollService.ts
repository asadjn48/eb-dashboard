
import { db } from '@/firebase'; 
import { 
  collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, orderBy 
} from 'firebase/firestore';
import type { PayrollRecord } from '@/types';

const COLLECTION_NAME = 'payroll';

export const payrollAPI = {
  // ... (Keep getAll, add, delete as they were) ...

  getAll: async (): Promise<PayrollRecord[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('paidDate', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PayrollRecord[];
    } catch (error) { console.error("Fetch error:", error); return []; }
  },

  add: async (record: PayrollRecord) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = record;
    const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
    return { ...record, id: docRef.id };
  },

  delete: async (id: string) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },

  // NEW: Update transaction (Edit capability)
  update: async (id: string, updates: Partial<PayrollRecord>) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
  }
};