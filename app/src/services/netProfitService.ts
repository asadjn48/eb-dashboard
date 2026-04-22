/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase'; 

// --- Banks API ---
export const bankAPI = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, 'banks'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  add: async (data: any) => {
    const docRef = await addDoc(collection(db, 'banks'), data);
    return { id: docRef.id, ...data };
  },
  update: async (id: string, data: any) => {
    const docRef = doc(db, 'banks', id);
    await updateDoc(docRef, data);
  },
  delete: async (id: string) => {
    const docRef = doc(db, 'banks', id);
    await deleteDoc(docRef);
  }
};

export const distributionAPI = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, 'distributions'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  add: async (data: any) => {
    const docRef = await addDoc(collection(db, 'distributions'), data);
    return { id: docRef.id, ...data };
  },
  update: async (id: string, data: any) => {
    const docRef = doc(db, 'distributions', id);
    await updateDoc(docRef, data);
  },
  delete: async (id: string) => {
    const docRef = doc(db, 'distributions', id);
    await deleteDoc(docRef);
  }
};