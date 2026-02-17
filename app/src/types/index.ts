// src/types/index.ts

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

export interface CompanySettings {
  name: string;
  logo?: string;
  address?: string;
  currency: string;
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
// 3. PROJECTS
// ==========================================
export type ProjectType = 'funded' | 'commercial';
export type ProjectStatus = 'active' | 'completed' | 'on-hold';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  subType: string;
  status: ProjectStatus;
  
  // Client Details
  clientName: string; 
  client?: string; // Kept legacy optional field if needed

  // Team
  assignedTo?: string[]; 

  // Dates
  startDate: string;
  completionDate?: string;
  endDate?: string; // Fallback date field

  // Progress & Details
  progress: number;
  description?: string;

  // Financials
  budget: number;
  receivedAmount?: number; // Total collected so far
  expenses?: number;       // Project specific expenses
  profit?: number;         // Calculated profit
}

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
// 4. TEAM (Employees)
// ==========================================
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

export interface TeamFilters {
  department?: string;
  type?: string;
  status?: string;
  search?: string;
}

// ==========================================
// 5. PAYROLL
// ==========================================
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

// ==========================================
// 6. FINANCE (General Expenses & Income)
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

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

// ==========================================
// 7. FINANCIAL RECORDS (Assets/Liabilities)
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
// 8. UTILITIES (Notes)
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