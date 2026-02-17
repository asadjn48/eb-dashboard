/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import type { Project, ProjectFilters, ProjectTransaction } from '../types';

const COLLECTION_NAME = 'projects';
const TRANS_COLLECTION = 'project_transactions';

export const projectAPI = {
  // 1. Get All Projects (With Auto-Complete & Filters)
  getAll: async (filters?: ProjectFilters): Promise<Project[]> => {
    try {
      const ref = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(ref);
      
      let projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));

      // Auto-Update Status Logic
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await Promise.all(projects.map(async (p) => {
        if (p.status === 'active' && p.completionDate) {
          const endDate = new Date(p.completionDate);
          if (today > endDate) {
            try {
              await updateDoc(doc(db, COLLECTION_NAME, p.id), { status: 'completed' });
              p.status = 'completed'; 
            } catch (err) { console.error(err); }
          }
        }
      }));

      // Client-side filtering
      if (filters) {
        if (filters.status) projects = projects.filter(p => p.status === filters.status);
        if (filters.search) {
          const s = filters.search.toLowerCase();
          projects = projects.filter(p => 
            (p.name || '').toLowerCase().includes(s) || 
            (p.clientName || (p as any).client || '').toLowerCase().includes(s)
          );
        }
      }
      return projects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  },

  getById: async (id: string): Promise<Project | undefined> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Project;
      return undefined;
    } catch (error) { return undefined; }
  },

  add: async (project: Omit<Project, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), project);
    return docRef.id;
  },

  update: async (id: string, data: Partial<Project>): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },

  // --- FINANCIAL TRANSACTION METHODS ---

  addTransaction: async (transaction: Omit<ProjectTransaction, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, TRANS_COLLECTION), transaction);
      // AUTO-UPDATE: Recalculate the project's total received amount
      await projectAPI.recalculateProjectFinancials(transaction.projectId);
      return docRef;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  getTransactions: async (projectId: string): Promise<ProjectTransaction[]> => {
    try {
      // FIXED: Removed 'orderBy' to avoid Firestore Index errors
      const q = query(
        collection(db, TRANS_COLLECTION), 
        where('projectId', '==', projectId)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectTransaction));
      
      // Sort in JavaScript instead
      return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  },

  deleteTransaction: async (id: string, projectId: string) => {
    try {
      await deleteDoc(doc(db, TRANS_COLLECTION, id));
      // AUTO-UPDATE: Recalculate after delete
      await projectAPI.recalculateProjectFinancials(projectId);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },

  // Helper to keep the main Project document in sync
  recalculateProjectFinancials: async (projectId: string) => {
    try {
        const trans = await projectAPI.getTransactions(projectId);
        const totalReceived = trans
            .filter(t => t.type === 'payment')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        await updateDoc(doc(db, COLLECTION_NAME, projectId), {
            receivedAmount: totalReceived
        });
    } catch (e) {
        console.error("Failed to recalculate financials", e);
    }
  }
};