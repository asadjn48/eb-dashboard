// // ==========================================
// // 1. AUTH & USER
// // ==========================================
// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: 'admin' | 'manager' | 'employee';
//   avatar?: string;
// }

// export interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// }

// // ==========================================
// // 2. DASHBOARD & ANALYTICS
// // ==========================================
// export interface KPIData {
//   totalIncome: number;
//   totalExpenses: number;
//   netProfit: number;
//   activeProjects: number;
//   teamSize: number;
//   alumniSize: number; // Added for Dashboard
//   projectExpenses: number;
//   taxExpenses: number;
//   salaryExpenses: number;
// }

// export interface ChartDataPoint {
//   name: string;
//   value: number;
//   [key: string]: string | number;
// }

// export interface MonthlyFinancialData {
//   month: string;
//   income: number;
//   expenses: number;
//   profit: number;
// }

// // ==========================================
// // 3. PROJECTS
// // ==========================================
// export type ProjectType = 'funded' | 'commercial';
// export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'cancelled';

// export interface Project {
//   id: string;
//   name: string;
//   type: ProjectType;
//   subType: string; // Flexible string for custom types
//   client: string;
//   budget: number;
//   expenses: number;
//   profit: number;
//   startDate: string;
//   endDate: string;
//   status: ProjectStatus;
//   progress: number;
//   description?: string;
// }

// export interface ProjectFilters {
//   type?: ProjectType;
//   status?: ProjectStatus;
//   search?: string;
//   sortBy?: 'profit' | 'budget' | 'date';
// }

// // ==========================================
// // 4. TEAM & EMPLOYEES
// // ==========================================
// export interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   designation: string;
//   department: string;
//   type: 'on-site' | 'remote' | 'hybrid'; 
//   status: 'active' | 'inactive' | 'terminated'; // Unified Status
//   joinDate: string; // ISO Date
//   salary: number;
//   avatar?: string;

//   // Exit Details (For Alumni)
//   exitDate?: string;
//   exitType?: string;   // e.g. Resigned, Terminated
//   exitReason?: string;
// }

// export interface TeamFilters {
//   department?: string;
//   type?: string;
//   status?: string;
//   search?: string;
// }

// // ==========================================
// // 5. FINANCE (Expenses & Payroll)
// // ==========================================
// export type ExpenseCategory = 
//   | 'Rent' 
//   | 'WiFi' 
//   | 'Electricity' 
//   | 'Food' 
//   | 'Maintenance' 
//   | 'Guest' 
//   | 'Salaries'   // Critical for Dashboard
//   | 'Tax'        // Critical for Dashboard
//   | 'Equipment'
//   | 'Software'
//   | 'Other';

// export interface Expense {
//   id: string;
//   description: string;
//   amount: number;
//   category: ExpenseCategory;
//   date: string;
//   status: 'paid' | 'pending';
//   isRecurring?: boolean;
// }

// export interface PayrollRecord {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   department: string;
//   month: string;
//   year: number;
//   baseSalary: number;
//   bonuses: number;
//   deductions: number;
//   tax: number;
//   netSalary: number;
//   status: 'paid' | 'unpaid';
//   paidDate?: string;
// }

// // ==========================================
// // 6. UTILITIES (Notes & Settings)
// // ==========================================
// export type NoteCategory = 'Work' | 'Personal' | 'Ideas' | 'Urgent' | 'To-Do';

// export interface Note {
//   id: string;
//   title: string;
//   content: string;
//   category: NoteCategory;
//   date: string;
//   isPinned?: boolean;
// }

// export interface CompanySettings {
//   name: string;
//   logo?: string;
//   address: string;
//   phone: string;
//   email: string;
//   primaryColor: string;
//   currency?: string;
//   taxPercentage?: number;
// }







// // ==========================================
// // 7. INCOME & BUDGET
// // ==========================================
// export interface Income {
//   id: string;
//   source: string; // e.g. "Project Advance", "Investor Funding", "Personal Injection"
//   amount: number;
//   date: string;
//   description?: string;
// }





























// ==========================================
// 1. AUTH & USER
// ==========================================
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ==========================================
// 2. DASHBOARD & ANALYTICS
// ==========================================
export interface KPIData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  activeProjects: number;
  teamSize: number;
  alumniSize: number;
  projectExpenses: number;
  taxExpenses: number;
  salaryExpenses: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface MonthlyFinancialData {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

// ==========================================
// 3. PROJECTS
// ==========================================
export type ProjectType = 'funded' | 'commercial';
export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'cancelled';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  subType: string;
  client: string;
  budget: number;
  expenses: number;
  profit: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  progress: number;
  description?: string;
}

export interface ProjectFilters {
  type?: ProjectType;
  status?: ProjectStatus;
  search?: string;
  sortBy?: 'profit' | 'budget' | 'date';
}

// ==========================================
// 4. TEAM & EMPLOYEES
// ==========================================
// ADDED THESE BACK TO FIX BUILD ERRORS
export type Department = 'Graphic Designer' | 'Web Developer' | 'App Developer' | 'Instructor' | 'AI Engineer' | 'Management' | 'Other';
export type EmployeeType = 'on-site' | 'remote' | 'hybrid' | 'alumni';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  designation: string;
  department: string; // Keeping as string to allow flexibility, or use Department
  type: EmployeeType; 
  status: 'active' | 'inactive' | 'terminated';
  joinDate: string;
  salary: number;
  avatar?: string;

  // Exit Details
  exitDate?: string;
  exitType?: string;
  exitReason?: string;
}

export interface TeamFilters {
  department?: string;
  type?: string;
  status?: string;
  search?: string;
}

// ==========================================
// 5. FINANCE (Expenses & Payroll)
// ==========================================
export type ExpenseCategory = 
  | 'Rent' 
  | 'WiFi' 
  | 'Electricity' 
  | 'Food' 
  | 'Maintenance' 
  | 'Guest' 
  | 'Salaries'
  | 'Tax'
  | 'Equipment'
  | 'Software'
  | 'Other';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  status: 'paid' | 'pending';
  isRecurring?: boolean;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  year: number;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  tax: number;
  netSalary: number;
  status: 'paid' | 'unpaid';
  paidDate?: string;
}

// ==========================================
// 6. INCOME & BUDGET
// ==========================================
export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  description?: string;
}

// ==========================================
// 7. UTILITIES
// ==========================================
export type NoteCategory = 'Work' | 'Personal' | 'Ideas' | 'Urgent' | 'To-Do';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  date: string;
  isPinned?: boolean;
}

export interface CompanySettings {
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  primaryColor: string;
  currency?: string;
  taxPercentage?: number;
}