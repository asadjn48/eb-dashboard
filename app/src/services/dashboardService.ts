/* eslint-disable @typescript-eslint/no-unused-vars */

import { projectAPI } from './projectService';
import { expensesAPI } from './expenseService';
import { teamAPI } from './teamService'; 
import { incomeAPI } from './incomeService'; // NEW IMPORT
import type { KPIData, MonthlyFinancialData, ChartDataPoint } from '../types';

export const dashboardAPI = {
  getKPIData: async (): Promise<KPIData> => {
    try {
      const [projects, generalExpenses, employees, manualIncome] = await Promise.all([
        projectAPI.getAll(),
        expensesAPI.getAll(),
        teamAPI.getAll(),
        incomeAPI.getAll() // Fetch manual budget entries
      ]);

      // --- 1. INCOME (Projects + Manual Injections) ---
      const projectRevenue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
      const manualRevenue = manualIncome.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      
      const totalIncome = projectRevenue + manualRevenue;

      // --- 2. EXPENSES ---
      const projectDirectExpenses = projects.reduce((sum, p) => sum + (Number(p.expenses) || 0), 0);
      const officeExpenses = generalExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      const totalExpenses = projectDirectExpenses + officeExpenses;

      // --- 3. PROFIT ---
      const netProfit = totalIncome - totalExpenses;
      
      // --- 4. COUNTS ---
      const activeProjects = projects.filter(p => p.status === 'active').length;
      const teamSize = employees.filter(e => e.status === 'active').length;
      const alumniSize = employees.filter(e => e.status === 'inactive' || e.status === 'terminated').length;

      // --- 5. BREAKDOWNS ---
      const taxExpenses = generalExpenses
        .filter(e => (e.category as string) === 'Tax')
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const salaryExpenses = generalExpenses
        .filter(e => (e.category as string) === 'Salaries')
        .reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        totalIncome,
        totalExpenses,
        netProfit,
        activeProjects,
        teamSize,
        alumniSize,
        projectExpenses: projectDirectExpenses,
        taxExpenses,
        salaryExpenses
      };
    } catch (error) {
      console.error("Failed to calc KPIs", error);
      return { 
        totalIncome: 0, totalExpenses: 0, netProfit: 0, activeProjects: 0, 
        teamSize: 0, alumniSize: 0, projectExpenses: 0, taxExpenses: 0, salaryExpenses: 0 
      };
    }
  },

  // ... (Keep getMonthlyFinancialData & getExpenseDistribution same as before, 
  //      just ensure getMonthlyFinancialData adds manualIncome to the monthly income map if desired)
  getMonthlyFinancialData: async (): Promise<MonthlyFinancialData[]> => {
    try {
      const [projects, expenses, manualIncome] = await Promise.all([
        projectAPI.getAll(), 
        expensesAPI.getAll(),
        incomeAPI.getAll()
      ]);
      const monthlyMap = new Map<string, { income: number; expenses: number }>();

      // 1. Projects Income
      projects.forEach(p => {
        const month = new Date(p.startDate).toLocaleString('default', { month: 'short' });
        const current = monthlyMap.get(month) || { income: 0, expenses: 0 };
        monthlyMap.set(month, { 
            ...current, 
            income: current.income + (Number(p.budget) || 0),
            expenses: current.expenses + (Number(p.expenses) || 0)
        });
      });

      // 2. Manual Income
      manualIncome.forEach(i => {
        const month = new Date(i.date).toLocaleString('default', { month: 'short' });
        const current = monthlyMap.get(month) || { income: 0, expenses: 0 };
        monthlyMap.set(month, { ...current, income: current.income + (Number(i.amount) || 0) });
      });

      // 3. General Expenses
      expenses.forEach(e => {
        const month = new Date(e.date).toLocaleString('default', { month: 'short' });
        const current = monthlyMap.get(month) || { income: 0, expenses: 0 };
        monthlyMap.set(month, { ...current, expenses: current.expenses + (Number(e.amount) || 0) });
      });

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

  getExpenseDistribution: async (): Promise<ChartDataPoint[]> => {
      // (Same code as previous step)
      try {
        const [projects, generalExpenses] = await Promise.all([projectAPI.getAll(), expensesAPI.getAll()]);
        const distMap: Record<string, number> = {};
  
        // 1. General Expenses
        generalExpenses.forEach(e => {
          const cat = e.category || 'Other';
          distMap[cat] = (distMap[cat] || 0) + (Number(e.amount) || 0);
        });
  
        // 2. Project Direct Expenses
        const totalProjectExpenses = projects.reduce((sum, p) => sum + (Number(p.expenses) || 0), 0);
        if (totalProjectExpenses > 0) {
          distMap['Project Direct'] = totalProjectExpenses;
        }
  
        return Object.entries(distMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
      } catch (error) { return []; }
  }
};