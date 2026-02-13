/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {
  DollarSign, TrendingUp, TrendingDown, 
  FolderOpen, Users, PieChart, GraduationCap, Calendar, 
  ArrowUpRight, ArrowDownRight, Activity, Banknote
} from 'lucide-react';

// Components
import {
  IncomeExpenseChart,
  ExpenseDistributionChart,
  DepartmentDistributionChart,
} from '@/components/dashboard/Charts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Services
import { dashboardAPI } from '@/services/dashboardService';
import { projectAPI } from '@/services/projectService';
import { teamAPI } from '@/services/teamService';
import type { KPIData, MonthlyFinancialData, ChartDataPoint, Project } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); 
  const [kpi, setKpi] = useState<KPIData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyFinancialData[]>([]);
  const [expenseDist, setExpenseDist] = useState<ChartDataPoint[]>([]);
  const [deptDist, setDeptDist] = useState<ChartDataPoint[]>([]);
  const [topProjects, setTopProjects] = useState<Project[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); // Need full list for Pending calc
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ROBUST FILTER STATE ---
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); 

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Calculate Date Range
        let start: Date | null = null;
        let end: Date | null = null;

        if (selectedYear !== 'all') {
            start = new Date(parseInt(selectedYear), 0, 1); // Jan 1st
            end = new Date(parseInt(selectedYear), 11, 31); // Dec 31st
            
            if (selectedMonth !== 'all') {
                const monthIndex = parseInt(selectedMonth);
                start = new Date(parseInt(selectedYear), monthIndex, 1);
                end = new Date(parseInt(selectedYear), monthIndex + 1, 0); 
            }
        }

        const [kpiData, monthly, expenses, depts, projectList] = await Promise.all([
          dashboardAPI.getKPIData(start, end),
          dashboardAPI.getMonthlyFinancialData(start, end),
          dashboardAPI.getExpenseDistribution(start, end),
          teamAPI.getDepartmentDistribution(), 
          projectAPI.getAll()
        ]);

        setKpi(kpiData);
        setMonthlyData(monthly);
        setExpenseDist(expenses);
        setDeptDist(depts); 
        setProjects(projectList);
        
        // Top 5 Projects by Budget (Revenue)
        const sorted = projectList
          .sort((a, b) => b.budget - a.budget)
          .slice(0, 5);
        setTopProjects(sorted);

      } catch (error) {
        console.error("Dashboard Load Error", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedYear, selectedMonth]); 

  // Helpers for Dropdowns
  const years = Array.from({length: 5}, (_, i) => (new Date().getFullYear() - i).toString());
  const months = [
    { val: '0', label: 'January' }, { val: '1', label: 'February' }, { val: '2', label: 'March' },
    { val: '3', label: 'April' }, { val: '4', label: 'May' }, { val: '5', label: 'June' },
    { val: '6', label: 'July' }, { val: '7', label: 'August' }, { val: '8', label: 'September' },
    { val: '9', label: 'October' }, { val: '10', label: 'November' }, { val: '11', label: 'December' }
  ];

  // Calculate Pending Dues (Total Budget - Total Received)
  // This is a special dashboard-only calculation based on all projects
  const totalPendingDues = projects.reduce((sum, p) => {
     const received = (p as any).receivedAmount || 0;
     // Only count pending for active/on-hold projects usually, but let's do all for financial overview
     return sum + (p.budget - received);
  }, 0);

  if (isLoading) return <div className="flex h-screen items-center justify-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-gray-50/95 backdrop-blur z-10 py-2">
        <h1 className="text-xl font-bold text-gray-900">Executive Overview</h1>
        
        <div className="flex flex-wrap items-center gap-2">
           <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-200 p-1">
              <Calendar className="w-4 h-4 ml-2 text-gray-400" />
              
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[110px] h-8 text-xs border-0 focus:ring-0">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map(m => <SelectItem key={m.val} value={m.val}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>

              <div className="w-px h-4 bg-gray-200 mx-1" />

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[80px] h-8 text-xs border-0 focus:ring-0 font-medium">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
           </div>
           
           {(selectedYear !== currentYear || selectedMonth !== 'all') && (
             <Button variant="ghost" size="sm" onClick={() => { setSelectedYear(currentYear); setSelectedMonth('all'); }} className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
               Reset
             </Button>
           )}
        </div>
      </div>

      {/* ROW 1: EXECUTIVE KPI CARDS (Solid Colors) */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8 gap-4">
        
        {/* 1. Total Income */}
        <Card 
          onClick={() => navigate('/projects')}
          className="p-4 border-0 shadow-md bg-emerald-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <DollarSign className="w-4 h-4 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Total Income</p>
            <h3 className="text-xl font-bold mt-0.5">{formatCurrency(kpi?.totalIncome || 0)}</h3>
          </div>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
        </Card>

        {/* 2. Net Profit */}
        <Card 
          onClick={() => navigate('/payroll')}
          className="p-4 border-0 shadow-md bg-amber-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-amber-100 text-[10px] font-bold uppercase tracking-wider">Net Profit</p>
            <h3 className="text-xl font-bold mt-0.5">{formatCurrency(kpi?.netProfit || 0)}</h3>
          </div>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
        </Card>

        {/* 3. Expenses */}
        <Card 
          onClick={() => navigate('/expenses')}
          className="p-4 border-0 shadow-md bg-rose-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingDown className="w-4 h-4 text-white" />
                </div>
                <ArrowDownRight className="w-4 h-4 text-rose-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-rose-100 text-[10px] font-bold uppercase tracking-wider">Expenses</p>
            <h3 className="text-xl font-bold mt-0.5">{formatCurrency(kpi?.totalExpenses || 0)}</h3>
          </div>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
        </Card>

        {/* 4. Pending Dues (New) */}
        <Card 
          onClick={() => navigate('/projects')}
          className="p-4 border-0 shadow-md bg-indigo-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Banknote className="w-4 h-4 text-white" />
                </div>
                <Activity className="w-4 h-4 text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Pending Dues</p>
            <h3 className="text-xl font-bold mt-0.5">{formatCurrency(totalPendingDues)}</h3>
          </div>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
        </Card>

        {/* 5. Active Projects */}
        <Card 
          onClick={() => navigate('/projects')}
          className="p-4 border-0 shadow-md bg-lime-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FolderOpen className="w-4 h-4 text-white" />
                </div>
            </div>
            <p className="text-lime-100 text-[10px] font-bold uppercase tracking-wider">Total Projects</p>
            <h3 className="text-xl font-bold mt-0.5">{kpi?.activeProjects || 0}</h3>
          </div>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
        </Card>

        {/* 6. Active Team */}
        <Card 
          onClick={() => navigate('/team')}
          className="p-4 border-0 shadow-md bg-sky-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Users className="w-4 h-4 text-white" />
                </div>
            </div>
            <p className="text-sky-100 text-[10px] font-bold uppercase tracking-wider">Active Team</p>
            <h3 className="text-xl font-bold mt-0.5">{kpi?.teamSize || 0}</h3>
          </div>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
        </Card>

        {/* 7. Alumni */}
        <Card 
          onClick={() => navigate('/alumni')}
          className="p-4 border-0 shadow-md bg-slate-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <GraduationCap className="w-4 h-4 text-white" />
                </div>
            </div>
            <p className="text-slate-200 text-[10px] font-bold uppercase tracking-wider">Alumni</p>
            <h3 className="text-xl font-bold mt-0.5">{kpi?.alumniCount || 0}</h3>
          </div>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
        </Card>

        {/* 8. Project Margin */}
        <Card 
          className="p-4 border-0 shadow-md bg-slate-800 text-white relative overflow-hidden cursor-default group"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                    <PieChart className="w-4 h-4 text-white" />
                </div>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Avg Margin</p>
            <h3 className="text-xl font-bold mt-0.5">{(kpi?.projectMargin || 0).toFixed(1)}%</h3>
          </div>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
        </Card>

      </div>

      {/* ROW 2: CHARTS (Responsive Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-fr">
        {/* Income Chart - 2/3 width */}
        <div className="lg:col-span-2 min-w-0">
           <div className="h-full min-h-[300px]">
             <IncomeExpenseChart data={monthlyData} />
           </div>
        </div>
        {/* Expense Chart - 1/3 width */}
        <div className="min-w-0">
           <div className="h-full min-h-[300px]">
             <ExpenseDistributionChart data={expenseDist} />
           </div>
        </div>
      </div>

      {/* ROW 3: DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="min-w-0 h-[300px]">
           <DepartmentDistributionChart data={deptDist} />
        </div>

        <Card className="h-[300px] border-gray-100 shadow-sm overflow-hidden flex flex-col min-w-0">
          <CardHeader className="py-2 px-4 border-b bg-gray-50/50 min-h-[40px] flex justify-center">
            <CardTitle className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Financial Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto custom-scrollbar">
            <div className="divide-y divide-gray-100">
               <StatRow label="Bank Balance" value={kpi?.netProfit || 0} color="text-emerald-600" />
               <StatRow label="Tax Paid" value={kpi?.taxPaid || 0} color="text-blue-600" />
               <StatRow label="Total Expenses" value={kpi?.totalExpenses || 0} color="text-rose-600" />
               <StatRow label="Salaries Paid" value={kpi?.salaryExpenses || 0} color="text-slate-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="h-[300px] border-gray-100 shadow-sm overflow-hidden flex flex-col min-w-0">
          <CardHeader className="py-2 px-4 border-b bg-gray-50/50 min-h-[40px] flex justify-center">
            <CardTitle className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Top Projects</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto custom-scrollbar">
            <div className="divide-y divide-gray-100">
              {topProjects.map((p) => (
                <div key={p.id} className="flex justify-between items-center px-4 py-2 hover:bg-gray-50/50 cursor-pointer" onClick={() => navigate(`/projects/edit/${p.id}`)}>
                   <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]" title={p.name}>{p.name}</span>
                   <span className="text-xs font-bold text-gray-900">{formatCurrency(p.budget)}</span>
                </div>
              ))}
              {topProjects.length === 0 && (
                <div className="p-4 text-center text-xs text-gray-400">No projects data for selected period</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper Component
const StatRow = ({ label, value, color = "text-gray-900", isCurrency = true }: any) => (
  <div className="flex justify-between items-center px-4 py-2.5 hover:bg-gray-50/50 transition-colors">
    <span className="text-xs text-gray-500">{label}</span>
    <span className={cn("text-xs font-bold", color)}>
      {isCurrency ? formatCurrency(value) : value}
    </span>
  </div>
);

export default Dashboard;