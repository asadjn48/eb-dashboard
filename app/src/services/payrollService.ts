import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import type { PayrollRecord } from '../types';

const COLLECTION_NAME = 'payroll';

export const payrollAPI = {
  getAll: async (): Promise<PayrollRecord[]> => {
    try {
      const ref = collection(db, COLLECTION_NAME);
      const q = query(ref, orderBy('month', 'desc')); // Assuming you sort by month
      const snapshot = await getDocs(q);
      
      // If no records exist yet, we might want to return empty or mock data
      // For now, let's return what's in the DB
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PayrollRecord));
    } catch (error) {
      console.error("Error fetching payroll:", error);
      return [];
    }
  },

  getSummary: async () => {
    // This logic should ideally be backend or calculated from getAll()
    // For now, we'll return a placeholder structure that the UI expects
    // The UI actually calculates some of this itself, but let's provide the API structure
    return {
      totalPaid: 0,
      totalUnpaid: 0,
      totalAmount: 0
    };
  }
};