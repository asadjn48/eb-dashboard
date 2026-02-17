
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useState, useMemo } from 'react';
// import { Search, Plus, Wallet } from 'lucide-react';

// // UI
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// // Custom Components
// import { ExpenseModal } from '@/components/expenses/ExpenseModal';
// import { BudgetModal } from '@/components/expenses/BudgetModal';
// import { ExpenseStats } from '@/components/expenses/ExpenseStats';
// import { ExpenseTable } from '@/components/expenses/ExpenseTable';
// import { ExpenseDistributionChart } from '@/components/dashboard/Charts';

// // Services & Utils
// import { expensesAPI } from '@/services/expenseService';
// import { incomeAPI } from '@/services/incomeService';
// import { formatCurrency } from '@/utils/formatters';
// import type { Expense, ExpenseCategory, Income } from '@/types';

// // Categories
// const CATEGORIES: ExpenseCategory[] = [
//   'Rent', 'WiFi', 'Electricity', 'Food', 'Maintenance', 
//   'Guest', 'Salaries', 'Tax', 'Equipment', 'Software', 'Other'
// ];

// // Helper
// const CustomProgressBar = ({ value, colorClass }: { value: number, colorClass: string }) => (
//   <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
//     <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${value}%` }} />
//   </div>
// );

// const Expenses: React.FC = () => {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [income, setIncome] = useState<Income[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Modal States
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
//   const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

//   // Filters
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState({ category: 'all', status: 'all' });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const [expenseData, incomeData] = await Promise.all([
//         expensesAPI.getAll(),
//         incomeAPI.getAll()
//       ]);
//       setExpenses(expenseData);
//       setIncome(incomeData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Calculations
//   const { filteredExpenses, summary, distribution } = useMemo(() => {
//     const filtered = expenses.filter(e => {
//       const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                             e.category.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesCat = filters.category === 'all' || e.category === filters.category;
//       const matchesStatus = filters.status === 'all' || e.status === filters.status;
//       return matchesSearch && matchesCat && matchesStatus;
//     });

//     const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
//     const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
//     const pending = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
//     const pendingCount = expenses.filter(e => e.status === 'pending').length;

//     const distMap: Record<string, number> = {};
//     expenses.forEach(e => { distMap[e.category] = (distMap[e.category] || 0) + e.amount });
//     const sortedDist = Object.entries(distMap).sort((a, b) => b[1] - a[1]);
    
//     const chartData = sortedDist.map(([name, value]) => ({ name, value }));

//     return { 
//       filteredExpenses: filtered, 
//       summary: { totalBudget: totalIncome, totalExpenses, pending, pendingCount }, 
//       distribution: chartData 
//     };
//   }, [expenses, income, searchQuery, filters]);

//   // Handlers
//   const handleSaveExpense = async (data: Partial<Expense>) => {
//     try {
//       if (editingExpense) {
//         await expensesAPI.update(editingExpense.id, data);
//         setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { ...e, ...data } : e));
//       } else {
//         const newExpense = await expensesAPI.add({
//           description: data.description || 'Expense',
//           amount: Number(data.amount),
//           category: data.category as ExpenseCategory,
//           date: data.date || new Date().toISOString(),
//           status: data.status || 'paid',
//           isRecurring: data.isRecurring || false,
//         });
//         setExpenses(prev => [newExpense, ...prev]);
//       }
//       setIsExpenseModalOpen(false);
//       setEditingExpense(undefined);
//     } catch (error) {
//       alert("Operation failed.");
//     }
//   };

//   const handleSaveBudget = async (data: { source: string; amount: number; date: string }) => {
//     try {
//         const newIncome = await incomeAPI.add(data);
//         setIncome(prev => [newIncome, ...prev]); 
//         setIsBudgetModalOpen(false);
//     } catch (error) {
//         console.error("Budget add failed", error);
//         alert("Failed to add budget.");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm("Delete this expense?")) {
//       try {
//         await expensesAPI.delete(id);
//         setExpenses(prev => prev.filter(e => e.id !== id));
//       } catch (error) {
//         alert("Failed to delete.");
//       }
//     }
//   };

//   const openEditModal = (expense: Expense) => {
//     setEditingExpense(expense);
//     setIsExpenseModalOpen(true);
//   };

//   const openNewModal = () => {
//     setEditingExpense(undefined);
//     setIsExpenseModalOpen(true);
//   };

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Expense Tracker</h1>
//           <p className="text-gray-500 text-sm mt-1">Manage office budget, taxes, and operational costs.</p>
//         </div>
        
//         <div className="flex gap-3">
//             <Button 
//                 onClick={() => setIsBudgetModalOpen(true)} 
//                 variant="outline"
//                 className="bg-white hover:bg-gray-50 text-gray-700 shadow-sm border-gray-200"
//             >
//                 <Wallet className="w-4 h-4 mr-2 text-emerald-600" /> Add Funds
//             </Button>

//             <Button 
//                 onClick={openNewModal} 
//             >
//                 <Plus className="w-4 h-4 mr-2" /> Record Expense
//             </Button>
//         </div>
//       </div>

//       <ExpenseStats 
//         budget={summary.totalBudget} 
//         totalSpent={summary.totalExpenses}
//         pending={summary.pending} 
//         pendingCount={summary.pendingCount} 
//       />

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
//         {/* Chart Card */}
//         <Card className="shadow-sm border-gray-100/60 overflow-hidden flex flex-col h-[450px]">
//             <CardHeader className="pb-2 shrink-0">
//                 <CardTitle className="text-base font-semibold text-gray-800">Spend Distribution</CardTitle>
//             </CardHeader>
//             <CardContent className="p-4 flex-1">
//                 <ExpenseDistributionChart data={distribution} />
//             </CardContent>
//         </Card>

//         {/* Category Breakdown Card (Fixed Layout) */}
//         <Card className="shadow-sm border-gray-100/60 overflow-hidden flex flex-col h-[450px]">
//           <CardHeader className="pb-2 shrink-0">
//             <CardTitle className="text-base font-semibold text-gray-800">Category Breakdown</CardTitle>
//           </CardHeader>
          
//           {/* Scrollable Content Area */}
//           <CardContent className="p-6 flex-1 overflow-y-auto">
//             <div className="space-y-6">
//               {CATEGORIES.map((category) => {
//                 const catTotal = expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0);
//                 if (catTotal === 0) return null;
//                 const percentage = summary.totalExpenses > 0 ? (catTotal / summary.totalExpenses) * 100 : 0;
                
//                 const colorMap: Record<string, string> = {
//                   Rent: 'bg-blue-500', WiFi: 'bg-purple-500', Electricity: 'bg-yellow-500',
//                   Food: 'bg-green-500', Maintenance: 'bg-orange-500', Guest: 'bg-pink-500', 
//                   Other: 'bg-gray-500', Tax: 'bg-red-500', Salaries: 'bg-teal-500',
//                   Equipment: 'bg-indigo-500', Software: 'bg-cyan-500'
//                 };

//                 return (
//                   <div key={category} className="space-y-2 group">
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="font-medium text-gray-700">{category}</span>
//                       <span className="font-semibold text-gray-900">{formatCurrency(catTotal)}</span>
//                     </div>
//                     <CustomProgressBar value={percentage} colorClass={colorMap[category] || 'bg-gray-500'} />
//                   </div>
//                 );
//               })}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filter Bar */}
//       <div className="flex flex-col lg:flex-row gap-4 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <Input
//             placeholder="Search expenses..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:bg-gray-50 transition-all rounded-lg"
//           />
//         </div>
//         <div className="flex gap-2 p-1">
//           <Select value={filters.category} onValueChange={(v) => setFilters(f => ({...f, category: v}))}>
//             <SelectTrigger className="w-[150px] border-0 bg-gray-50 focus:ring-0 text-sm font-medium text-gray-600"><SelectValue placeholder="Category" /></SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
//             </SelectContent>
//           </Select>
//           <Select value={filters.status} onValueChange={(v) => setFilters(f => ({...f, status: v}))}>
//             <SelectTrigger className="w-[130px] border-0 bg-gray-50 focus:ring-0 text-sm font-medium text-gray-600"><SelectValue placeholder="Status" /></SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="paid">Paid</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <ExpenseTable 
//         expenses={filteredExpenses} 
//         isLoading={isLoading} 
//         onEdit={openEditModal} 
//         onDelete={handleDelete} 
//       />

//       <ExpenseModal 
//         isOpen={isExpenseModalOpen} 
//         onClose={() => setIsExpenseModalOpen(false)} 
//         onSave={handleSaveExpense} 
//         categories={CATEGORIES}
//         initialData={editingExpense} 
//       />

//       <BudgetModal 
//         isOpen={isBudgetModalOpen}
//         onClose={() => setIsBudgetModalOpen(false)}
//         onSave={handleSaveBudget}
//       />
//     </div>
//   );
// };

// export default Expenses;















// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useState, useMemo } from 'react';
// import { Search, Plus, Wallet, ArrowUpCircle, ArrowDownCircle, PieChart, History } from 'lucide-react';

// // UI
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // Custom Components
// import { ExpenseModal } from '@/components/expenses/ExpenseModal';
// import { BudgetModal } from '@/components/expenses/BudgetModal';
// import { ExpenseTable } from '@/components/expenses/ExpenseTable';
// import { ExpenseDistributionChart } from '@/components/dashboard/Charts'; // Ensure this component exists

// // Services & Utils
// import { expensesAPI } from '@/services/expenseService';
// import { incomeAPI } from '@/services/incomeService';
// import { formatCurrency } from '@/utils/formatters';
// import type { Expense, ExpenseCategory, Income } from '@/types';
// import { cn } from '@/lib/utils';

// // Categories
// const CATEGORIES: ExpenseCategory[] = [
//   'Rent', 'WiFi', 'Electricity', 'Food', 'Maintenance', 
//   'Guest', 'Salaries', 'Tax', 'Equipment', 'Software', 'Other'
// ];

// // Helper: Progress Bar
// const CustomProgressBar = ({ value, colorClass }: { value: number, colorClass: string }) => (
//   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
//     <div className={cn("h-full rounded-full transition-all duration-500", colorClass)} style={{ width: `${Math.min(value, 100)}%` }} />
//   </div>
// );

// // Helper: Stat Card
// const StatCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
//   <Card className="border-none shadow-sm bg-white p-5 flex flex-col justify-between h-full">
//     <div className="flex justify-between items-start">
//       <div>
//         <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
//         <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
//       </div>
//       <div className={cn("p-2.5 rounded-xl bg-opacity-10", colorClass)}>
//         <Icon className={cn("w-5 h-5", colorClass.replace("bg-", "text-"))} />
//       </div>
//     </div>
//     {trend && (
//        <div className="mt-4 text-xs font-medium text-gray-500 flex items-center gap-1">
//           {trend}
//        </div>
//     )}
//   </Card>
// );

// const Expenses: React.FC = () => {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [income, setIncome] = useState<Income[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Modal States
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
//   const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

//   // Filters
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState({ category: 'all', status: 'all' });
//   const [viewMode, setViewMode] = useState<'expenses' | 'income'>('expenses');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const [expenseData, incomeData] = await Promise.all([
//         expensesAPI.getAll(),
//         incomeAPI.getAll()
//       ]);
//       setExpenses(expenseData);
//       setIncome(incomeData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- Calculations ---
//   const { filteredData, summary, distribution } = useMemo(() => {
//     // 1. Filter Logic
//     let dataList: any[] = viewMode === 'expenses' ? expenses : income;
    
//     const filtered = dataList.filter(item => {
//       const searchLower = searchQuery.toLowerCase();
//       // Handle both Income (source) and Expense (description/category) fields
//       const textMatch = (item.description || item.source || '').toLowerCase().includes(searchLower) ||
//                         (item.category || '').toLowerCase().includes(searchLower);
      
//       const catMatch = viewMode === 'income' || filters.category === 'all' || item.category === filters.category;
//       const statusMatch = viewMode === 'income' || filters.status === 'all' || item.status === filters.status;
      
//       return textMatch && catMatch && statusMatch;
//     });

//     // 2. Summary Stats
//     const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
//     const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
//     const balance = totalIncome - totalExpenses;
//     const pending = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

//     // 3. Distribution Chart Data
//     const distMap: Record<string, number> = {};
//     expenses.forEach(e => { distMap[e.category] = (distMap[e.category] || 0) + e.amount });
//     const sortedDist = Object.entries(distMap)
//         .map(([name, value]) => ({ name, value }))
//         .sort((a, b) => b.value - a.value);

//     return { 
//       filteredData: filtered, 
//       summary: { totalIncome, totalExpenses, balance, pending }, 
//       distribution: sortedDist 
//     };
//   }, [expenses, income, searchQuery, filters, viewMode]);

//   // --- Handlers ---

//   const handleSaveExpense = async (data: Partial<Expense>) => {
//     try {
//       if (editingExpense) {
//         await expensesAPI.update(editingExpense.id, data);
//         setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { ...e, ...data } : e));
//       } else {
//         const newExpense = await expensesAPI.add({
//           description: data.description || 'Expense',
//           amount: Number(data.amount),
//           category: data.category as ExpenseCategory,
//           date: data.date || new Date().toISOString(),
//           status: data.status || 'paid',
//           isRecurring: data.isRecurring || false,
//         });
//         setExpenses(prev => [newExpense, ...prev]);
//       }
//       setIsExpenseModalOpen(false);
//       setEditingExpense(undefined);
//     } catch (error) { alert("Operation failed."); }
//   };

//   const handleSaveBudget = async (data: { source: string; amount: number; date: string }) => {
//     try {
//         const newIncome = await incomeAPI.add(data);
//         setIncome(prev => [newIncome, ...prev]); 
//         setIsBudgetModalOpen(false);
//     } catch (error) { alert("Failed to add funds."); }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this record permanently?")) return;
//     try {
//       if (viewMode === 'expenses') {
//         await expensesAPI.delete(id);
//         setExpenses(prev => prev.filter(e => e.id !== id));
//       } else {
//         await incomeAPI.delete(id);
//         setIncome(prev => prev.filter(i => i.id !== id));
//       }
//     } catch (error) { alert("Failed to delete."); }
//   };

//   const openEditModal = (expense: Expense) => {
//     setEditingExpense(expense);
//     setIsExpenseModalOpen(true);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Overview</h1>
//           <p className="text-sm text-gray-500 mt-1">Track company spending, budget, and cash flow.</p>
//         </div>
        
//         <div className="flex gap-2">
//             <Button onClick={() => setIsBudgetModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
//                 <Wallet className="w-4 h-4 mr-2" /> Add Funds
//             </Button>
//             <Button onClick={() => { setEditingExpense(undefined); setIsExpenseModalOpen(true); }} className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
//                 <Plus className="w-4 h-4 mr-2" /> Record Expense
//             </Button>
//         </div>
//       </div>

//       {/* Stats Row */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard 
//             title="Available Balance" 
//             value={formatCurrency(summary.balance)} 
//             icon={Wallet} 
//             colorClass="bg-blue-50 text-blue-600"
//             trend={<span className={summary.balance >= 0 ? "text-emerald-600" : "text-red-600"}>{summary.balance >= 0 ? "Healthy" : "Deficit"}</span>} 
//         />
//         <StatCard 
//             title="Total Income" 
//             value={formatCurrency(summary.totalIncome)} 
//             icon={ArrowUpCircle} 
//             colorClass="bg-emerald-50 text-emerald-600" 
//         />
//         <StatCard 
//             title="Total Expenses" 
//             value={formatCurrency(summary.totalExpenses)} 
//             icon={ArrowDownCircle} 
//             colorClass="bg-rose-50 text-rose-600" 
//         />
//         <StatCard 
//             title="Pending Bills" 
//             value={formatCurrency(summary.pending)} 
//             icon={History} 
//             colorClass="bg-amber-50 text-amber-600" 
//         />
//       </div>

//       {/* Analytics & Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
//         {/* Chart */}
//         <Card className="lg:col-span-2 border-none shadow-sm flex flex-col h-full">
//             <CardHeader className="pb-2 border-b border-gray-100">
//                 <CardTitle className="text-base font-semibold flex items-center gap-2">
//                     <PieChart className="w-4 h-4 text-slate-500" /> Spending Analysis
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="p-4 flex-1 min-h-0">
//                 <ExpenseDistributionChart data={distribution} />
//             </CardContent>
//         </Card>

//         {/* Top Categories */}
//         <Card className="border-none shadow-sm flex flex-col h-full overflow-hidden">
//             <CardHeader className="pb-2 border-b border-gray-100 bg-white sticky top-0 z-10">
//                 <CardTitle className="text-base font-semibold">Top Categories</CardTitle>
//             </CardHeader>
//             <CardContent className="p-4 overflow-y-auto space-y-5 flex-1">
//                 {distribution.slice(0, 6).map((item, idx) => {
//                     const percent = (item.value / summary.totalExpenses) * 100;
//                     const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500', 'bg-slate-500'];
//                     return (
//                         <div key={item.name} className="space-y-1.5">
//                             <div className="flex justify-between text-xs font-medium">
//                                 <span className="text-slate-700">{item.name}</span>
//                                 <span className="text-slate-900">{formatCurrency(item.value)}</span>
//                             </div>
//                             <CustomProgressBar value={percent} colorClass={colors[idx % colors.length]} />
//                         </div>
//                     );
//                 })}
//                 {distribution.length === 0 && <p className="text-center text-gray-400 text-sm py-10">No expense data yet.</p>}
//             </CardContent>
//         </Card>
//       </div>

//       {/* Transactions Section */}
//       <Card className="border-gray-200 shadow-sm bg-white overflow-hidden rounded-xl">
         
//          {/* Tabs & Controls */}
//          <div className="px-4 py-3 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-white">
            
//             {/* View Switcher */}
//             <div className="flex bg-slate-100 p-1 rounded-lg">
//                 <button 
//                     onClick={() => setViewMode('expenses')}
//                     className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all", viewMode === 'expenses' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
//                 >
//                     Expenses
//                 </button>
//                 <button 
//                     onClick={() => setViewMode('income')}
//                     className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all", viewMode === 'income' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
//                 >
//                     Income Log
//                 </button>
//             </div>

//             {/* Filters */}
//             <div className="flex gap-2 w-full lg:w-auto">
//                <div className="relative flex-1 lg:w-[240px]">
//                   <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//                   <Input 
//                     placeholder="Search..." 
//                     value={searchQuery}
//                     onChange={e => setSearchQuery(e.target.value)}
//                     className="pl-8 h-9 text-xs bg-slate-50 border-slate-200"
//                   />
//                </div>
               
//                {viewMode === 'expenses' && (
//                    <>
//                        <Select value={filters.category} onValueChange={(v) => setFilters(f => ({...f, category: v}))}>
//                           <SelectTrigger className="w-[140px] h-9 text-xs bg-slate-50 border-slate-200"><SelectValue placeholder="Category" /></SelectTrigger>
//                           <SelectContent>
//                              <SelectItem value="all">All Categories</SelectItem>
//                              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
//                           </SelectContent>
//                        </Select>
//                        <Select value={filters.status} onValueChange={(v) => setFilters(f => ({...f, status: v}))}>
//                           <SelectTrigger className="w-[110px] h-9 text-xs bg-slate-50 border-slate-200"><SelectValue placeholder="Status" /></SelectTrigger>
//                           <SelectContent>
//                              <SelectItem value="all">All</SelectItem>
//                              <SelectItem value="paid">Paid</SelectItem>
//                              <SelectItem value="pending">Pending</SelectItem>
//                           </SelectContent>
//                        </Select>
//                    </>
//                )}
//             </div>
//          </div>

//          {/* Unified Data Table */}
//          <ExpenseTable 
//             data={filteredData} 
//             type={viewMode}
//             isLoading={isLoading} 
//             onEdit={openEditModal} 
//             onDelete={handleDelete} 
//          />
//       </Card>

//       {/* Modals */}
//       <ExpenseModal 
//         isOpen={isExpenseModalOpen} 
//         onClose={() => setIsExpenseModalOpen(false)} 
//         onSave={handleSaveExpense} 
//         categories={CATEGORIES}
//         initialData={editingExpense} 
//       />

//       <BudgetModal 
//         isOpen={isBudgetModalOpen}
//         onClose={() => setIsBudgetModalOpen(false)}
//         onSave={handleSaveBudget}
//       />
//     </div>
//   );
// };

// export default Expenses;











































/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Search, Plus, Wallet, ArrowUpCircle, ArrowDownCircle, 
  PieChart, Download, Calendar, Filter
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Custom Components
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { BudgetModal } from '@/components/expenses/BudgetModal';
import { ExpenseTable } from '@/components/expenses/ExpenseTable';
import { ExpenseDistributionChart } from '@/components/dashboard/Charts';

// Services & Utils
import { expensesAPI } from '@/services/expenseService';
import { incomeAPI } from '@/services/incomeService';
import { formatCurrency } from '@/utils/formatters';
import type { Expense, ExpenseCategory, Income } from '@/types';
import { cn } from '@/lib/utils';

// Constants
const CATEGORIES: ExpenseCategory[] = [
  'Rent', 'WiFi', 'Electricity', 'Food', 'Maintenance', 
  'Guest', 'Salaries', 'Tax', 'Equipment', 'Software', 'Other'
];

const ITEMS_PER_PAGE = 10;

// --- Helper: Stat Card ---
const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
  <Card className="border-none shadow-sm bg-white p-5 flex flex-col justify-between h-full relative overflow-hidden group">
    <div className="absolute right-0 top-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
        <Icon className={cn("w-16 h-16", colorClass.replace("bg-", "text-"))} />
    </div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={cn("p-2.5 rounded-xl bg-opacity-10", colorClass)}>
        <Icon className={cn("w-5 h-5", colorClass.replace("bg-", "text-"))} />
      </div>
    </div>
    {subtext && <div className="mt-3 text-xs font-medium text-gray-500">{subtext}</div>}
  </Card>
);

const Expenses: React.FC = () => {
  // Data State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  
  // Filter State
  const [viewMode, setViewMode] = useState<'expenses' | 'income'>('expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // --- DATE RANGE STATE ---
  // Default to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState({
    from: firstDay,
    to: lastDay
  });

  const [currentPage, setCurrentPage] = useState(1);

  // --- 1. Load Data ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [expenseData, incomeData] = await Promise.all([
          expensesAPI.getAll(),
          incomeAPI.getAll()
        ]);
        setExpenses(expenseData);
        setIncome(incomeData);
      } catch (error) { console.error(error); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  // --- 2. Advanced Filtering Engine ---
  const { 
    filteredData, 
    paginatedData, 
    totalPages, 
    periodStats, 
    chartData 
  } = useMemo(() => {
    
    // A. Filter by DATE RANGE first
    const fromDate = new Date(dateRange.from).setHours(0,0,0,0);
    const toDate = new Date(dateRange.to).setHours(23,59,59,999);

    const rangeExpenses = expenses.filter(e => {
      const d = new Date(e.date).getTime();
      return d >= fromDate && d <= toDate;
    });

    const rangeIncome = income.filter(i => {
      const d = new Date(i.date).getTime();
      return d >= fromDate && d <= toDate;
    });

    // B. Calculate Period Stats (Based on Range)
    const totalExp = rangeExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalInc = rangeIncome.reduce((sum, i) => sum + i.amount, 0);
    const balance = totalInc - totalExp;
    const pendingCount = rangeExpenses.filter(e => e.status === 'pending').length;

    // C. Prepare Chart Data (Category Distribution for range)
    const distMap: Record<string, number> = {};
    rangeExpenses.forEach(e => { distMap[e.category] = (distMap[e.category] || 0) + e.amount });
    const sortedDist = Object.entries(distMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // D. Filter Table Data based on ViewMode & Search
    const activeList: any[] = viewMode === 'expenses' ? rangeExpenses : rangeIncome;

    const refinedList = activeList.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      const textMatch = (item.description || item.source || '').toLowerCase().includes(searchLower) ||
                        (item.category || '').toLowerCase().includes(searchLower);
      
      const catMatch = viewMode === 'income' || categoryFilter === 'all' || item.category === categoryFilter;
      const statusMatch = viewMode === 'income' || statusFilter === 'all' || item.status === statusFilter;
      
      return textMatch && catMatch && statusMatch;
    });

    // E. Pagination
    const pages = Math.ceil(refinedList.length / ITEMS_PER_PAGE);
    const slicedData = refinedList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return { 
      filteredData: refinedList, 
      paginatedData: slicedData, 
      totalPages: pages,
      periodStats: { totalExp, totalInc, balance, pendingCount },
      chartData: sortedDist
    };
  }, [expenses, income, dateRange, viewMode, searchQuery, categoryFilter, statusFilter, currentPage]);

  // --- Handlers ---

  // Quick Date Helpers
  const setQuickDate = (type: 'this_month' | 'last_month' | 'this_year' | 'all') => {
    const now = new Date();
    let start = '';
    let end = '';

    if (type === 'this_month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    } else if (type === 'last_month') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    } else if (type === 'this_year') {
      start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      end = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
    } else {
      // All Time (Arbitrary old date to far future)
      start = '2020-01-01';
      end = '2030-12-31';
    }
    setDateRange({ from: start, to: end });
    setCurrentPage(1);
  };

  const handleSaveExpense = async (data: Partial<Expense>) => {
    try {
      if (editingExpense) {
        await expensesAPI.update(editingExpense.id, data);
        setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { ...e, ...data } as Expense : e));
      } else {
        const newExpense = await expensesAPI.add({
          description: data.description || 'Expense',
          amount: Number(data.amount),
          category: data.category as ExpenseCategory,
          date: data.date || new Date().toISOString(),
          status: data.status || 'paid',
          isRecurring: data.isRecurring || false,
        } as Expense);
        setExpenses(prev => [newExpense, ...prev]);
      }
      setIsExpenseModalOpen(false);
      setEditingExpense(undefined);
    } catch (error) { alert("Operation failed."); }
  };

  const handleSaveBudget = async (data: any) => {
    try {
        const newIncome = await incomeAPI.add(data);
        setIncome(prev => [newIncome, ...prev]); 
        setIsBudgetModalOpen(false);
    } catch (error) { alert("Failed to add funds."); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record permanently?")) return;
    try {
      if (viewMode === 'expenses') {
        await expensesAPI.delete(id);
        setExpenses(prev => prev.filter(e => e.id !== id));
      } else {
        await incomeAPI.delete(id);
        setIncome(prev => prev.filter(i => i.id !== id));
      }
    } catch (error) { alert("Failed to delete."); }
  };

  const handleExport = () => {
    const headers = viewMode === 'expenses' ? ['Date,Description,Category,Status,Amount'] : ['Date,Source,Amount'];
    const rows = filteredData.map((item: any) => 
      viewMode === 'expenses' 
      ? `${item.date},"${item.description}",${item.category},${item.status},${item.amount}`
      : `${item.date},"${item.source}",${item.amount}`
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_report_${dateRange.from}_to_${dateRange.to}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Financial Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track cash flow and manage budget.</p>
        </div>
        
        <div className="flex gap-2 items-center">
           <Button variant="outline" onClick={handleExport} className="h-9 text-xs bg-white shadow-sm">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export Report
           </Button>
           <Button onClick={() => setIsBudgetModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs shadow-sm">
              <Wallet className="w-3.5 h-3.5 mr-1.5" /> Add Income
           </Button>
           <Button onClick={() => { setEditingExpense(undefined); setIsExpenseModalOpen(true); }} className="bg-slate-900 text-white hover:bg-slate-800 h-9 text-xs shadow-sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Expense
           </Button>
        </div>
      </div>

      {/* 2. DATE FILTER BAR (Global) */}
      <Card className="p-1 border border-gray-200 shadow-sm bg-white rounded-xl">
         <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-2">
            
            {/* Range Pickers */}
            <div className="flex items-center gap-2 w-full md:w-auto">
               <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                     <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <Input 
                    type="date" 
                    value={dateRange.from}
                    onChange={(e) => setDateRange(p => ({...p, from: e.target.value}))}
                    className="pl-9 h-9 w-[160px] text-xs bg-gray-50 border-gray-200"
                  />
               </div>
               <span className="text-gray-400 text-xs font-medium">to</span>
               <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                     <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <Input 
                    type="date" 
                    value={dateRange.to}
                    onChange={(e) => setDateRange(p => ({...p, to: e.target.value}))}
                    className="pl-9 h-9 w-[160px] text-xs bg-gray-50 border-gray-200"
                  />
               </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
               <Button variant="ghost" size="sm" onClick={() => setQuickDate('this_month')} className="text-xs h-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900">This Month</Button>
               <Button variant="ghost" size="sm" onClick={() => setQuickDate('last_month')} className="text-xs h-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900">Last Month</Button>
               <Button variant="ghost" size="sm" onClick={() => setQuickDate('this_year')} className="text-xs h-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900">This Year</Button>
               <Button variant="ghost" size="sm" onClick={() => setQuickDate('all')} className="text-xs h-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900">All Time</Button>
            </div>
         </div>
      </Card>

      {/* 3. PERIOD STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            title="Net Balance" 
            value={formatCurrency(periodStats.balance)} 
            icon={Wallet} 
            colorClass={periodStats.balance >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}
            subtext="For selected period"
        />
        <StatCard 
            title="Total Income" 
            value={formatCurrency(periodStats.totalInc)} 
            icon={ArrowUpCircle} 
            colorClass="bg-blue-50 text-blue-600" 
            subtext="Cash In"
        />
        <StatCard 
            title="Total Expenses" 
            value={formatCurrency(periodStats.totalExp)} 
            icon={ArrowDownCircle} 
            colorClass="bg-rose-50 text-rose-600" 
            subtext="Cash Out"
        />
        <StatCard 
            title="Pending Bills" 
            value={periodStats.pendingCount} 
            icon={Filter} 
            colorClass="bg-amber-50 text-amber-600" 
            subtext="Unpaid Invoices"
        />
      </div>

      {/* 4. ANALYTICS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Distribution Chart */}
         <Card className="lg:col-span-2 border-none shadow-sm flex flex-col h-[380px]">
            <CardHeader className="pb-2 border-b border-gray-100">
               <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-slate-500" /> Spending Distribution
               </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
               {chartData.length > 0 ? (
                  <ExpenseDistributionChart data={chartData} />
               ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">No expenses for this period.</div>
               )}
            </CardContent>
         </Card>

         {/* Top Categories List */}
         <Card className="border-none shadow-sm flex flex-col h-[380px] overflow-hidden">
            <CardHeader className="pb-2 border-b border-gray-100 bg-white">
                <CardTitle className="text-sm font-semibold">Top Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto flex-1 space-y-4">
               {chartData.map((item, idx) => {
                  const percent = (item.value / periodStats.totalExp) * 100;
                  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'];
                  return (
                     <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                           <span className="text-slate-700">{item.name}</span>
                           <span className="text-slate-900">{formatCurrency(item.value)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={cn("h-full rounded-full", colors[idx % colors.length] || 'bg-slate-500')} style={{ width: `${percent}%` }} />
                        </div>
                     </div>
                  );
               })}
               {chartData.length === 0 && <p className="text-center text-gray-400 text-xs py-10">No data available for this range.</p>}
            </CardContent>
         </Card>
      </div>

      {/* 5. MAIN LEDGER (Paginated Table) */}
      <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden rounded-xl">
         
         {/* Controls */}
         <div className="px-4 py-3 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
            <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
                <button onClick={() => { setViewMode('expenses'); setCurrentPage(1); }} className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all", viewMode === 'expenses' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Expenses</button>
                <button onClick={() => { setViewMode('income'); setCurrentPage(1); }} className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all", viewMode === 'income' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Income Log</button>
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
               <div className="relative flex-1 min-w-[140px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input placeholder="Search records..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 text-xs bg-slate-50 border-slate-200" />
               </div>
               {viewMode === 'expenses' && (
                   <>
                       <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="w-[130px] h-8 text-xs bg-slate-50 border-slate-200"><SelectValue placeholder="Category" /></SelectTrigger>
                          <SelectContent>
                             <SelectItem value="all">All Categories</SelectItem>
                             {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                       </Select>
                       <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-50 border-slate-200"><SelectValue placeholder="Status" /></SelectTrigger>
                          <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent>
                       </Select>
                   </>
               )}
            </div>
         </div>

         {/* Table Component */}
         <ExpenseTable 
            data={paginatedData} 
            type={viewMode}
            isLoading={isLoading} 
            onEdit={openEditModal} 
            onDelete={handleDelete} 
         />

         {/* Pagination Footer */}
         {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
               <span className="text-[10px] text-gray-500 font-medium">Page {currentPage} of {totalPages}</span>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-7 text-xs bg-white">Previous</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-7 text-xs bg-white">Next</Button>
               </div>
            </div>
         )}
      </Card>

      <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} onSave={handleSaveExpense} categories={CATEGORIES} initialData={editingExpense} />
      <BudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} onSave={handleSaveBudget} />
    </div>
  );
};

export default Expenses;