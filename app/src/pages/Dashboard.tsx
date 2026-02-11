/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FolderOpen,
} from 'lucide-react';

// Components
import KPICard from '@/components/dashboard/KPICard';
import StatCard from '@/components/dashboard/StatCard';
import {
  IncomeExpenseChart,
  ExpenseDistributionChart,
  DepartmentDistributionChart,
  ProfitTrendChart,
  TopProjectsChart,
} from '@/components/dashboard/Charts';

// Services
import { dashboardAPI } from '@/services/dashboardService';
import { projectAPI } from '@/services/projectService';
import { teamAPI } from '@/services/teamService'; 

import type { KPIData, MonthlyFinancialData, ChartDataPoint } from '@/types';

const Dashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyFinancialData[]>([]);
  const [expenseDistribution, setExpenseDistribution] = useState<ChartDataPoint[]>([]);
  const [departmentDistribution, setDepartmentDistribution] = useState<ChartDataPoint[]>([]);
  const [topProjects, setTopProjects] = useState<{ name: string; profit: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setIsLoading(true);
        const [kpi, monthly, expenseDist, deptDist, projects] = await Promise.all([
          dashboardAPI.getKPIData(),
          dashboardAPI.getMonthlyFinancialData(),
          dashboardAPI.getExpenseDistribution(),
          teamAPI.getDepartmentDistribution(),
          projectAPI.getAll({ sortBy: 'profit' })
        ]);

        setKpiData(kpi);
        setMonthlyData(monthly);
        setExpenseDistribution(expenseDist);
        setDepartmentDistribution(deptDist);

        const sortedProjects = projects
          .sort((a: { profit: any; }, b: { profit: any; }) => (b.profit || 0) - (a.profit || 0))
          .slice(0, 5)
          .map((p: { name: any; profit: any; budget: number; expenses: any; }) => ({ 
            name: p.name, 
            profit: p.profit || (p.budget - (p.expenses || 0))
          }));
        
        setTopProjects(sortedProjects);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  // Calculated Values
  const totalIncome = kpiData?.totalIncome || 0;
  const netProfit = kpiData?.netProfit || 0;
  const totalExpenses = kpiData?.totalExpenses || 0;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time overview of company performance.</p>
        </div>
        <div className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          Live Data • {new Date().toLocaleDateString('en-PK', { dateStyle: 'medium' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Income"
          value={totalIncome}
          icon={<DollarSign className="w-6 h-6" />}
          trend={100}
          trendLabel="All time"
        />
        <KPICard
          title="Net Profit"
          value={netProfit}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={profitMargin}
          trendLabel="Margin"
        />
        <KPICard
          title="Total Expenses"
          value={totalExpenses}
          icon={<TrendingDown className="w-6 h-6" />}
          trend={totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0}
          trendLabel="Projects + Office"
        />
        <KPICard
          title="Active Projects"
          value={kpiData?.activeProjects || 0}
          icon={<FolderOpen className="w-6 h-6" />}
          format="number"
          trendLabel="Open"
        />
      </div>

      {/* Secondary Stats (Breakdown) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Project Expenses: From Project Database */}
        <StatCard
          title="Project Direct"
          value={kpiData?.projectExpenses || 0}
          variant="warning"
          subtitle="From Projects (NAVTTC etc)"
        />
        {/* Tax Expenses: From Expenses Database */}
        <StatCard
          title="Tax Paid"
          value={kpiData?.taxExpenses || 0}
          variant="danger"
          subtitle="Via Expenses > Tax"
        />
        {/* Payroll: Placeholder / From Expenses Database */}
        <StatCard
          title="Salaries"
          value={kpiData?.salaryExpenses || 0}
          variant="default"
          subtitle="Via Expenses > Salaries"
        />
        <StatCard
          title="Active Team"
          value={kpiData?.teamSize || 0}
          subtitle="Employees"
          format="number"
          variant="success"
        />
        <StatCard
          title="Alumni"
          value={kpiData?.alumniSize || 0}
          subtitle="Past Staff"
          format="number"
          variant="default"
        />
        <StatCard
          title="Profit Margin"
          value={profitMargin}
          subtitle="Net / Income"
          format="percentage"
          variant="success"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[350px]">
            <IncomeExpenseChart data={monthlyData} />
        </div>
        <div className="h-[350px]">
            <ExpenseDistributionChart data={expenseDistribution} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[350px]">
            <ProfitTrendChart data={monthlyData} />
        </div>
        <div className="h-[350px]">
            <DepartmentDistributionChart data={departmentDistribution} />
        </div>
      </div>

      {/* Top Projects */}
      <div className="grid grid-cols-1 gap-6">
        <div className="h-[350px]">
            <TopProjectsChart data={topProjects} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;