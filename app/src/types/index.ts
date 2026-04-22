


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
  phone?: string;
  email?: string;
  website?: string;
}

// ==========================================
// 2. DASHBOARD & ANALYTICS
// ==========================================
export interface KPIData {
  totalIncome: number;
  netProfit: number;
  totalExpenses: number;
  activeProjects: number;
  teamSize: number;
  alumniCount: number;
  projectMargin: number; 
  taxPaid: number;
  salaryExpenses: number;
  projectExpenses: number;
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
export type ProjectStatus = 'active' | 'completed' | 'on-hold';

export interface Project {
  createdAt: number;
  id: string;
  name: string;
  type: ProjectType;
  subType: string;
  status: ProjectStatus;
  clientName: string; 
  client?: string; 
  assignedTo?: string[]; 
  startDate: string;
  completionDate?: string;
  endDate?: string; 
  progress: number;
  description?: string;
  budget: number;
  receivedAmount?: number; 
  expenses?: number;       
  profit?: number;         
}

export interface ProjectFilters {
  status?: ProjectStatus;
  type?: string;
  search?: string;
}

export interface ProjectTransaction {
  id: string;
  projectId: string;
  amount: number;
  date: string;
  type: 'payment' | 'refund' | 'adjustment' | 'expense';
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
  salary: number; 
  salaryStartDate?: string; 
  joinDate: string;
  avatar?: string;
  bankName?: string;
  accountNumber?: string;
  currentAddress?: string;
  homeAddress?: string;
  exitDate?: string;
  exitType?: string;
  exitReason?: string;
}

// FIX: Exporting TeamFilters to fix teamService error
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
  // createdAt: string;
  createdAt: string;
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation?: string; 
  mobile?: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  tax: number;
  netSalary: number;
  status: 'paid' | 'pending';
  month: string; 
  paidDate: string;
  method: 'bank' | 'cash' | 'cheque' | 'transfer' | 'reimbursement'; 
  notes?: string;
}

// ==========================================
// 6. FINANCE (Expenses & Income)
// ==========================================
export type ExpenseCategory = 
  | 'Rent' | 'WiFi' | 'Electricity' | 'Food' | 'Maintenance' 
  | 'Guest' | 'Salaries' | 'Tax' | 'Equipment' | 'Software' | 'Other';

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
  status?: string; // Optional to prevent errors
  description?: string; // Optional mapping
  category?: string; // Optional mapping
}

// ==========================================
// 7. FINANCIAL RECORDS
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
// 8. UTILITIES
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