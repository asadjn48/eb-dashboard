import type {
  User,
  KPIData,
  Project,
  Employee,
  PayrollRecord,
  Expense,
  PortfolioProject,
  MonthlyFinancialData,
  ChartDataPoint,
  CompanySettings,
  ProjectFilters,
  TeamFilters,
} from '@/types';

// import { teamAPI } from '@/services/teamService';




// Mock delay to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock User Data
const mockUser: User = {
  id: '1',
  email: 'admin@encoderbytes.com',
  name: 'Admin User',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
};

// Mock KPI Data
const mockKPIData: KPIData = {
  totalIncome: 12500000,
  netProfit: 4200000,
  totalExpenses: 8300000,
  activeProjects: 18,
  projectExpenses: 5200000,
  taxExpenses: 850000,
  salaryExpenses: 2250000,
  teamSize: 42,
};

// Mock Projects Data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'NAVTTC Digital Skills Training',
    type: 'funded',
    subType: 'NAVTTC',
    client: 'NAVTTC Pakistan',
    budget: 2500000,
    expenses: 1800000,
    profit: 700000,
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    status: 'active',
    progress: 65,
    description: 'Digital skills training program for youth',
  },
  {
    id: '2',
    name: 'GIZ Green Tech Initiative',
    type: 'funded',
    subType: 'GIZ',
    client: 'GIZ Germany',
    budget: 3200000,
    expenses: 2100000,
    profit: 1100000,
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    status: 'active',
    progress: 45,
    description: 'Sustainable technology training program',
  },
  {
    id: '3',
    name: 'NGO Women Empowerment',
    type: 'funded',
    subType: 'NGO/Government',
    client: 'Local NGO',
    budget: 1500000,
    expenses: 900000,
    profit: 600000,
    startDate: '2024-06-01',
    endDate: '2024-11-30',
    status: 'active',
    progress: 30,
    description: 'IT training for women',
  },
  {
    id: '4',
    name: 'E-Commerce Platform',
    type: 'commercial',
    subType: 'Website',
    client: 'Fashion Store Ltd',
    budget: 800000,
    expenses: 450000,
    profit: 350000,
    startDate: '2024-07-01',
    endDate: '2024-10-15',
    status: 'active',
    progress: 75,
    description: 'Full-stack e-commerce solution',
  },
  {
    id: '5',
    name: 'Mobile Banking App',
    type: 'commercial',
    subType: 'Mobile App',
    client: 'FinTech Solutions',
    budget: 1500000,
    expenses: 800000,
    profit: 700000,
    startDate: '2024-05-01',
    endDate: '2024-12-01',
    status: 'active',
    progress: 60,
    description: 'iOS and Android banking application',
  },
  {
    id: '6',
    name: 'Corporate Website Redesign',
    type: 'commercial',
    subType: 'Website',
    client: 'Tech Corp Inc',
    budget: 500000,
    expenses: 280000,
    profit: 220000,
    startDate: '2024-08-01',
    endDate: '2024-09-30',
    status: 'completed',
    progress: 100,
    description: 'Modern corporate website redesign',
  },
  {
    id: '7',
    name: 'AI Training Program',
    type: 'funded',
    subType: 'Training',
    client: 'Tech University',
    budget: 2000000,
    expenses: 1200000,
    profit: 800000,
    startDate: '2024-04-01',
    endDate: '2024-12-31',
    status: 'active',
    progress: 55,
    description: 'Advanced AI and ML training',
  },
  {
    id: '8',
    name: 'Freelance Dashboard',
    type: 'commercial',
    subType: 'Freelance',
    client: 'Startup Hub',
    budget: 350000,
    expenses: 180000,
    profit: 170000,
    startDate: '2024-08-15',
    endDate: '2024-10-30',
    status: 'active',
    progress: 40,
    description: 'Analytics dashboard for freelancers',
  },
  {
    id: '9',
    name: 'Healthcare Management System',
    type: 'commercial',
    subType: 'Website',
    client: 'MediCare Hospital',
    budget: 2200000,
    expenses: 1400000,
    profit: 800000,
    startDate: '2024-02-01',
    endDate: '2024-11-30',
    status: 'on-hold',
    progress: 50,
    description: 'Hospital management system',
  },
  {
    id: '10',
    name: 'Food Delivery App',
    type: 'commercial',
    subType: 'Mobile App',
    client: 'Foodie Express',
    budget: 1200000,
    expenses: 950000,
    profit: 250000,
    startDate: '2024-06-15',
    endDate: '2024-12-15',
    status: 'active',
    progress: 70,
    description: 'Food delivery mobile application',
  },
];

// Mock Employees Data
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    email: 'ahmed@encoderbytes.com',
    designation: 'Senior Web Developer',
    department: 'Web Developer',
    type: 'on-site',
    status: 'active',
    joinDate: '2022-03-15',
    salary: 180000,
    phone: '+92-300-1234567',
  },
  {
    id: '2',
    name: 'Sara Ali',
    email: 'sara@encoderbytes.com',
    designation: 'UI/UX Designer',
    department: 'Graphic Designer',
    type: 'on-site',
    status: 'active',
    joinDate: '2022-06-01',
    salary: 120000,
    phone: '+92-301-2345678',
  },
  {
    id: '3',
    name: 'Usman Farooq',
    email: 'usman@encoderbytes.com',
    designation: 'Mobile App Developer',
    department: 'App Developer',
    type: 'remote',
    status: 'active',
    joinDate: '2023-01-10',
    salary: 150000,
    phone: '+92-302-3456789',
  },
  {
    id: '4',
    name: 'Fatima Zahra',
    email: 'fatima@encoderbytes.com',
    designation: 'AI Engineer',
    department: 'AI Engineer',
    type: 'on-site',
    status: 'active',
    joinDate: '2023-04-20',
    salary: 200000,
    phone: '+92-303-4567890',
  },
  {
    id: '5',
    name: 'Bilal Ahmed',
    email: 'bilal@encoderbytes.com',
    designation: 'Technical Instructor',
    department: 'Instructor',
    type: 'on-site',
    status: 'active',
    joinDate: '2022-09-05',
    salary: 140000,
    phone: '+92-304-5678901',
  },
  {
    id: '6',
    name: 'Ayesha Malik',
    email: 'ayesha@encoderbytes.com',
    designation: 'Junior Developer',
    department: 'Web Developer',
    type: 'remote',
    status: 'active',
    joinDate: '2024-01-15',
    salary: 80000,
    phone: '+92-305-6789012',
  },
  {
    id: '7',
    name: 'Hassan Raza',
    email: 'hassan@encoderbytes.com',
    designation: 'Graphic Designer',
    department: 'Graphic Designer',
    type: 'on-site',
    status: 'inactive',
    joinDate: '2022-12-01',
    salary: 100000,
    phone: '+92-306-7890123',
  },
  {
    id: '8',
    name: 'Zainab Bibi',
    email: 'zainab@encoderbytes.com',
    designation: 'App Developer',
    department: 'App Developer',
    type: 'remote',
    status: 'active',
    joinDate: '2023-07-10',
    salary: 130000,
    phone: '+92-307-8901234',
  },
  {
    id: '9',
    name: 'Imran Khan',
    email: 'imran@encoderbytes.com',
    designation: 'Senior Instructor',
    department: 'Instructor',
    type: 'on-site',
    status: 'active',
    joinDate: '2021-05-15',
    salary: 160000,
    phone: '+92-308-9012345',
  },
  {
    id: '10',
    name: 'Nadia Hussain',
    email: 'nadia@encoderbytes.com',
    designation: 'ML Engineer',
    department: 'AI Engineer',
    type: 'remote',
    status: 'active',
    joinDate: '2023-10-01',
    salary: 175000,
    phone: '+92-309-0123456',
  },
];

// Mock Payroll Data
const mockPayroll: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Ahmed Khan',
    department: 'Web Developer',
    month: 'January',
    year: 2025,
    baseSalary: 180000,
    bonuses: 15000,
    deductions: 5000,
    tax: 18000,
    netSalary: 172000,
    status: 'paid',
    paidDate: '2025-01-05',
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Sara Ali',
    department: 'Graphic Designer',
    month: 'January',
    year: 2025,
    baseSalary: 120000,
    bonuses: 10000,
    deductions: 0,
    tax: 12000,
    netSalary: 118000,
    status: 'paid',
    paidDate: '2025-01-05',
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Usman Farooq',
    department: 'App Developer',
    month: 'January',
    year: 2025,
    baseSalary: 150000,
    bonuses: 20000,
    deductions: 0,
    tax: 15000,
    netSalary: 155000,
    status: 'unpaid',
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Fatima Zahra',
    department: 'AI Engineer',
    month: 'January',
    year: 2025,
    baseSalary: 200000,
    bonuses: 25000,
    deductions: 0,
    tax: 20000,
    netSalary: 205000,
    status: 'unpaid',
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Bilal Ahmed',
    department: 'Instructor',
    month: 'January',
    year: 2025,
    baseSalary: 140000,
    bonuses: 10000,
    deductions: 2000,
    tax: 14000,
    netSalary: 134000,
    status: 'paid',
    paidDate: '2025-01-05',
  },
  {
    id: '6',
    employeeId: '6',
    employeeName: 'Ayesha Malik',
    department: 'Web Developer',
    month: 'January',
    year: 2025,
    baseSalary: 80000,
    bonuses: 5000,
    deductions: 0,
    tax: 8000,
    netSalary: 77000,
    status: 'unpaid',
  },
];

// Mock Expenses Data
const mockExpenses: Expense[] = [
  {
    id: '1',
    category: 'Rent',
    amount: 150000,
    date: '2025-01-01',
    description: 'Office rent for January',
    isRecurring: true,
    status: 'paid',
  },
  {
    id: '2',
    category: 'WiFi',
    amount: 15000,
    date: '2025-01-05',
    description: 'Internet bill',
    isRecurring: true,
    status: 'paid',
  },
  {
    id: '3',
    category: 'Electricity',
    amount: 45000,
    date: '2025-01-10',
    description: 'Electricity bill January',
    isRecurring: true,
    status: 'pending',
  },
  {
    id: '4',
    category: 'Food',
    amount: 25000,
    date: '2025-01-15',
    description: 'Team lunch and refreshments',
    isRecurring: false,
    status: 'paid',
  },
  {
    id: '5',
    category: 'Maintenance',
    amount: 35000,
    date: '2025-01-12',
    description: 'AC maintenance',
    isRecurring: false,
    status: 'paid',
  },
  {
    id: '6',
    category: 'Guest',
    amount: 18000,
    date: '2025-01-18',
    description: 'Client meeting hospitality',
    isRecurring: false,
    status: 'paid',
  },
  {
    id: '7',
    category: 'Other',
    amount: 12000,
    date: '2025-01-20',
    description: 'Office supplies',
    isRecurring: false,
    status: 'pending',
  },
];

// Mock Portfolio Data
const mockPortfolio: PortfolioProject[] = [
  {
    id: '1',
    name: 'E-Commerce Pro',
    description: 'Full-featured e-commerce platform with payment integration',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    status: 'completed',
    completionDate: '2024-06-15',
    clientName: 'Retail Giants',
    liveUrl: 'https://example.com',
  },
  {
    id: '2',
    name: 'HealthTrack App',
    description: 'Health monitoring mobile application',
    techStack: ['React Native', 'Firebase', 'Redux'],
    status: 'completed',
    completionDate: '2024-03-20',
    clientName: 'MediCare',
    liveUrl: 'https://example.com',
  },
  {
    id: '3',
    name: 'EduLearn Platform',
    description: 'Online learning management system',
    techStack: ['Next.js', 'PostgreSQL', 'Prisma'],
    status: 'in-progress',
    clientName: 'EduTech',
  },
  {
    id: '4',
    name: 'FinDash Analytics',
    description: 'Financial analytics dashboard',
    techStack: ['Vue.js', 'D3.js', 'Python'],
    status: 'completed',
    completionDate: '2024-01-10',
    clientName: 'FinCorp',
    liveUrl: 'https://example.com',
  },
  {
    id: '5',
    name: 'Social Connect',
    description: 'Social media management tool',
    techStack: ['React', 'GraphQL', 'AWS'],
    status: 'maintenance',
    completionDate: '2023-11-30',
    clientName: 'Marketing Pro',
    liveUrl: 'https://example.com',
  },
  {
    id: '6',
    name: 'AI Chatbot',
    description: 'Customer service AI chatbot',
    techStack: ['Python', 'TensorFlow', 'FastAPI'],
    status: 'completed',
    completionDate: '2024-05-22',
    clientName: 'SupportHub',
  },
];

// Mock Company Settings
const mockSettings: CompanySettings = {
  name: 'EncoderBytes',
  address: '123 Tech Street, Islamabad, Pakistan',
  phone: '+92-51-1234567',
  email: 'info@encoderbytes.com',
  currency: 'PKR',
  taxPercentage: 15,
  primaryColor: ''
};

// Chart Data
const mockMonthlyFinancialData: MonthlyFinancialData[] = [
  { month: 'Jan', income: 950000, expenses: 720000, profit: 230000 },
  { month: 'Feb', income: 1050000, expenses: 780000, profit: 270000 },
  { month: 'Mar', income: 1200000, expenses: 850000, profit: 350000 },
  { month: 'Apr', income: 1100000, expenses: 800000, profit: 300000 },
  { month: 'May', income: 1350000, expenses: 920000, profit: 430000 },
  { month: 'Jun', income: 1450000, expenses: 980000, profit: 470000 },
  { month: 'Jul', income: 1300000, expenses: 890000, profit: 410000 },
  { month: 'Aug', income: 1550000, expenses: 1050000, profit: 500000 },
  { month: 'Sep', income: 1400000, expenses: 950000, profit: 450000 },
  { month: 'Oct', income: 1650000, expenses: 1100000, profit: 550000 },
  { month: 'Nov', income: 1500000, expenses: 1020000, profit: 480000 },
  { month: 'Dec', income: 1800000, expenses: 1200000, profit: 600000 },
];

const mockExpenseDistribution: ChartDataPoint[] = [
  { name: 'Rent', value: 1800000 },
  { name: 'Salaries', value: 2250000 },
  { name: 'Utilities', value: 720000 },
  { name: 'Food', value: 300000 },
  { name: 'Maintenance', value: 420000 },
  { name: 'Guest', value: 216000 },
  { name: 'Other', value: 144000 },
];

const mockDepartmentDistribution: ChartDataPoint[] = [
  { name: 'Web Developer', value: 12 },
  { name: 'App Developer', value: 8 },
  { name: 'Graphic Designer', value: 6 },
  { name: 'AI Engineer', value: 5 },
  { name: 'Instructor', value: 11 },
];

// API Functions
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await delay(800);
    if (email === 'admin@encoderbytes.com' && password === 'admin123') {
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);
      return { user: mockUser, token };
    }
    throw new Error('Invalid credentials');
  },

  logout: async (): Promise<void> => {
    await delay(300);
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(500);
    const token = localStorage.getItem('token');
    if (token) {
      return mockUser;
    }
    return null;
  },
};

export const dashboardAPI = {
  getKPIData: async (): Promise<KPIData> => {
    await delay(600);
    return mockKPIData;
  },

  getMonthlyFinancialData: async (): Promise<MonthlyFinancialData[]> => {
    await delay(500);
    return mockMonthlyFinancialData;
  },

  getExpenseDistribution: async (): Promise<ChartDataPoint[]> => {
    await delay(500);
    return mockExpenseDistribution;
  },
};

export const projectsAPI = {
  getAll: async (filters?: ProjectFilters): Promise<Project[]> => {
    await delay(700);
    let result = [...mockProjects];

    if (filters?.type) {
      result = result.filter(p => p.type === filters.type);
    }
    if (filters?.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.client.toLowerCase().includes(search)
      );
    }
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'profit':
          result.sort((a, b) => b.profit - a.profit);
          break;
        case 'budget':
          result.sort((a, b) => b.budget - a.budget);
          break;
        case 'date':
          result.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          break;
      }
    }

    return result;
  },

  getById: async (id: string): Promise<Project | undefined> => {
    await delay(400);
    return mockProjects.find(p => p.id === id);
  },
};

export const teamAPI = {
  getAll: async (filters?: TeamFilters): Promise<Employee[]> => {
    await delay(600);
    let result = [...mockEmployees];

    if (filters?.department) {
      result = result.filter(e => e.department === filters.department);
    }
    if (filters?.type) {
      result = result.filter(e => e.type === filters.type);
    }
    if (filters?.status) {
      result = result.filter(e => e.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(search) ||
        e.email.toLowerCase().includes(search) ||
        e.designation.toLowerCase().includes(search)
      );
    }

    return result;
  },

  getById: async (id: string): Promise<Employee | undefined> => {
    await delay(400);
    return mockEmployees.find(e => e.id === id);
  },

  getDepartmentDistribution: async (): Promise<ChartDataPoint[]> => {
    await delay(400);
    return mockDepartmentDistribution;
  },
};

export const payrollAPI = {
  getAll: async (): Promise<PayrollRecord[]> => {
    await delay(600);
    return mockPayroll;
  },

  getByEmployee: async (employeeId: string): Promise<PayrollRecord[]> => {
    await delay(400);
    return mockPayroll.filter(p => p.employeeId === employeeId);
  },

  getSummary: async (): Promise<{ totalPaid: number; totalUnpaid: number; totalAmount: number }> => {
    await delay(400);
    const totalPaid = mockPayroll
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.netSalary, 0);
    const totalUnpaid = mockPayroll
      .filter(p => p.status === 'unpaid')
      .reduce((sum, p) => sum + p.netSalary, 0);
    return { totalPaid, totalUnpaid, totalAmount: totalPaid + totalUnpaid };
  },
};

export const expensesAPI = {
  getAll: async (): Promise<Expense[]> => {
    await delay(500);
    return mockExpenses;
  },

  getByCategory: async (category: string): Promise<Expense[]> => {
    await delay(400);
    return mockExpenses.filter(e => e.category === category);
  },

  getSummary: async (): Promise<{ total: number; pending: number; topCategory: string }> => {
    await delay(400);
    const total = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
    const pending = mockExpenses
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount, 0);

    const categoryTotals: Record<string, number> = {};
    mockExpenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    const topCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Other';

    return { total, pending, topCategory };
  },
};

export const portfolioAPI = {
  getAll: async (): Promise<PortfolioProject[]> => {
    await delay(600);
    return mockPortfolio;
  },

  getById: async (id: string): Promise<PortfolioProject | undefined> => {
    await delay(400);
    return mockPortfolio.find(p => p.id === id);
  },
};

export const settingsAPI = {
  get: async (): Promise<CompanySettings> => {
    await delay(400);
    return mockSettings;
  },

  update: async (settings: Partial<CompanySettings>): Promise<CompanySettings> => {
    await delay(600);
    Object.assign(mockSettings, settings);
    return mockSettings;
  },
};
