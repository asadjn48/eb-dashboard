

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
//   alumniSize: number;
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

// export interface ProjectFilters {
//   type?: ProjectType;
//   status?: ProjectStatus;
//   search?: string;
//   sortBy?: 'profit' | 'budget' | 'date';
// }

// // ==========================================
// // 4. TEAM & EMPLOYEES
// // ==========================================
// // ADDED THESE BACK TO FIX BUILD ERRORS
// export type Department = 'Graphic Designer' | 'Web Developer' | 'App Developer' | 'Instructor' | 'AI Engineer' | 'Management' | 'Other';
// export type EmployeeType = 'on-site' | 'remote' | 'hybrid' | 'alumni';

// export interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   designation: string;
//   department: string; // Keeping as string to allow flexibility, or use Department
//   type: EmployeeType; 
//   status: 'active' | 'inactive' | 'terminated';
//   joinDate: string;
//   salary: number;
//   avatar?: string;

//   // Exit Details
//   exitDate?: string;
//   exitType?: string;
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
// // 6. INCOME & BUDGET
// // ==========================================
// export interface Income {
//   id: string;
//   source: string;
//   amount: number;
//   date: string;
//   description?: string;
// }

// // ==========================================
// // 7. UTILITIES
// // ==========================================
export type NoteCategory = 'Work' | 'Personal' | 'Ideas' | 'Urgent' | 'To-Do';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  date: string;
  isPinned?: boolean;
}

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
// // 1. AUTH & USER
// // ==========================================
// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: 'admin' | 'manager' | 'executive'; // Updated per PDF
//   avatar?: string;
// }

// // ==========================================
// // 2. DASHBOARD & ANALYTICS
// // ==========================================
// // Matches the 6 cards in the Image/PDF
// export interface KPIData {
//   totalIncome: number;
//   netProfit: number;
//   totalExpenses: number;
//   activeProjects: number;
//   teamSize: number;
//   projectMargin: number; // New: % value
  
//   // New Checklist items
//   alumniCount: number;
//   taxPaid: number;
// }

// // ==========================================
// // 3. FINANCIALS (Profit, Debt, Security)
// // ==========================================
// // New: For the "Net Profit" module requirements
// export interface FinancialRecord {
//   id: string;
//   type: 'debt' | 'investment' | 'loan' | 'security';
//   amount: number;
//   description: string;
//   date: string;
//   status: 'active' | 'repaid' | 'refunded'; // For Security/Debt tracking
//   refundDate?: string;
// }

// export interface ProfitDistribution {
//   bankAmount: number;
//   cashInHand: number;
//   totalDebt: number;
//   totalInvestments: number;
//   securityDeposits: number;
// }

// // ==========================================
// // 4. PROJECTS
// // ==========================================
// export type ProjectStatus = 'active' | 'completed' | 'on-hold';

// export interface Project {
//   id: string;
//   name: string;
//   clientName: string;
//   description?: string;
//   status: ProjectStatus;
  
//   // Financials
//   budget: number; // Total Value
//   receivedAmount: number;
//   pendingAmount: number;
//   expenses: number;
//   margin: number; // Calculated Profit Margin
  
//   startDate: string;
//   completionDate?: string;
//   progress: number; // 0-100
// }

// // ==========================================
// // 5. TEAM, ALUMNI & PAYROLL
// // ==========================================
// export type Department = 'Design' | 'Development' | 'Marketing' | 'Management';

// export interface TeamMember {
//   id: string;
//   name: string;
//   role: string;
//   email: string;
//   phone: string;
//   status: 'active' | 'alumni'; // Combined Team/Alumni logic
//   joinDate: string;
//   leaveDate?: string; // For Alumni
//   salary: number;
  
//   // Performance (0-100 or 1-5 scale)
//   performanceRating: number;
//   reputationScore: number;
// }

// export interface PayrollRecord {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   month: string; // "2023-10"
//   baseSalary: number;
//   bonuses: number;
//   deductions: number;
//   netSalary: number; // Calculated
//   status: 'paid' | 'unpaid';
//   paymentDate?: string;
// }

// // ==========================================
// // 6. GLOBAL SETTINGS
// // ==========================================
// export interface CompanySettings {
//   name: string;
//   logo?: string;
//   address?: string;
//   currency: string;
//   // Removed "primaryColor" as we are enforcing the Soft Palette
// }


















// ==========================================
// 1. AUTH & USER
// ==========================================
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'executive';
  avatar?: string;
}

// ==========================================
// 2. DASHBOARD & ANALYTICS
// ==========================================
export interface KPIData {
  totalIncome: number;
  netProfit: number;
  totalExpenses: number;
  activeProjects: number;
  teamSize: number;      // Active Employees only
  alumniCount: number;   // Alumni only
  projectMargin: number; 
  taxPaid: number;
  salaryExpenses: number; // Fixed: Added this property
  projectExpenses: number;
}



// Fixed: Explicitly exporting these for Charts
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
// 3. FINANCIALS
// ==========================================
export interface FinancialRecord {
  id: string;
  type: 'debt' | 'investment' | 'loan' | 'security';
  amount: number;
  description: string;
  date: string;
  status: 'active' | 'repaid' | 'refunded';
  refundDate?: string;
}

export interface ProfitDistribution {
  bankAmount: number;
  cashInHand: number;
  totalDebt: number;
  totalInvestments: number;
  securityDeposits: number;
}

// ==========================================
// 4. PROJECTS
// ==========================================
// export type ProjectStatus = 'active' | 'completed' | 'on-hold';

// export interface Project {
//   id: string;
//   name: string;
//   clientName: string;
//   description?: string;
//   status: ProjectStatus;
//   budget: number;
//   expenses: number;
//   profit?: number; // Optional as it's calculated
//   startDate: string;
//   completionDate?: string;
//   progress: number;
// }



// export interface ProjectTransaction {
//   id: string;
//   projectId: string;
//   amount: number;
//   date: string;
//   type: 'payment' | 'refund' | 'adjustment';
//   method?: 'cash' | 'bank' | 'cheque' | 'online';
//   notes?: string;
//   recordedBy?: string;
// }










// ==========================================
// EXISTING TYPES (Keep your User, etc.)
// ==========================================

// ... (your existing User interface, etc.)

// ==========================================
// PROJECT RELATED TYPES (Update/Add these)
// ==========================================

export type ProjectStatus = 'active' | 'completed' | 'on-hold';

export interface Project {
  id: string;
  name: string;
  // Support both naming conventions just in case
  clientName: string; 
  client?: string; 
  
  description?: string;
  status: ProjectStatus;
  
  // Financials
  budget: number;
  receivedAmount?: number; // Total collected so far
  expenses?: number;
  profit?: number; // Calculated profit
  
  // Dates
  startDate: string;
  completionDate?: string;
  endDate?: string; // Fallback date field
}

// --- FIX: Add this Interface ---
export interface ProjectFilters {
  status?: ProjectStatus;
  type?: string;
  search?: string;
}

// --- FIX: Add this Interface for the Wallet Feature ---
export interface ProjectTransaction {
  id: string;
  projectId: string;
  amount: number;
  date: string;
  type: 'payment' | 'refund' | 'adjustment';
  method?: 'cash' | 'bank' | 'cheque' | 'online';
  notes?: string;
}













// ==========================================
// 5. TEAM & PAYROLL
// ==========================================
// export type Department = 'Design' | 'Development' | 'Marketing' | 'Management' | 'Other';
// export type EmployeeType = 'on-site' | 'remote' | 'hybrid' | 'alumni';

// export interface Employee {
//   [x: string]: string;
//   [x: string]: string;
//   // exitDate: boolean;
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   designation: string;
//   department: string;
//   type: EmployeeType;
//   status: 'active' | 'inactive' | 'terminated';
//   joinDate: string;
//   salary: number;
//   avatar?: string;

//   exitDate?: string; 
//   exitType?: string;
//   exitReason?: string;
// }






// src/types/index.ts

// export type EmployeeType = 'on-site' | 'remote' | 'hybrid' | 'alumni';
// export type EmployeeStatus = 'active' | 'inactive' | 'terminated';

// export interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   designation: string;
//   department: string;
//   type: EmployeeType;
//   status: EmployeeStatus;
  
//   // Financials
//   salary: number; // This MUST be number
  
//   // Dates
//   joinDate: string;
  
//   // Assets
//   avatar?: string;

//   // NEW FIELDS (Add these to fix the errors)
//   bankName?: string;
//   accountNumber?: string;
//   currentAddress?: string;
//   homeAddress?: string;

//   // Exit Info
//   exitDate?: string;
//   exitType?: string;
//   exitReason?: string;
// }




// src/types/index.ts

export type EmployeeType = 'on-site' | 'remote' | 'hybrid' | 'alumni';
export type EmployeeStatus = 'active' | 'inactive' | 'terminated';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  designation: string;
  department: string;
  type: EmployeeType;
  status: EmployeeStatus;
  
  // Financials
  salary: number; 
  salaryStartDate?: string; // NEW: To handle custom cycles (e.g., 16th of month)
  
  joinDate: string;
  avatar?: string;
  
  // Bank & Address
  bankName?: string;
  accountNumber?: string;
  currentAddress?: string;
  homeAddress?: string;

  // Exit Info
  exitDate?: string;
  exitType?: string;
  exitReason?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation?: string; 
  mobile?: string;
  
  // Financials
  baseSalary: number;
  bonuses: number;
  deductions: number;
  tax: number;
  netSalary: number;
  
  // Meta
  status: 'paid' | 'pending';
  month: string; 
  paidDate: string;
  
  // FIXED: Added 'reimbursement' to allowable types
  method: 'bank' | 'cash' | 'cheque' | 'transfer' | 'reimbursement'; 
  notes?: string;
}





// export interface PayrollRecord {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   department: string;
//   designation?: string; 
//   mobile?: string;      
//   month: string;
//   baseSalary: number;
//   bonuses: number;
//   deductions: number;
//   tax: number;
//   netSalary: number;
//   // status: 'paid' | 'unpaid';
//   // paidDate?: string;
//   //  method: 'bank' | 'cash' | 'cheque' | 'transfer'; 
//   notes?: string;
// }









// ==========================================
// 6. INCOME & SETTINGS
// ==========================================
export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

export interface CompanySettings {
  name: string;
  logo?: string;
  address?: string;
  currency: string;
}