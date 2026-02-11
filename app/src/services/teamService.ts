import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, // Added Import
  getDoc} from 'firebase/firestore';
import type { Employee, TeamFilters, ChartDataPoint } from '../types';

export const teamAPI = {
  // 1. Get All Employees
  getAll: async (filters?: TeamFilters): Promise<Employee[]> => {
    try {
      const employeesRef = collection(db, 'employees');
      const snapshot = await getDocs(employeesRef);
      
      let employees = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Employee));

      // Client-side filtering
      if (filters) {
        if (filters.department) {
          employees = employees.filter(e => e.department === filters.department);
        }
        if (filters.type) {
          employees = employees.filter(e => e.type === filters.type);
        }
        if (filters.status) {
          employees = employees.filter(e => e.status === filters.status);
        }
        if (filters.search) {
          const s = filters.search.toLowerCase();
          employees = employees.filter(e => 
            e.name.toLowerCase().includes(s) || 
            e.email.toLowerCase().includes(s) ||
            e.designation.toLowerCase().includes(s)
          );
        }
      }
      return employees;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  },

  // 2. Get Single Employee by ID
  getById: async (id: string): Promise<Employee | undefined> => {
    try {
      const docRef = doc(db, 'employees', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Employee;
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching employee:", error);
      return undefined;
    }
  },

  // 3. Add New Employee
  add: async (employee: Omit<Employee, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'employees'), employee);
      return docRef.id;
    } catch (error) {
      console.error("Error adding employee:", error);
      throw error;
    }
  },

  // 4. Update Employee
  update: async (id: string, data: Partial<Employee>): Promise<void> => {
    try {
      const docRef = doc(db, 'employees', id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },

  // 5. Delete Employee (NEW)
  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'employees', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },

  // 6. Get Department Stats (for Dashboard Charts)
  getDepartmentDistribution: async (): Promise<ChartDataPoint[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'employees'));
      const dist: Record<string, number> = {};
      
      snapshot.forEach(doc => {
        const data = doc.data();
        // Only count active employees for charts
        if (data.status === 'active') {
          const dept = data.department || 'Other';
          dist[dept] = (dist[dept] || 0) + 1;
        }
      });

      return Object.keys(dist).map(key => ({ name: key, value: dist[key] }));
    } catch (error) {
      console.error("Error fetching department stats:", error);
      return [];
    }
  }
};