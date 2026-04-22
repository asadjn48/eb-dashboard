



/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import {
  DollarSign, TrendingUp, TrendingDown, 
  FolderOpen, Users, PieChart, GraduationCap,
  ArrowUpRight, ArrowDownRight, Activity, Banknote
} from 'lucide-react';

// Components
import {
  IncomeExpenseChart,
  ExpenseDistributionChart,
  DepartmentDistributionChart,
} from '@/components/dashboard/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Services
import { dashboardAPI } from '@/services/dashboardService';
import { projectAPI } from '@/services/projectService';
import { teamAPI } from '@/services/teamService';
import type { KPIData, MonthlyFinancialData, ChartDataPoint, Project } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); 
  const [searchParams] = useSearchParams();
  
  // Read dates from the URL set by the Header
  const startDate = searchParams.get('start') || '';
  const endDate = searchParams.get('end') || '';

  const [kpi, setKpi] = useState<KPIData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyFinancialData[]>([]);
  const [expenseDist, setExpenseDist] = useState<ChartDataPoint[]>([]);
  const [deptDist, setDeptDist] = useState<ChartDataPoint[]>([]);
  const [topProjects, setTopProjects] = useState<Project[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;

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
        
        const sorted = projectList.sort((a, b) => b.budget - a.budget).slice(0, 5);
        setTopProjects(sorted);

      } catch (error) {
        console.error("Dashboard Load Error", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [startDate, endDate]); 

  // Calculate Pending Dues
  const totalPendingDues = projects.reduce((sum, p) => {
     const received = (p as any).receivedAmount || 0;
     return sum + (p.budget - received);
  }, 0);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-slate-400 gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#5d88c6] rounded-full animate-spin" />
        <p className="font-medium animate-pulse">Syncing Financial Data...</p>
      </div>
    );
  }

  return (
    // Fixed wrapper: removed overflow-x-hidden
    <div className="space-y-6 pb-10 w-full pt-2">
      
      {/* ========================================== */}
      {/* ROW 1: KPI CARDS (Premium Gradients) */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
        
        <Card onClick={() => navigate('/income')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(16,185,129,0.3)] transition-all duration-300 group rounded-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                    <DollarSign className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 duration-300" />
            </div>
            <p className="text-emerald-50 text-xs font-bold uppercase tracking-widest opacity-90">Total Income</p>
            <h3 className="text-2xl font-extrabold mt-1 tracking-tight truncate">{formatCurrency(kpi?.totalIncome || 0)}</h3>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
        </Card>

        <Card onClick={() => navigate('/payroll')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-amber-400 to-amber-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(245,158,11,0.3)] transition-all duration-300 group rounded-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-amber-100 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 duration-300" />
            </div>
            <p className="text-amber-50 text-xs font-bold uppercase tracking-widest opacity-90">Net Profit</p>
            <h3 className="text-2xl font-extrabold mt-1 tracking-tight truncate">{formatCurrency(kpi?.netProfit || 0)}</h3>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
        </Card>

        <Card onClick={() => navigate('/expenses')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-rose-400 to-rose-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(225,29,72,0.3)] transition-all duration-300 group rounded-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                    <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <ArrowDownRight className="w-5 h-5 text-rose-100 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 duration-300" />
            </div>
            <p className="text-rose-50 text-xs font-bold uppercase tracking-widest opacity-90">Total Expenses</p>
            <h3 className="text-2xl font-extrabold mt-1 tracking-tight truncate">{formatCurrency(kpi?.totalExpenses || 0)}</h3>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
        </Card>

        <Card onClick={() => navigate('/projects')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-indigo-500 to-indigo-700 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(99,102,241,0.3)] transition-all duration-300 group rounded-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                    <Banknote className="w-5 h-5 text-white" />
                </div>
                <Activity className="w-5 h-5 text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300" />
            </div>
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-90">Pending Dues</p>
            <h3 className="text-2xl font-extrabold mt-1 tracking-tight truncate">{formatCurrency(totalPendingDues)}</h3>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
        </Card>

        <Card onClick={() => navigate('/projects')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-lime-400 to-lime-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(132,204,22,0.3)] transition-all duration-300 group rounded-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                    <FolderOpen className="w-5 h-5 text-white" />
                </div>
            </div>
            <p className="text-lime-50 text-xs font-bold uppercase tracking-widest opacity-90">Total Projects</p>
            <h3 className="text-2xl font-extrabold mt-1 tracking-tight">{kpi?.activeProjects || 0}</h3>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
        </Card>

        <Card onClick={() => navigate('/team')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-sky-400 to-sky-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(14,165,233,0.3)] transition-all duration-300 group rounded-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                    <Users className="w-5 h-5 text-white" />
                </div>
            </div>
            <p className="text-sky-50 text-xs font-bold uppercase tracking-widest opacity-90">Active Team</p>
            <h3 className="text-2xl font-extrabold mt-1 tracking-tight">{kpi?.teamSize || 0}</h3>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
        </Card>

        <Card onClick={() => navigate('/alumni')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-slate-400 to-slate-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(100,116,139,0.3)] transition-all duration-300 group rounded-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                    <GraduationCap className="w-5 h-5 text-white" />
                </div>
            </div>
            <p className="text-slate-50 text-xs font-bold uppercase tracking-widest opacity-90">Alumni</p>
            <h3 className="text-2xl font-extrabold mt-1 tracking-tight">{kpi?.alumniCount || 0}</h3>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
        </Card>

        <Card className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-slate-800 text-white relative overflow-hidden cursor-default group rounded-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md shadow-inner">
                    <PieChart className="w-5 h-5 text-white" />
                </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-90">Avg Margin</p>
            <h3 className="text-2xl font-extrabold mt-1 tracking-tight">{(kpi?.projectMargin || 0).toFixed(1)}%</h3>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        </Card>

      </div>

   {/* ========================================== */}
      {/* ROW 2: MAIN CHARTS */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-5">
        <div className="lg:col-span-2 min-w-0">
           <div className="h-full min-h-[350px]">
             <IncomeExpenseChart data={monthlyData} />
           </div>
        </div>
        <div className="min-w-0">
           <div className="h-full min-h-[350px]">
             <ExpenseDistributionChart data={expenseDist} />
           </div>
        </div>
      </div>

{/* ========================================== */}
      {/* ROW 3: DETAILED BREAKDOWNS */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-5 w-full">
        
        {/* Scalable Department List */}
        <div className="min-w-0 w-full h-[350px]">
           <DepartmentDistributionChart data={deptDist} />
        </div>

        {/* Financial Status List */}
        <Card className="h-[350px] w-full shadow-sm border-slate-200/60 bg-white overflow-hidden flex flex-col min-w-0 rounded-2xl">
          <CardHeader className="py-4 px-5 border-b border-slate-100 bg-white shrink-0">
            <CardTitle className="text-base font-bold text-slate-800 tracking-tight">Financial Ledger</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto no-scrollbar flex-1">
            <div className="divide-y divide-slate-50">
               <StatRow label="Bank Balance" value={kpi?.netProfit || 0} color="text-emerald-600" />
               <StatRow label="Tax Paid" value={kpi?.taxPaid || 0} color="text-blue-600" />
               <StatRow label="Total Expenses" value={kpi?.totalExpenses || 0} color="text-rose-600" />
               <StatRow label="Salaries Paid" value={kpi?.salaryExpenses || 0} color="text-slate-600" />
            </div>
          </CardContent>
        </Card>

        {/* Top Projects List */}
        <Card className="h-[350px] w-full shadow-sm border-slate-200/60 bg-white overflow-hidden flex flex-col min-w-0 rounded-2xl">
          <CardHeader className="py-4 px-5 border-b border-slate-100 bg-white shrink-0">
            <CardTitle className="text-base font-bold text-slate-800 tracking-tight">Top Projects by Value</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto no-scrollbar flex-1">
            <div className="divide-y divide-slate-50">
              {topProjects.map((p) => (
                <div key={p.id} className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors group" onClick={() => navigate(`/projects/edit/${p.id}`)}>
                   <span className="text-sm font-semibold text-slate-700 truncate pr-4 group-hover:text-[#5d88c6] transition-colors" title={p.name}>{p.name}</span>
                   <span className="text-sm font-bold text-slate-900 shrink-0">{formatCurrency(p.budget)}</span>
                </div>
              ))}
              {topProjects.length === 0 && (
                <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                  <FolderOpen className="w-8 h-8 text-slate-200 mb-2" />
                  <span className="text-sm font-medium text-slate-400">No active projects found</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
    // </div>
//   );
// };

// --- Custom Sub-components ---
const StatRow = ({ label, value, color = "text-slate-900", isCurrency = true }: any) => (
  <div className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors group">
    <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">{label}</span>
    <span className={cn("text-sm font-bold", color)}>
      {isCurrency ? formatCurrency(value) : value}
    </span>
  </div>
);

export default Dashboard;