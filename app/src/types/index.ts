// // Auth Types
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

// // Dashboard KPI Types
// export interface KPIData {
//   totalIncome: number;
//   netProfit: number;
//   totalExpenses: number;
//   activeProjects: number;
//   projectExpenses: number;
//   taxExpenses: number;
//   salaryExpenses: number;
//   teamSize: number;
// }

// // Project Types

// export type ProjectType = 'funded' | 'commercial';
// export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'cancelled';

// // CHANGED: Allow string so custom inputs work without TS errors
// export type FundedProjectSource = string; 
// export type CommercialProjectType = string;

// export interface Project {
//   id: string;
//   name: string;
//   type: ProjectType;
//   subType: string;
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

















// // Team Types
// export type EmployeeType = 'on-site' | 'remote' | 'alumni';
// export type Department = 'Graphic Designer' | 'Web Developer' | 'App Developer' | 'Instructor' | 'AI Engineer';

// // src/types/index.ts

// export interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   designation: string;
//   department: string;
//   type: string;
//   status: 'active' | 'inactive';
//   joinDate: string;
//   salary: number;
//   avatar?: string;
//   phone?: string;
  
//   // --- EXIT DETAILS ---
//   exitDate?: string;   // When they left
//   exitType?: string;   // Resigned, Fired, etc.
//   exitReason?: string; // Why they left
// }

// // ... keep other types



// // src/types/index.ts

// export interface CompanySettings {
//   name: string;
//   logo?: string;
//   address: string;
//   phone: string;
//   email: string;
//   primaryColor: string;
//   // Make these optional if you want to keep them in DB but ignore in UI
//   // currency?: string; 
//   // taxPercentage?: number;
// }


// // Add this to your existing types
// export type NoteCategory = 'Work' | 'Personal' | 'Ideas' | 'Urgent' | 'To-Do';

// export interface Note {
//   id: string;
//   title: string;
//   content: string;
//   category: NoteCategory;
//   date: string;
//   isPinned?: boolean; // For future pinning feature
// }






// // Payroll Types
// export type PayrollStatus = 'paid' | 'unpaid';

// export interface PayrollRecord {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   department: Department;
//   month: string;
//   year: number;
//   baseSalary: number;
//   bonuses: number;
//   deductions: number;
//   tax: number;
//   netSalary: number;
//   status: PayrollStatus;
//   paidDate?: string;
// }

// // Expense Types
// export type ExpenseCategory = 'Rent' | 'WiFi' | 'Electricity' | 'Food' | 'Maintenance' | 'Guest' | 'Other';

// export interface Expense {
//   id: string;
//   category: ExpenseCategory;
//   amount: number;
//   date: string;
//   description: string;
//   isRecurring: boolean;
//   status: 'paid' | 'pending';
// }

// // Portfolio Types
// export interface PortfolioProject {
//   id: string;
//   name: string;
//   description: string;
//   techStack: string[];
//   imageUrl?: string;
//   liveUrl?: string;
//   githubUrl?: string;
//   status: 'completed' | 'in-progress' | 'maintenance';
//   completionDate?: string;
//   clientName?: string;
// }

// // Chart Data Types
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
 
// // Settings Types
// export interface CompanySettings {
//   name: string;
//   logo?: string;
//   address: string;
//   phone: string;
//   email: string;
//   currency: string;
//   taxPercentage: number;
// }

// // Filter Types
// export interface ProjectFilters {
//   type?: ProjectType;
//   status?: ProjectStatus;
//   search?: string;
//   sortBy?: 'profit' | 'budget' | 'date';
// }

// export interface TeamFilters {
//   department?: Department;
//   type?: EmployeeType;
//   status?: 'active' | 'inactive';
//   search?: string;
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
  alumniSize: number; // Added for Dashboard
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
  subType: string; // Flexible string for custom types
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
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  designation: string;
  department: string;
  type: 'on-site' | 'remote' | 'hybrid'; 
  status: 'active' | 'inactive' | 'terminated'; // Unified Status
  joinDate: string; // ISO Date
  salary: number;
  avatar?: string;

  // Exit Details (For Alumni)
  exitDate?: string;
  exitType?: string;   // e.g. Resigned, Terminated
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
  | 'Salaries'   // Critical for Dashboard
  | 'Tax'        // Critical for Dashboard
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
// 6. UTILITIES (Notes & Settings)
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







// ==========================================
// 7. INCOME & BUDGET
// ==========================================
export interface Income {
  id: string;
  source: string; // e.g. "Project Advance", "Investor Funding", "Personal Injection"
  amount: number;
  date: string;
  description?: string;
}