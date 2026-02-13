/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// import { projectAPI } from './projectService';
// import { expensesAPI } from './expenseService';
// import { teamAPI } from './teamService'; 
// import { incomeAPI } from './incomeService'; // NEW IMPORT
// import type { KPIData, MonthlyFinancialData, ChartDataPoint } from '../types';

// export const dashboardAPI = {
//   getKPIData: async (): Promise<KPIData> => {
//     try {
//       const [projects, generalExpenses, employees, manualIncome] = await Promise.all([
//         projectAPI.getAll(),
//         expensesAPI.getAll(),
//         teamAPI.getAll(),
//         incomeAPI.getAll() // Fetch manual budget entries
//       ]);

//       // --- 1. INCOME (Projects + Manual Injections) ---
//       const projectRevenue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
//       const manualRevenue = manualIncome.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      
//       const totalIncome = projectRevenue + manualRevenue;

//       // --- 2. EXPENSES ---
//       const projectDirectExpenses = projects.reduce((sum, p) => sum + (Number(p.expenses) || 0), 0);
//       const officeExpenses = generalExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
//       const totalExpenses = projectDirectExpenses + officeExpenses;

//       // --- 3. PROFIT ---
//       const netProfit = totalIncome - totalExpenses;
      
//       // --- 4. COUNTS ---
//       const activeProjects = projects.filter(p => p.status === 'active').length;
//       const teamSize = employees.filter(e => e.status === 'active').length;
//       const alumniSize = employees.filter(e => e.status === 'inactive' || e.status === 'terminated').length;

//       // --- 5. BREAKDOWNS ---
//       const taxExpenses = generalExpenses
//         .filter(e => (e.category as string) === 'Tax')
//         .reduce((sum, e) => sum + Number(e.amount), 0);

//       const salaryExpenses = generalExpenses
//         .filter(e => (e.category as string) === 'Salaries')
//         .reduce((sum, e) => sum + Number(e.amount), 0);

//       return {
//         totalIncome,
//         totalExpenses,
//         netProfit,
//         activeProjects,
//         teamSize,
//         alumniSize,
//         projectExpenses: projectDirectExpenses,
//         taxExpenses,
//         salaryExpenses
//       };
//     } catch (error) {
//       console.error("Failed to calc KPIs", error);
//       return { 
//         totalIncome: 0, totalExpenses: 0, netProfit: 0, activeProjects: 0, 
//         teamSize: 0, alumniSize: 0, projectExpenses: 0, taxExpenses: 0, salaryExpenses: 0 
//       };
//     }
//   },

//   // ... (Keep getMonthlyFinancialData & getExpenseDistribution same as before, 
//   //      just ensure getMonthlyFinancialData adds manualIncome to the monthly income map if desired)
//   getMonthlyFinancialData: async (): Promise<MonthlyFinancialData[]> => {
//     try {
//       const [projects, expenses, manualIncome] = await Promise.all([
//         projectAPI.getAll(), 
//         expensesAPI.getAll(),
//         incomeAPI.getAll()
//       ]);
//       const monthlyMap = new Map<string, { income: number; expenses: number }>();

//       // 1. Projects Income
//       projects.forEach(p => {
//         const month = new Date(p.startDate).toLocaleString('default', { month: 'short' });
//         const current = monthlyMap.get(month) || { income: 0, expenses: 0 };
//         monthlyMap.set(month, { 
//             ...current, 
//             income: current.income + (Number(p.budget) || 0),
//             expenses: current.expenses + (Number(p.expenses) || 0)
//         });
//       });

//       // 2. Manual Income
//       manualIncome.forEach(i => {
//         const month = new Date(i.date).toLocaleString('default', { month: 'short' });
//         const current = monthlyMap.get(month) || { income: 0, expenses: 0 };
//         monthlyMap.set(month, { ...current, income: current.income + (Number(i.amount) || 0) });
//       });

//       // 3. General Expenses
//       expenses.forEach(e => {
//         const month = new Date(e.date).toLocaleString('default', { month: 'short' });
//         const current = monthlyMap.get(month) || { income: 0, expenses: 0 };
//         monthlyMap.set(month, { ...current, expenses: current.expenses + (Number(e.amount) || 0) });
//       });

//       const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       return Array.from(monthlyMap.entries())
//         .map(([month, values]) => ({
//           month,
//           income: values.income,
//           expenses: values.expenses,
//           profit: values.income - values.expenses
//         }))
//         .sort((a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month));
//     } catch (error) { return []; }
//   },

//   getExpenseDistribution: async (): Promise<ChartDataPoint[]> => {
//       // (Same code as previous step)
//       try {
//         const [projects, generalExpenses] = await Promise.all([projectAPI.getAll(), expensesAPI.getAll()]);
//         const distMap: Record<string, number> = {};
  
//         // 1. General Expenses
//         generalExpenses.forEach(e => {
//           const cat = e.category || 'Other';
//           distMap[cat] = (distMap[cat] || 0) + (Number(e.amount) || 0);
//         });
  
//         // 2. Project Direct Expenses
//         const totalProjectExpenses = projects.reduce((sum, p) => sum + (Number(p.expenses) || 0), 0);
//         if (totalProjectExpenses > 0) {
//           distMap['Project Direct'] = totalProjectExpenses;
//         }
  
//         return Object.entries(distMap)
//           .map(([name, value]) => ({ name, value }))
//           .sort((a, b) => b.value - a.value);
//       } catch (error) { return []; }
//   }
// };





















// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { projectAPI } from './projectService';
// import { expensesAPI } from './expenseService';
// import { teamAPI } from './teamService'; 
// import { incomeAPI } from './incomeService';
// import type { KPIData, MonthlyFinancialData, ChartDataPoint } from '../types';

// export const dashboardAPI = {
//   getKPIData: async (): Promise<KPIData> => {
//     try {
//       const [projects, generalExpenses, employees, manualIncome] = await Promise.all([
//         projectAPI.getAll(),
//         expensesAPI.getAll(),
//         teamAPI.getAll(),
//         incomeAPI.getAll()
//       ]);

//       // --- 1. INCOME ---
//       const projectRevenue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
//       const manualRevenue = manualIncome.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
//       const totalIncome = projectRevenue + manualRevenue;

//       // --- 2. EXPENSES ---
//       const projectDirectExpenses = projects.reduce((sum, p) => sum + (Number(p.expenses) || 0), 0);
//       const officeExpenses = generalExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
//       const totalExpenses = projectDirectExpenses + officeExpenses;

//       // --- 3. PROFIT & MARGIN ---
//       const netProfit = totalIncome - totalExpenses;
//       const projectMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
      
//       // --- 4. COUNTS ---
//       const activeProjects = projects.filter(p => p.status === 'active').length;
//       const teamSize = employees.filter(e => e.status === 'active').length;
//       const alumniSize = employees.filter(e => e.status === 'inactive' || e.status === 'terminated').length;

//       // --- 5. SPECIFIC BREAKDOWNS ---
//       const taxExpenses = generalExpenses
//         .filter(e => (e.category as string) === 'Tax' || e.description.toLowerCase().includes('tax'))
//         .reduce((sum, e) => sum + Number(e.amount), 0);
      
//       // We can use this for "Salaries" breakdown later if needed
//       const salaryExpenses = generalExpenses
//         .filter(e => (e.category as string) === 'Salaries')
//         .reduce((sum, e) => sum + Number(e.amount), 0);

//       return {
//         totalIncome,
//         netProfit,
//         totalExpenses,
//         activeProjects,
//         teamSize,
//         projectMargin,     // New % field
//         alumniCount: alumniSize, // Renamed to match new interface
//         taxPaid: taxExpenses,
//         salaryExpenses: salaryExpenses,
//         projectExpenses: projectDirectExpenses,
//         alumniSize: alumniSize // Keeping for backward compatibility if needed
//       } as any; // Type casting to handle strict interface changes during transition
//     } catch (error) {
//       console.error("Failed to calc KPIs", error);
//       return { 
//         totalIncome: 0, netProfit: 0, totalExpenses: 0, activeProjects: 0, 
//         teamSize: 0, projectMargin: 0, alumniCount: 0, taxPaid: 0,
//         salaryExpenses: 0, projectExpenses: 0, alumniSize: 0
//       } as any;
//     }
//   },

//   getMonthlyFinancialData: async (): Promise<MonthlyFinancialData[]> => {
//     try {
//       const [projects, expenses, manualIncome] = await Promise.all([
//         projectAPI.getAll(), 
//         expensesAPI.getAll(),
//         incomeAPI.getAll()
//       ]);
//       const monthlyMap = new Map<string, { income: number; expenses: number }>();

//       const processDate = (dateStr: string, amount: number, type: 'income' | 'expense') => {
//         if (!dateStr) return;
//         const month = new Date(dateStr).toLocaleString('default', { month: 'short' });
//         const current = monthlyMap.get(month) || { income: 0, expenses: 0 };
//         if (type === 'income') current.income += amount;
//         else current.expenses += amount;
//         monthlyMap.set(month, current);
//       };

//       // Map Data
//       projects.forEach(p => {
//         processDate(p.startDate, Number(p.budget), 'income');
//         processDate(p.startDate, Number(p.expenses), 'expense');
//       });
//       manualIncome.forEach(i => processDate(i.date, Number(i.amount), 'income'));
//       expenses.forEach(e => processDate(e.date, Number(e.amount), 'expense'));

//       const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       return Array.from(monthlyMap.entries())
//         .map(([month, values]) => ({
//           month,
//           income: values.income,
//           expenses: values.expenses,
//           profit: values.income - values.expenses
//         }))
//         .sort((a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month));
//     } catch (error) { return []; }
//   },

//   getExpenseDistribution: async (): Promise<ChartDataPoint[]> => {
//     try {
//       const [generalExpenses] = await Promise.all([expensesAPI.getAll()]);
//       const distMap: Record<string, number> = {};

//       generalExpenses.forEach(e => {
//         const cat = e.category || 'Other';
//         distMap[cat] = (distMap[cat] || 0) + (Number(e.amount) || 0);
//       });

//       return Object.entries(distMap)
//         .map(([name, value]) => ({ name, value }))
//         .sort((a, b) => b.value - a.value);
//     } catch (error) { return []; }
//   }
// };




















// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { projectAPI } from './projectService';
// import { expensesAPI } from './expenseService';
// import { teamAPI } from './teamService'; 
// import { incomeAPI } from './incomeService';
// import type { KPIData, MonthlyFinancialData, ChartDataPoint } from '../types';

// export const dashboardAPI = {
//   getKPIData: async (): Promise<KPIData> => {
//     try {
//       const [projects, generalExpenses, employees, manualIncome] = await Promise.all([
//         projectAPI.getAll(),
//         expensesAPI.getAll(),
//         teamAPI.getAll(),
//         incomeAPI.getAll()
//       ]);

//       // --- CALCULATIONS ---
//       const projectRevenue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
//       const manualRevenue = manualIncome.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
//       const totalIncome = projectRevenue + manualRevenue;

//       const projectDirectExpenses = projects.reduce((sum, p) => sum + (Number(p.expenses) || 0), 0);
//       const officeExpenses = generalExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
//       const totalExpenses = projectDirectExpenses + officeExpenses;

//       const netProfit = totalIncome - totalExpenses;
//       const projectMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
      
//       const activeProjects = projects.filter(p => p.status === 'active').length;
      
//       // Filter Active vs Alumni
//       const teamSize = employees.filter(e => e.status === 'active').length;
//       const alumniCount = employees.filter(e => e.status === 'inactive' || e.status === 'terminated' || (e as any).type === 'alumni').length;

//       const taxPaid = generalExpenses
//         .filter(e => (e.category as string) === 'Tax' || e.description.toLowerCase().includes('tax'))
//         .reduce((sum, e) => sum + Number(e.amount), 0);
      
//       const salaryExpenses = generalExpenses
//         .filter(e => (e.category as string) === 'Salaries')
//         .reduce((sum, e) => sum + Number(e.amount), 0);

//       return {
//         totalIncome,
//         netProfit,
//         totalExpenses,
//         activeProjects,
//         teamSize,
//         alumniCount,
//         projectMargin,
//         taxPaid,
//         salaryExpenses,
//         projectExpenses: projectDirectExpenses
//       };
//     } catch (error) {
//       console.error("Failed to calc KPIs", error);
//       return { 
//         totalIncome: 0, netProfit: 0, totalExpenses: 0, activeProjects: 0, 
//         teamSize: 0, alumniCount: 0, projectMargin: 0, taxPaid: 0,
//         salaryExpenses: 0, projectExpenses: 0
//       };
//     }
//   },

//   // ... (getMonthlyFinancialData and getExpenseDistribution remain unchanged)
//   getMonthlyFinancialData: async (): Promise<MonthlyFinancialData[]> => {
//     try {
//       const [projects, expenses, manualIncome] = await Promise.all([
//         projectAPI.getAll(), 
//         expensesAPI.getAll(),
//         incomeAPI.getAll()
//       ]);
//       const monthlyMap = new Map<string, { income: number; expenses: number }>();

//       const processDate = (dateStr: string, amount: number, type: 'income' | 'expense') => {
//         if (!dateStr) return;
//         const month = new Date(dateStr).toLocaleString('default', { month: 'short' });
//         const current = monthlyMap.get(month) || { income: 0, expenses: 0 };
//         if (type === 'income') current.income += amount;
//         else current.expenses += amount;
//         monthlyMap.set(month, current);
//       };

//       projects.forEach(p => {
//         processDate(p.startDate, Number(p.budget), 'income');
//         processDate(p.startDate, Number(p.expenses), 'expense');
//       });
//       manualIncome.forEach(i => processDate(i.date, Number(i.amount), 'income'));
//       expenses.forEach(e => processDate(e.date, Number(e.amount), 'expense'));

//       const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       return Array.from(monthlyMap.entries())
//         .map(([month, values]) => ({
//           month,
//           income: values.income,
//           expenses: values.expenses,
//           profit: values.income - values.expenses
//         }))
//         .sort((a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month));
//     } catch (error) { return []; }
//   },

//   getExpenseDistribution: async (): Promise<ChartDataPoint[]> => {
//     try {
//       const [generalExpenses] = await Promise.all([expensesAPI.getAll()]);
//       const distMap: Record<string, number> = {};

//       generalExpenses.forEach(e => {
//         const cat = e.category || 'Other';
//         distMap[cat] = (distMap[cat] || 0) + (Number(e.amount) || 0);
//       });

//       return Object.entries(distMap)
//         .map(([name, value]) => ({ name, value }))
//         .sort((a, b) => b.value - a.value);
//     } catch (error) { return []; }
//   }
// };






import { projectAPI } from './projectService';
import { expensesAPI } from './expenseService';
import { teamAPI } from './teamService'; 
import { incomeAPI } from './incomeService';
import type { KPIData, MonthlyFinancialData, ChartDataPoint } from '../types';

// Helper: Check if a date falls within the range
const isInRange = (dateStr: string, start?: Date | null, end?: Date | null) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (start && d < start) return false;
  if (end) {
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999); 
    if (d > endOfDay) return false;
  }
  return true;
};

// Helper: Check if an entity was ACTIVE during the range
const isActiveDuring = (startStr: string, endStr: string | undefined, rangeStart?: Date | null, rangeEnd?: Date | null) => {
  const entityStart = new Date(startStr);
  const entityEnd = endStr ? new Date(endStr) : null;

  if (rangeEnd) {
     const rangeEndOfDay = new Date(rangeEnd);
     rangeEndOfDay.setHours(23, 59, 59, 999);
     if (entityStart > rangeEndOfDay) return false;
  }

  if (entityEnd && rangeStart) {
     if (entityEnd < rangeStart) return false;
  }

  return true;
};

export const dashboardAPI = {
  getKPIData: async (startDate?: Date | null, endDate?: Date | null): Promise<KPIData> => {
    try {
      const [projects, generalExpenses, employees, manualIncome] = await Promise.all([
        projectAPI.getAll(),
        expensesAPI.getAll(),
        teamAPI.getAll(),
        incomeAPI.getAll()
      ]);

      // --- FILTERING ---
      const filteredExpenses = generalExpenses.filter(e => isInRange(e.date, startDate, endDate));
      const filteredIncome = manualIncome.filter(i => isInRange(i.date, startDate, endDate));
      
      const filteredProjects = projects.filter(p => 
        isActiveDuring(p.startDate, p.completionDate, startDate, endDate)
      );

      // --- FIX: ROBUST COUNTS ---
      
      // 1. Active Team: Strictly 'active' status
      const activeTeamCount = employees.filter(e => e.status === 'active').length;
      
      // 2. Alumni: Check BOTH 'type' AND 'status' to capture everyone
      // If they are marked 'alumni', 'terminated', or 'inactive', we count them as Alumni.
      const alumniCount = employees.filter(e => 
        (e as any).type === 'alumni' || 
        e.status === 'terminated' || 
        e.status === 'inactive'
      ).length;

      // --- CALCULATIONS ---
      const projectsStartingInPeriod = projects.filter(p => isInRange(p.startDate, startDate, endDate));
      
      const projectRevenue = projectsStartingInPeriod.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
      const manualRevenue = filteredIncome.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const totalIncome = projectRevenue + manualRevenue;

      const projectDirectExpenses = projectsStartingInPeriod.reduce((sum, p) => sum + (Number(p.expenses) || 0), 0);
      const officeExpenses = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      const totalExpenses = projectDirectExpenses + officeExpenses;

      const netProfit = totalIncome - totalExpenses;
      const projectMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
      
      const taxPaid = filteredExpenses
        .filter(e => (e.category as string) === 'Tax' || e.description.toLowerCase().includes('tax'))
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      const salaryExpenses = filteredExpenses
        .filter(e => (e.category as string) === 'Salaries')
        .reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        totalIncome, netProfit, totalExpenses, 
        activeProjects: filteredProjects.length, 
        teamSize: activeTeamCount,
        alumniCount: alumniCount, 
        projectMargin, taxPaid, salaryExpenses, 
        projectExpenses: projectDirectExpenses
      };
    } catch (error) {
      console.error("Failed to calc KPIs", error);
      return { 
        totalIncome: 0, netProfit: 0, totalExpenses: 0, activeProjects: 0, 
        teamSize: 0, alumniCount: 0, projectMargin: 0, taxPaid: 0, 
        salaryExpenses: 0, projectExpenses: 0 
      };
    }
  },

  getMonthlyFinancialData: async (startDate?: Date | null, endDate?: Date | null): Promise<MonthlyFinancialData[]> => {
    try {
      const [projects, expenses, manualIncome] = await Promise.all([
        projectAPI.getAll(), 
        expensesAPI.getAll(),
        incomeAPI.getAll()
      ]);
      const monthlyMap = new Map<string, { income: number; expenses: number }>();

      const processDate = (dateStr: string, amount: number, type: 'income' | 'expense') => {
        if (!isInRange(dateStr, startDate, endDate)) return;
        const d = new Date(dateStr);
        const month = d.toLocaleString('default', { month: 'short' }); 
        const current = monthlyMap.get(month) || { income: 0, expenses: 0 };
        if (type === 'income') current.income += amount;
        else current.expenses += amount;
        monthlyMap.set(month, current);
      };

      projects.forEach(p => {
        processDate(p.startDate, Number(p.budget), 'income');
        processDate(p.startDate, Number(p.expenses), 'expense');
      });
      manualIncome.forEach(i => processDate(i.date, Number(i.amount), 'income'));
      expenses.forEach(e => processDate(e.date, Number(e.amount), 'expense'));

      const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return Array.from(monthlyMap.entries())
        .map(([month, values]) => ({
          month,
          income: values.income,
          expenses: values.expenses,
          profit: values.income - values.expenses
        }))
        .sort((a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month));
    } catch (error) { return []; }
  },

  getExpenseDistribution: async (startDate?: Date | null, endDate?: Date | null): Promise<ChartDataPoint[]> => {
    try {
      const [generalExpenses] = await Promise.all([expensesAPI.getAll()]);
      const distMap: Record<string, number> = {};

      generalExpenses.forEach(e => {
        if (isInRange(e.date, startDate, endDate)) {
            const cat = e.category || 'Other';
            distMap[cat] = (distMap[cat] || 0) + (Number(e.amount) || 0);
        }
      });

      return Object.entries(distMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    } catch (error) { return []; }
  }
};