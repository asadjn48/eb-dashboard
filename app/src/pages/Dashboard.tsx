// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; 
// import {
//   DollarSign, TrendingUp, TrendingDown, 
//   FolderOpen, Users, PieChart, GraduationCap, Calendar, 
//   ArrowUpRight, ArrowDownRight, Activity, Banknote
// } from 'lucide-react';

// // Components
// import {
//   IncomeExpenseChart,
//   ExpenseDistributionChart,
//   DepartmentDistributionChart,
// } from '@/components/dashboard/Charts';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';

// // Services
// import { dashboardAPI } from '@/services/dashboardService';
// import { projectAPI } from '@/services/projectService';
// import { teamAPI } from '@/services/teamService';
// import type { KPIData, MonthlyFinancialData, ChartDataPoint, Project } from '@/types';
// import { formatCurrency } from '@/utils/formatters';
// import { cn } from '@/lib/utils';

// const Dashboard: React.FC = () => {
//   const navigate = useNavigate(); 
//   const [kpi, setKpi] = useState<KPIData | null>(null);
//   const [monthlyData, setMonthlyData] = useState<MonthlyFinancialData[]>([]);
//   const [expenseDist, setExpenseDist] = useState<ChartDataPoint[]>([]);
//   const [deptDist, setDeptDist] = useState<ChartDataPoint[]>([]);
//   const [topProjects, setTopProjects] = useState<Project[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]); // Need full list for Pending calc
//   const [isLoading, setIsLoading] = useState(true);
  
//   // --- ROBUST FILTER STATE ---
//   const currentYear = new Date().getFullYear().toString();
//   const [selectedYear, setSelectedYear] = useState<string>(currentYear);
//   const [selectedMonth, setSelectedMonth] = useState<string>('all'); 

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setIsLoading(true);
        
//         // Calculate Date Range
//         let start: Date | null = null;
//         let end: Date | null = null;

//         if (selectedYear !== 'all') {
//             start = new Date(parseInt(selectedYear), 0, 1); // Jan 1st
//             end = new Date(parseInt(selectedYear), 11, 31); // Dec 31st
            
//             if (selectedMonth !== 'all') {
//                 const monthIndex = parseInt(selectedMonth);
//                 start = new Date(parseInt(selectedYear), monthIndex, 1);
//                 end = new Date(parseInt(selectedYear), monthIndex + 1, 0); 
//             }
//         }

//         const [kpiData, monthly, expenses, depts, projectList] = await Promise.all([
//           dashboardAPI.getKPIData(start, end),
//           dashboardAPI.getMonthlyFinancialData(start, end),
//           dashboardAPI.getExpenseDistribution(start, end),
//           teamAPI.getDepartmentDistribution(), 
//           projectAPI.getAll()
//         ]);

//         setKpi(kpiData);
//         setMonthlyData(monthly);
//         setExpenseDist(expenses);
//         setDeptDist(depts); 
//         setProjects(projectList);
        
//         // Top 5 Projects by Budget (Revenue)
//         const sorted = projectList
//           .sort((a, b) => b.budget - a.budget)
//           .slice(0, 5);
//         setTopProjects(sorted);

//       } catch (error) {
//         console.error("Dashboard Load Error", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadData();
//   }, [selectedYear, selectedMonth]); 

//   // Helpers for Dropdowns
//   const years = Array.from({length: 5}, (_, i) => (new Date().getFullYear() - i).toString());
//   const months = [
//     { val: '0', label: 'January' }, { val: '1', label: 'February' }, { val: '2', label: 'March' },
//     { val: '3', label: 'April' }, { val: '4', label: 'May' }, { val: '5', label: 'June' },
//     { val: '6', label: 'July' }, { val: '7', label: 'August' }, { val: '8', label: 'September' },
//     { val: '9', label: 'October' }, { val: '10', label: 'November' }, { val: '11', label: 'December' }
//   ];

//   // Calculate Pending Dues (Total Budget - Total Received)
//   // This is a special dashboard-only calculation based on all projects
//   const totalPendingDues = projects.reduce((sum, p) => {
//      const received = (p as any).receivedAmount || 0;
//      // Only count pending for active/on-hold projects usually, but let's do all for financial overview
//      return sum + (p.budget - received);
//   }, 0);

//   if (isLoading) return <div className="flex h-screen items-center justify-center text-gray-500">Loading Dashboard...</div>;

//   return (
//     <div className="space-y-6 pb-10">
      
//       {/* Header with Filters */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-gray-50/95 backdrop-blur z-10 py-2">
//         <h1 className="text-xl font-bold text-gray-900">Executive Overview</h1>
        
//         <div className="flex flex-wrap items-center gap-2">
//            <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-200 p-1">
//               <Calendar className="w-4 h-4 ml-2 text-gray-400" />
              
//               <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//                 <SelectTrigger className="w-[110px] h-8 text-xs border-0 focus:ring-0">
//                   <SelectValue placeholder="Month" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Months</SelectItem>
//                   {months.map(m => <SelectItem key={m.val} value={m.val}>{m.label}</SelectItem>)}
//                 </SelectContent>
//               </Select>

//               <div className="w-px h-4 bg-gray-200 mx-1" />

//               <Select value={selectedYear} onValueChange={setSelectedYear}>
//                 <SelectTrigger className="w-[80px] h-8 text-xs border-0 focus:ring-0 font-medium">
//                   <SelectValue placeholder="Year" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Time</SelectItem>
//                   {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//            </div>
           
//            {(selectedYear !== currentYear || selectedMonth !== 'all') && (
//              <Button variant="ghost" size="sm" onClick={() => { setSelectedYear(currentYear); setSelectedMonth('all'); }} className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
//                Reset
//              </Button>
//            )}
//         </div>
//       </div>

//       {/* ROW 1: EXECUTIVE KPI CARDS (Solid Colors) */}
//       <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8 gap-4">
        
//         {/* 1. Total Income */}
//         <Card 
//           onClick={() => navigate('/projects')}
//           className="p-4 border-0 shadow-md bg-emerald-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
//         >
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-2">
//                 <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
//                     <DollarSign className="w-4 h-4 text-white" />
//                 </div>
//                 <ArrowUpRight className="w-4 h-4 text-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity" />
//             </div>
//             <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Total Income</p>
//             <h3 className="text-xl font-bold mt-0.5">{formatCurrency(kpi?.totalIncome || 0)}</h3>
//           </div>
//           <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
//         </Card>

//         {/* 2. Net Profit */}
//         <Card 
//           onClick={() => navigate('/payroll')}
//           className="p-4 border-0 shadow-md bg-amber-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
//         >
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-2">
//                 <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
//                     <TrendingUp className="w-4 h-4 text-white" />
//                 </div>
//                 <ArrowUpRight className="w-4 h-4 text-amber-100 opacity-0 group-hover:opacity-100 transition-opacity" />
//             </div>
//             <p className="text-amber-100 text-[10px] font-bold uppercase tracking-wider">Net Profit</p>
//             <h3 className="text-xl font-bold mt-0.5">{formatCurrency(kpi?.netProfit || 0)}</h3>
//           </div>
//           <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
//         </Card>

//         {/* 3. Expenses */}
//         <Card 
//           onClick={() => navigate('/expenses')}
//           className="p-4 border-0 shadow-md bg-rose-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
//         >
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-2">
//                 <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
//                     <TrendingDown className="w-4 h-4 text-white" />
//                 </div>
//                 <ArrowDownRight className="w-4 h-4 text-rose-100 opacity-0 group-hover:opacity-100 transition-opacity" />
//             </div>
//             <p className="text-rose-100 text-[10px] font-bold uppercase tracking-wider">Expenses</p>
//             <h3 className="text-xl font-bold mt-0.5">{formatCurrency(kpi?.totalExpenses || 0)}</h3>
//           </div>
//           <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
//         </Card>

//         {/* 4. Pending Dues (New) */}
//         <Card 
//           onClick={() => navigate('/projects')}
//           className="p-4 border-0 shadow-md bg-indigo-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
//         >
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-2">
//                 <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
//                     <Banknote className="w-4 h-4 text-white" />
//                 </div>
//                 <Activity className="w-4 h-4 text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity" />
//             </div>
//             <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Pending Dues</p>
//             <h3 className="text-xl font-bold mt-0.5">{formatCurrency(totalPendingDues)}</h3>
//           </div>
//           <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
//         </Card>

//         {/* 5. Active Projects */}
//         <Card 
//           onClick={() => navigate('/projects')}
//           className="p-4 border-0 shadow-md bg-lime-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
//         >
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-2">
//                 <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
//                     <FolderOpen className="w-4 h-4 text-white" />
//                 </div>
//             </div>
//             <p className="text-lime-100 text-[10px] font-bold uppercase tracking-wider">Total Projects</p>
//             <h3 className="text-xl font-bold mt-0.5">{kpi?.activeProjects || 0}</h3>
//           </div>
//           <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
//         </Card>

//         {/* 6. Active Team */}
//         <Card 
//           onClick={() => navigate('/team')}
//           className="p-4 border-0 shadow-md bg-sky-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
//         >
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-2">
//                 <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
//                     <Users className="w-4 h-4 text-white" />
//                 </div>
//             </div>
//             <p className="text-sky-100 text-[10px] font-bold uppercase tracking-wider">Active Team</p>
//             <h3 className="text-xl font-bold mt-0.5">{kpi?.teamSize || 0}</h3>
//           </div>
//           <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
//         </Card>

//         {/* 7. Alumni */}
//         <Card 
//           onClick={() => navigate('/alumni')}
//           className="p-4 border-0 shadow-md bg-slate-500 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
//         >
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-2">
//                 <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
//                     <GraduationCap className="w-4 h-4 text-white" />
//                 </div>
//             </div>
//             <p className="text-slate-200 text-[10px] font-bold uppercase tracking-wider">Alumni</p>
//             <h3 className="text-xl font-bold mt-0.5">{kpi?.alumniCount || 0}</h3>
//           </div>
//           <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
//         </Card>

//         {/* 8. Project Margin */}
//         <Card 
//           className="p-4 border-0 shadow-md bg-slate-800 text-white relative overflow-hidden cursor-default group"
//         >
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-2">
//                 <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
//                     <PieChart className="w-4 h-4 text-white" />
//                 </div>
//             </div>
//             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Avg Margin</p>
//             <h3 className="text-xl font-bold mt-0.5">{(kpi?.projectMargin || 0).toFixed(1)}%</h3>
//           </div>
//           <div className="absolute -right-4 -bottom-6 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
//         </Card>

//       </div>

//       {/* ROW 2: CHARTS (Responsive Grid) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-fr">
//         {/* Income Chart - 2/3 width */}
//         <div className="lg:col-span-2 min-w-0">
//            <div className="h-full min-h-[300px]">
//              <IncomeExpenseChart data={monthlyData} />
//            </div>
//         </div>
//         {/* Expense Chart - 1/3 width */}
//         <div className="min-w-0">
//            <div className="h-full min-h-[300px]">
//              <ExpenseDistributionChart data={expenseDist} />
//            </div>
//         </div>
//       </div>

//       {/* ROW 3: DETAILS */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="min-w-0 h-[300px]">
//            <DepartmentDistributionChart data={deptDist} />
//         </div>

//         <Card className="h-[300px] border-gray-100 shadow-sm overflow-hidden flex flex-col min-w-0">
//           <CardHeader className="py-2 px-4 border-b bg-gray-50/50 min-h-[40px] flex justify-center">
//             <CardTitle className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Financial Status</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0 overflow-y-auto custom-scrollbar">
//             <div className="divide-y divide-gray-100">
//                <StatRow label="Bank Balance" value={kpi?.netProfit || 0} color="text-emerald-600" />
//                <StatRow label="Tax Paid" value={kpi?.taxPaid || 0} color="text-blue-600" />
//                <StatRow label="Total Expenses" value={kpi?.totalExpenses || 0} color="text-rose-600" />
//                <StatRow label="Salaries Paid" value={kpi?.salaryExpenses || 0} color="text-slate-600" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="h-[300px] border-gray-100 shadow-sm overflow-hidden flex flex-col min-w-0">
//           <CardHeader className="py-2 px-4 border-b bg-gray-50/50 min-h-[40px] flex justify-center">
//             <CardTitle className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Top Projects</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0 overflow-y-auto custom-scrollbar">
//             <div className="divide-y divide-gray-100">
//               {topProjects.map((p) => (
//                 <div key={p.id} className="flex justify-between items-center px-4 py-2 hover:bg-gray-50/50 cursor-pointer" onClick={() => navigate(`/projects/edit/${p.id}`)}>
//                    <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]" title={p.name}>{p.name}</span>
//                    <span className="text-xs font-bold text-gray-900">{formatCurrency(p.budget)}</span>
//                 </div>
//               ))}
//               {topProjects.length === 0 && (
//                 <div className="p-4 text-center text-xs text-gray-400">No projects data for selected period</div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// // Helper Component
// const StatRow = ({ label, value, color = "text-gray-900", isCurrency = true }: any) => (
//   <div className="flex justify-between items-center px-4 py-2.5 hover:bg-gray-50/50 transition-colors">
//     <span className="text-xs text-gray-500">{label}</span>
//     <span className={cn("text-xs font-bold", color)}>
//       {isCurrency ? formatCurrency(value) : value}
//     </span>
//   </div>
// );

// export default Dashboard;









































// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; 
// import {
//   DollarSign, TrendingUp, TrendingDown, 
//   FolderOpen, Users, PieChart, GraduationCap, CalendarDays, 
//   ArrowUpRight, ArrowDownRight, Activity, Banknote, X
// } from 'lucide-react';

// // Components
// import {
//   IncomeExpenseChart,
//   ExpenseDistributionChart,
//   DepartmentDistributionChart,
// } from '@/components/dashboard/Charts';
// import { Card, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';

// // Services
// import { dashboardAPI } from '@/services/dashboardService';
// import { projectAPI } from '@/services/projectService';
// import { teamAPI } from '@/services/teamService';
// import type { KPIData, MonthlyFinancialData, ChartDataPoint, Project } from '@/types';
// import { formatCurrency } from '@/utils/formatters';
// import { cn } from '@/lib/utils';

// const Dashboard: React.FC = () => {
//   const navigate = useNavigate(); 
//   const [kpi, setKpi] = useState<KPIData | null>(null);
//   const [monthlyData, setMonthlyData] = useState<MonthlyFinancialData[]>([]);
//   const [expenseDist, setExpenseDist] = useState<ChartDataPoint[]>([]);
//   const [deptDist, setDeptDist] = useState<ChartDataPoint[]>([]);
//   const [topProjects, setTopProjects] = useState<Project[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]); 
//   const [isLoading, setIsLoading] = useState(true);
  
//   // --- REAL-TIME GLOBAL DATE FILTERS ---
//   const [startDate, setStartDate] = useState<string>('');
//   const [endDate, setEndDate] = useState<string>(''); 

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setIsLoading(true);
        
//         // Parse dates for the API
//         const start = startDate ? new Date(startDate) : null;
//         // If end date is selected, set it to the end of that day
//         const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;

//         const [kpiData, monthly, expenses, depts, projectList] = await Promise.all([
//           dashboardAPI.getKPIData(start, end),
//           dashboardAPI.getMonthlyFinancialData(start, end),
//           dashboardAPI.getExpenseDistribution(start, end),
//           teamAPI.getDepartmentDistribution(), 
//           projectAPI.getAll()
//         ]);

//         setKpi(kpiData);
//         setMonthlyData(monthly);
//         setExpenseDist(expenses);
//         setDeptDist(depts); 
//         setProjects(projectList);
        
//         // Top 5 Projects by Budget
//         const sorted = projectList
//           .sort((a, b) => b.budget - a.budget)
//           .slice(0, 5);
//         setTopProjects(sorted);

//       } catch (error) {
//         console.error("Dashboard Load Error", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     loadData();
//   }, [startDate, endDate]); 

//   // Calculate Pending Dues
//   const totalPendingDues = projects.reduce((sum, p) => {
//      const received = (p as any).receivedAmount || 0;
//      return sum + (p.budget - received);
//   }, 0);

//   const clearFilters = () => {
//     setStartDate('');
//     setEndDate('');
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-[80vh] flex-col items-center justify-center text-slate-400 gap-4">
//         <div className="w-12 h-12 border-4 border-slate-200 border-t-[#5d88c6] rounded-full animate-spin" />
//         <p className="font-medium animate-pulse">Syncing Financial Data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="">
      
//       {/* ========================================== */}
//       {/* HEADER & GLOBAL FILTERS */}
//       {/* ========================================== */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 top-0 bg-slate-50/90 backdrop-blur-md z-20 py-4 -mx-4 px-4 pt-0 sm:mx-0 sm:px-0 border-b sm:border-b-0 border-slate-200/60">
//         <div>
//           <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Overview</h1>
//           <p className="text-xs font-medium text-slate-500 mt-1">Real-time enterprise metrics & cashflow</p>
//         </div>
        
//         {/* Sleek Date Range Picker */}
//         <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-slate-200/60 p-1.5 w-full md:w-auto overflow-x-auto">
//           <div className="flex items-center pl-2 shrink-0">
//             <CalendarDays className="w-4 h-4 text-slate-400 mr-2" />
//             <Input 
//               type="date" 
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="h-8 w-[125px] text-xs bg-transparent border-0 focus-visible:ring-0 shadow-none px-1 cursor-pointer font-medium text-slate-700"
//               title="Start Date"
//             />
//           </div>
//           <span className="text-slate-300 text-xs font-bold px-1 shrink-0">to</span>
//           <div className="flex items-center shrink-0">
//             <Input 
//               type="date" 
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="h-8 w-[125px] text-xs bg-transparent border-0 focus-visible:ring-0 shadow-none px-1 cursor-pointer font-medium text-slate-700"
//               title="End Date"
//             />
//           </div>
          
//           {(startDate || endDate) && (
//             <div className="pr-1 pl-2 border-l border-slate-100 shrink-0">
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 onClick={clearFilters} 
//                 className="h-7 w-7 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-50"
//                 title="Clear Filters"
//               >
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* ROW 1: KPI CARDS (Responsive Grid) */}
//       {/* ========================================== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
        
//         {/* 1. Total Income */}
//         <Card onClick={() => navigate('/projects')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(16,185,129,0.3)] transition-all duration-300 group rounded-2xl">
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-4">
//                 <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
//                     <DollarSign className="w-5 h-5 text-white" />
//                 </div>
//                 <ArrowUpRight className="w-5 h-5 text-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 duration-300" />
//             </div>
//             <p className="text-emerald-50 text-xs font-bold uppercase tracking-widest opacity-90">Total Income</p>
//             <h3 className="text-2xl font-extrabold mt-1 tracking-tight truncate">{formatCurrency(kpi?.totalIncome || 0)}</h3>
//           </div>
//           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
//         </Card>

//         {/* 2. Net Profit */}
//         <Card onClick={() => navigate('/payroll')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-amber-400 to-amber-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(245,158,11,0.3)] transition-all duration-300 group rounded-2xl">
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-4">
//                 <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
//                     <TrendingUp className="w-5 h-5 text-white" />
//                 </div>
//                 <ArrowUpRight className="w-5 h-5 text-amber-100 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 duration-300" />
//             </div>
//             <p className="text-amber-50 text-xs font-bold uppercase tracking-widest opacity-90">Net Profit</p>
//             <h3 className="text-2xl font-extrabold mt-1 tracking-tight truncate">{formatCurrency(kpi?.netProfit || 0)}</h3>
//           </div>
//           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
//         </Card>

//         {/* 3. Expenses */}
//         <Card onClick={() => navigate('/expenses')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-rose-400 to-rose-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(225,29,72,0.3)] transition-all duration-300 group rounded-2xl">
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-4">
//                 <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
//                     <TrendingDown className="w-5 h-5 text-white" />
//                 </div>
//                 <ArrowDownRight className="w-5 h-5 text-rose-100 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 duration-300" />
//             </div>
//             <p className="text-rose-50 text-xs font-bold uppercase tracking-widest opacity-90">Total Expenses</p>
//             <h3 className="text-2xl font-extrabold mt-1 tracking-tight truncate">{formatCurrency(kpi?.totalExpenses || 0)}</h3>
//           </div>
//           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
//         </Card>

//         {/* 4. Pending Dues */}
//         <Card onClick={() => navigate('/projects')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-indigo-500 to-indigo-700 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(99,102,241,0.3)] transition-all duration-300 group rounded-2xl">
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-4">
//                 <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
//                     <Banknote className="w-5 h-5 text-white" />
//                 </div>
//                 <Activity className="w-5 h-5 text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300" />
//             </div>
//             <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-90">Pending Dues</p>
//             <h3 className="text-2xl font-extrabold mt-1 tracking-tight truncate">{formatCurrency(totalPendingDues)}</h3>
//           </div>
//           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
//         </Card>

//         {/* 5. Active Projects */}
//         <Card onClick={() => navigate('/projects')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-lime-400 to-lime-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(132,204,22,0.3)] transition-all duration-300 group rounded-2xl">
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-4">
//                 <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
//                     <FolderOpen className="w-5 h-5 text-white" />
//                 </div>
//             </div>
//             <p className="text-lime-50 text-xs font-bold uppercase tracking-widest opacity-90">Total Projects</p>
//             <h3 className="text-2xl font-extrabold mt-1 tracking-tight">{kpi?.activeProjects || 0}</h3>
//           </div>
//           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
//         </Card>

//         {/* 6. Active Team */}
//         <Card onClick={() => navigate('/team')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-sky-400 to-sky-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(14,165,233,0.3)] transition-all duration-300 group rounded-2xl">
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-4">
//                 <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
//                     <Users className="w-5 h-5 text-white" />
//                 </div>
//             </div>
//             <p className="text-sky-50 text-xs font-bold uppercase tracking-widest opacity-90">Active Team</p>
//             <h3 className="text-2xl font-extrabold mt-1 tracking-tight">{kpi?.teamSize || 0}</h3>
//           </div>
//           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
//         </Card>

//         {/* 7. Alumni */}
//         <Card onClick={() => navigate('/alumni')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-slate-400 to-slate-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(100,116,139,0.3)] transition-all duration-300 group rounded-2xl">
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-4">
//                 <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
//                     <GraduationCap className="w-5 h-5 text-white" />
//                 </div>
//             </div>
//             <p className="text-slate-50 text-xs font-bold uppercase tracking-widest opacity-90">Alumni</p>
//             <h3 className="text-2xl font-extrabold mt-1 tracking-tight">{kpi?.alumniCount || 0}</h3>
//           </div>
//           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
//         </Card>

//         {/* 8. Project Margin */}
//         <Card className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-slate-800 text-white relative overflow-hidden cursor-default group rounded-2xl">
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-4">
//                 <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md shadow-inner">
//                     <PieChart className="w-5 h-5 text-white" />
//                 </div>
//             </div>
//             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-90">Avg Margin</p>
//             <h3 className="text-2xl font-extrabold mt-1 tracking-tight">{(kpi?.projectMargin || 0).toFixed(1)}%</h3>
//           </div>
//           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
//         </Card>

//       </div>

//       {/* ========================================== */}
//       {/* ROW 2: MAIN CHARTS */}
//       {/* ========================================== */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-5">
//         <div className="lg:col-span-2 min-w-0">
//            <div className="h-full min-h-[350px]">
//              <IncomeExpenseChart data={monthlyData} />
//            </div>
//         </div>
//         <div className="min-w-0">
//            <div className="h-full min-h-[350px]">
//              <ExpenseDistributionChart data={expenseDist} />
//            </div>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* ROW 3: DETAILED BREAKDOWNS */}
//       {/* ========================================== */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-5">
        
//         {/* Department Chart */}
//         <div className="min-w-0 h-[320px]">
//            <DepartmentDistributionChart data={deptDist} />
//         </div>

//         {/* Financial Status List */}
//         <Card className="h-[320px] shadow-sm border-slate-200/60 bg-white overflow-hidden flex flex-col min-w-0 rounded-2xl">
//           <CardHeader className="py-4 px-5 border-b border-slate-100 bg-white shrink-0">
//             <CardTitle className="text-base font-bold text-slate-800 tracking-tight">Financial Ledger</CardTitle>
//           </CardHeader>
//           {/* <CardContent className="p-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200"> */}
//             <div className="divide-y divide-slate-50">
//                <StatRow label="Bank Balance" value={kpi?.netProfit || 0} color="text-emerald-600" />
//                <StatRow label="Tax Paid" value={kpi?.taxPaid || 0} color="text-blue-600" />
//                <StatRow label="Total Expenses" value={kpi?.totalExpenses || 0} color="text-rose-600" />
//                <StatRow label="Salaries Paid" value={kpi?.salaryExpenses || 0} color="text-slate-600" />
//             </div>
//           {/* </CardContent> */}
//         </Card>

//         {/* Top Projects List */}
//         <Card className="h-[320px] shadow-sm border-slate-200/60 bg-white overflow-hidden flex flex-col min-w-0 rounded-2xl">
//           <CardHeader className="py-4 px-5 border-b border-slate-100 bg-white shrink-0">
//             <CardTitle className="text-base font-bold text-slate-800 tracking-tight">Top Projects by Value</CardTitle>
//           </CardHeader>
//           {/* <CardContent className="p-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200"> */}
//             <div className="divide-y divide-slate-50">
//               {topProjects.map((p) => (
//                 <div key={p.id} className="flex justify-between items-center px-5 py-3 hover:bg-slate-50/80 cursor-pointer transition-colors group" onClick={() => navigate(`/projects/edit/${p.id}`)}>
//                    <span className="text-sm font-semibold text-slate-700 truncate pr-4 group-hover:text-[#5d88c6] transition-colors" title={p.name}>{p.name}</span>
//                    <span className="text-sm font-bold text-slate-900 shrink-0">{formatCurrency(p.budget)}</span>
//                 </div>
//               ))}
//               {topProjects.length === 0 && (
//                 <div className="p-8 text-center flex flex-col items-center justify-center h-full">
//                   <FolderOpen className="w-8 h-8 text-slate-200 mb-2" />
//                   <span className="text-sm font-medium text-slate-400">No active projects found</span>
//                 </div>
//               )}
//             </div>
//           {/* </CardContent> */}
//         </Card>

//       </div>
//     </div>
//   );
// };

// // --- Custom Sub-components ---
// const StatRow = ({ label, value, color = "text-slate-900", isCurrency = true }: any) => (
//   <div className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors group">
//     <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">{label}</span>
//     <span className={cn("text-sm font-bold", color)}>
//       {isCurrency ? formatCurrency(value) : value}
//     </span>
//   </div>
// );

// export default Dashboard;













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
        
        // Parse dates for the API
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
        
        <Card onClick={() => navigate('/projects')} className="min-w-0 p-5 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(16,185,129,0.3)] transition-all duration-300 group rounded-2xl">
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