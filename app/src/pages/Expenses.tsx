
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useState, useMemo } from 'react';
// import { 
//   Search, Plus, Wallet, ArrowUpCircle, ArrowDownCircle, 
//   PieChart, Download, Calendar, Filter
// } from 'lucide-react';

// // UI Components
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// // Custom Components
// import { ExpenseModal } from '@/components/expenses/ExpenseModal';
// import { BudgetModal } from '@/components/expenses/BudgetModal';
// import { ExpenseTable } from '@/components/expenses/ExpenseTable';
// import { ExpenseDistributionChart } from '@/components/dashboard/Charts';

// // Services & Utils
// import { expensesAPI } from '@/services/expenseService';
// import { incomeAPI } from '@/services/incomeService';
// import { formatCurrency } from '@/utils/formatters';
// import type { Expense, ExpenseCategory, Income } from '@/types';
// import { cn } from '@/lib/utils';

// // Constants
// const CATEGORIES: ExpenseCategory[] = [
//   'Rent', 'WiFi', 'Electricity', 'Food', 'Maintenance', 
//   'Guest', 'Salaries', 'Tax', 'Equipment', 'Software', 'Other'
// ];

// const ITEMS_PER_PAGE = 10;

// // --- Helper: Stat Card ---
// const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
//   <Card className="border-none shadow-sm bg-white p-5 flex flex-col justify-between h-full relative overflow-hidden group">
//     <div className="absolute right-0 top-0 p-4 opacity-0 transition-opacity">
//         <Icon className={cn("w-16 h-16", colorClass.replace("bg-", "text-"))} />
//     </div>
//     <div className="flex justify-between items-start relative z-10">
//       <div>
//         <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
//         <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
//       </div>
//       <div className={cn("p-2.5 rounded-xl bg-opacity-10", colorClass)}>
//         <Icon className={cn("w-5 h-5", colorClass.replace("bg-", "text-"))} />
//       </div>
//     </div>
//     {subtext && <div className="mt-3 text-xs font-medium text-gray-500">{subtext}</div>}
//   </Card>
// );

// const Expenses: React.FC = () => {
//   // Data State
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [income, setIncome] = useState<Income[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // UI State
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
//   const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  
//   // Filter State
//   const [viewMode, setViewMode] = useState<'expenses' | 'income'>('expenses');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
  
//   // --- DATE RANGE STATE ---
//   // Default to current month
//   const today = new Date();
//   const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
//   const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

//   const [dateRange, setDateRange] = useState({
//     from: firstDay,
//     to: lastDay
//   });

//   const [currentPage, setCurrentPage] = useState(1);

//   // --- 1. Load Data ---
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const [expenseData, incomeData] = await Promise.all([
//           expensesAPI.getAll(),
//           incomeAPI.getAll()
//         ]);
//         setExpenses(expenseData);
//         setIncome(incomeData);
//       } catch (error) { console.error(error); } 
//       finally { setIsLoading(false); }
//     };
//     fetchData();
//   }, []);

//   // --- 2. Advanced Filtering Engine ---
//   const { 
//     filteredData, 
//     paginatedData, 
//     totalPages, 
//     periodStats, 
//     chartData 
//   } = useMemo(() => {
    
//     // A. Filter by DATE RANGE first
//     const fromDate = new Date(dateRange.from).setHours(0,0,0,0);
//     const toDate = new Date(dateRange.to).setHours(23,59,59,999);

//     const rangeExpenses = expenses.filter(e => {
//       const d = new Date(e.date).getTime();
//       return d >= fromDate && d <= toDate;
//     });

//     const rangeIncome = income.filter(i => {
//       const d = new Date(i.date).getTime();
//       return d >= fromDate && d <= toDate;
//     });

//     // B. Calculate Period Stats (Based on Range)
//     const totalExp = rangeExpenses.reduce((sum, e) => sum + e.amount, 0);
//     const totalInc = rangeIncome.reduce((sum, i) => sum + i.amount, 0);
//     const balance = totalInc - totalExp;
//     const pendingCount = rangeExpenses.filter(e => e.status === 'pending').length;

//     // C. Prepare Chart Data (Category Distribution for range)
//     const distMap: Record<string, number> = {};
//     rangeExpenses.forEach(e => { distMap[e.category] = (distMap[e.category] || 0) + e.amount });
//     const sortedDist = Object.entries(distMap)
//         .map(([name, value]) => ({ name, value }))
//         .sort((a, b) => b.value - a.value);

//     // D. Filter Table Data based on ViewMode & Search
//     const activeList: any[] = viewMode === 'expenses' ? rangeExpenses : rangeIncome;

//     const refinedList = activeList.filter(item => {
//       const searchLower = searchQuery.toLowerCase();
//       const textMatch = (item.description || item.source || '').toLowerCase().includes(searchLower) ||
//                         (item.category || '').toLowerCase().includes(searchLower);
      
//       const catMatch = viewMode === 'income' || categoryFilter === 'all' || item.category === categoryFilter;
//       const statusMatch = viewMode === 'income' || statusFilter === 'all' || item.status === statusFilter;
      
//       return textMatch && catMatch && statusMatch;
//     });

//     // E. Pagination
//     const pages = Math.ceil(refinedList.length / ITEMS_PER_PAGE);
//     const slicedData = refinedList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//     return { 
//       filteredData: refinedList, 
//       paginatedData: slicedData, 
//       totalPages: pages,
//       periodStats: { totalExp, totalInc, balance, pendingCount },
//       chartData: sortedDist
//     };
//   }, [expenses, income, dateRange, viewMode, searchQuery, categoryFilter, statusFilter, currentPage]);

//   // --- Handlers ---

//   // Quick Date Helpers
//   const setQuickDate = (type: 'this_month' | 'last_month' | 'this_year' | 'all') => {
//     const now = new Date();
//     let start = '';
//     let end = '';

//     if (type === 'this_month') {
//       start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
//       end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
//     } else if (type === 'last_month') {
//       start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
//       end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
//     } else if (type === 'this_year') {
//       start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
//       end = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
//     } else {
//       // All Time (Arbitrary old date to far future)
//       start = '2020-01-01';
//       end = '2030-12-31';
//     }
//     setDateRange({ from: start, to: end });
//     setCurrentPage(1);
//   };

//   const handleSaveExpense = async (data: Partial<Expense>) => {
//     try {
//       if (editingExpense) {
//         await expensesAPI.update(editingExpense.id, data);
//         setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { ...e, ...data } as Expense : e));
//       } else {
//         const newExpense = await expensesAPI.add({
//           description: data.description || 'Expense',
//           amount: Number(data.amount),
//           category: data.category as ExpenseCategory,
//           date: data.date || new Date().toISOString(),
//           status: data.status || 'paid',
//           isRecurring: data.isRecurring || false,
//         } as Expense);
//         setExpenses(prev => [newExpense, ...prev]);
//       }
//       setIsExpenseModalOpen(false);
//       setEditingExpense(undefined);
//     } catch (error) { alert("Operation failed."); }
//   };

//   const handleSaveBudget = async (data: any) => {
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

//   const handleExport = () => {
//     const headers = viewMode === 'expenses' ? ['Date,Description,Category,Status,Amount'] : ['Date,Source,Amount'];
//     const rows = filteredData.map((item: any) => 
//       viewMode === 'expenses' 
//       ? `${item.date},"${item.description}",${item.category},${item.status},${item.amount}`
//       : `${item.date},"${item.source}",${item.amount}`
//     );
    
//     const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `financial_report_${dateRange.from}_to_${dateRange.to}.csv`);
//     document.body.appendChild(link);
//     link.click();
//   };

//   const openEditModal = (expense: Expense) => {
//     setEditingExpense(expense);
//     setIsExpenseModalOpen(true);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
//       {/* 1. HEADER */}
//       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">Financial Overview</h1>
//           <p className="text-xs text-gray-500 mt-0.5">Track cash flow and manage budget.</p>
//         </div>
        
//         <div className="flex gap-2 items-center">
//            <Button variant="outline" onClick={handleExport} className="h-9 text-xs bg-white shadow-sm">
//               <Download className="w-3.5 h-3.5 mr-1.5" /> Export Report
//            </Button>
//            <Button onClick={() => setIsBudgetModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs shadow-sm">
//               <Wallet className="w-3.5 h-3.5 mr-1.5" /> Add Income
//            </Button>
//            <Button onClick={() => { setEditingExpense(undefined); setIsExpenseModalOpen(true); }} className="bg-slate-900 text-white hover:bg-slate-800 h-9 text-xs shadow-sm">
//               <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Expense
//            </Button>
//         </div>
//       </div>

//       {/* 2. DATE FILTER BAR (Global) */}
//       <Card className="p-1 border border-gray-200 shadow-sm bg-white rounded-xl">
//          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-2">
            
//             {/* Range Pickers */}
//             <div className="flex items-center gap-2 w-full md:w-auto">
//                <div className="relative">
//                   <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
//                   </div>
//                   <Input 
//                     type="date" 
//                     value={dateRange.from}
//                     onChange={(e) => setDateRange(p => ({...p, from: e.target.value}))}
//                     className="pl-9 h-9 w-[160px] text-xs bg-gray-50 border-gray-200"
//                   />
//                </div>
//                <span className="text-gray-400 text-xs font-medium">to</span>
//                <div className="relative">
//                   <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
//                   </div>
//                   <Input 
//                     type="date" 
//                     value={dateRange.to}
//                     onChange={(e) => setDateRange(p => ({...p, to: e.target.value}))}
//                     className="pl-9 h-9 w-[160px] text-xs bg-gray-50 border-gray-200"
//                   />
//                </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
//                <Button variant="ghost" size="sm" onClick={() => setQuickDate('this_month')} className="text-xs h-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900">This Month</Button>
//                <Button variant="ghost" size="sm" onClick={() => setQuickDate('last_month')} className="text-xs h-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900">Last Month</Button>
//                <Button variant="ghost" size="sm" onClick={() => setQuickDate('this_year')} className="text-xs h-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900">This Year</Button>
//                <Button variant="ghost" size="sm" onClick={() => setQuickDate('all')} className="text-xs h-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900">All Time</Button>
//             </div>
//          </div>
//       </Card>

//       {/* 3. PERIOD STATS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard 
//             title="Net Balance" 
//             value={formatCurrency(periodStats.balance)} 
//             icon={Wallet} 
//             colorClass={periodStats.balance >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}
//             subtext="For selected period"
//         />
//         <StatCard 
//             title="Total Income" 
//             value={formatCurrency(periodStats.totalInc)} 
//             icon={ArrowUpCircle} 
//             colorClass="bg-blue-50 text-blue-600" 
//             subtext="Cash In"
//         />
//         <StatCard 
//             title="Total Expenses" 
//             value={formatCurrency(periodStats.totalExp)} 
//             icon={ArrowDownCircle} 
//             colorClass="bg-rose-50 text-rose-600" 
//             subtext="Cash Out"
//         />
//         <StatCard 
//             title="Pending Bills" 
//             value={periodStats.pendingCount} 
//             icon={Filter} 
//             colorClass="bg-amber-50 text-amber-600" 
//             subtext="Unpaid Invoices"
//         />
//       </div>

//     {/* 4. ANALYTICS AREA */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 p-0 gap-6">
//          {/* Distribution Chart */}
//          <Card className="lg:col-span-2 flex flex-col min-h-[400px] p-0">
//             <CardHeader className="p-5 pb-0 border-b border-slate-100 bg-white">
//                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
//                   <PieChart className="w-4 h-4 text-slate-500" /> Spending Distribution
//                </CardTitle>
//             </CardHeader>
            
            
//             <CardContent className="w-full flex-1 relative min-h-[350px] p-0">
              
//                {chartData.length > 0 ? (
//                   <div className="absolute inset-0 ">
//                      <ExpenseDistributionChart data={chartData} />
//                   </div>
//                ) : (
//                   <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">No expenses for this period.</div>
//                )}
//             </CardContent>
//          </Card>

//          {/* Top Categories List */}
//          <Card className="border-slate-200/60 shadow-sm flex flex-col h-[400px] overflow-hidden">
//             <CardHeader className="pb-2 border-b border-slate-100 bg-white">
//                 <CardTitle className="text-sm font-semibold text-slate-800">Top Categories</CardTitle>
//             </CardHeader>
//             <CardContent className="p-5 overflow-y-auto flex-1 space-y-5 no-scrollbar">
//                {chartData.map((item, idx) => {
//                   const percent = (item.value / periodStats.totalExp) * 100;
//                   const colors = ['bg-[#5d88c6]', 'bg-[#10b981]', 'bg-[#f59e0b]', 'bg-[#ef4444]', 'bg-[#8b5cf6]'];
//                   return (
//                      <div key={item.name} className="space-y-1.5">
//                         <div className="flex justify-between text-xs font-bold">
//                            <span className="text-slate-600">{item.name}</span>
//                            <span className="text-slate-900">{formatCurrency(item.value)}</span>
//                         </div>
//                         <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
//                            <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", colors[idx % colors.length] || 'bg-slate-400')} style={{ width: `${percent}%` }} />
//                         </div>
//                      </div>
//                   );
//                })}
//                {chartData.length === 0 && <p className="text-center text-slate-400 text-sm py-12 font-medium">No data available.</p>}
//             </CardContent>
//          </Card>
//       </div>

//       {/* 5. MAIN LEDGER (Paginated Table) */}
//       <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden rounded-xl">
         
//          {/* Controls */}
//          <div className="px-4 py-3 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
//             <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
//                 <button onClick={() => { setViewMode('expenses'); setCurrentPage(1); }} className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all", viewMode === 'expenses' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Expenses</button>
//                 <button onClick={() => { setViewMode('income'); setCurrentPage(1); }} className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all", viewMode === 'income' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Income Log</button>
//             </div>

//             <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
//                <div className="relative flex-1 min-w-[140px]">
//                   <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//                   <Input placeholder="Search records..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 text-xs bg-slate-50 border-slate-200" />
//                </div>
//                {viewMode === 'expenses' && (
//                    <>
//                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//                           <SelectTrigger className="w-[130px] h-8 text-xs bg-slate-50 border-slate-200"><SelectValue placeholder="Category" /></SelectTrigger>
//                           <SelectContent>
//                              <SelectItem value="all">All Categories</SelectItem>
//                              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
//                           </SelectContent>
//                        </Select>
//                        <Select value={statusFilter} onValueChange={setStatusFilter}>
//                           <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-50 border-slate-200"><SelectValue placeholder="Status" /></SelectTrigger>
//                           <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent>
//                        </Select>
//                    </>
//                )}
//             </div>
//          </div>

//          {/* Table Component */}
//          <ExpenseTable 
//             data={paginatedData} 
//             type={viewMode}
//             isLoading={isLoading} 
//             onEdit={openEditModal} 
//             onDelete={handleDelete} 
//          />

//          {/* Pagination Footer */}
//          {totalPages > 1 && (
//             <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
//                <span className="text-[10px] text-gray-500 font-medium">Page {currentPage} of {totalPages}</span>
//                <div className="flex gap-2">
//                   <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-7 text-xs bg-white">Previous</Button>
//                   <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-7 text-xs bg-white">Next</Button>
//                </div>
//             </div>
//          )}
//       </Card>

//       <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} onSave={handleSaveExpense} categories={CATEGORIES} initialData={editingExpense} />
//       <BudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} onSave={handleSaveBudget} />
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
  <Card className="border-slate-200/60 shadow-sm bg-white p-5 flex flex-col justify-between h-full relative overflow-hidden group rounded-2xl transition-all hover:shadow-md">
    <div className="absolute right-0 top-0 p-4 opacity-0 transition-opacity">
        <Icon className={cn("w-16 h-16", colorClass.replace("bg-", "text-"))} />
    </div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-xl bg-opacity-10", colorClass)}>
        <Icon className={cn("w-5 h-5", colorClass.replace("bg-", "text-"))} />
      </div>
    </div>
    {subtext && <div className="mt-3 text-xs font-medium text-slate-500">{subtext}</div>}
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
  
  // Default to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState({ from: firstDay, to: lastDay });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [expenseData, incomeData] = await Promise.all([expensesAPI.getAll(), incomeAPI.getAll()]);
        setExpenses(expenseData);
        setIncome(incomeData);
      } catch (error) { console.error(error); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const { filteredData, paginatedData, totalPages, periodStats, chartData } = useMemo(() => {
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

    const totalExp = rangeExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalInc = rangeIncome.reduce((sum, i) => sum + i.amount, 0);
    const balance = totalInc - totalExp;
    const pendingCount = rangeExpenses.filter(e => e.status === 'pending').length;

    const distMap: Record<string, number> = {};
    rangeExpenses.forEach(e => { distMap[e.category] = (distMap[e.category] || 0) + e.amount });
    const sortedDist = Object.entries(distMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    const activeList: any[] = viewMode === 'expenses' ? rangeExpenses : rangeIncome;

    const refinedList = activeList.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      const textMatch = (item.description || item.source || '').toLowerCase().includes(searchLower) || (item.category || '').toLowerCase().includes(searchLower);
      const catMatch = viewMode === 'income' || categoryFilter === 'all' || item.category === categoryFilter;
      const statusMatch = viewMode === 'income' || statusFilter === 'all' || item.status === statusFilter;
      return textMatch && catMatch && statusMatch;
    });

    const pages = Math.ceil(refinedList.length / ITEMS_PER_PAGE);
    const slicedData = refinedList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return { filteredData: refinedList, paginatedData: slicedData, totalPages: pages, periodStats: { totalExp, totalInc, balance, pendingCount }, chartData: sortedDist };
  }, [expenses, income, dateRange, viewMode, searchQuery, categoryFilter, statusFilter, currentPage]);

  const setQuickDate = (type: 'this_month' | 'last_month' | 'this_year' | 'all') => {
    const now = new Date();
    let start = '', end = '';
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
      start = '2020-01-01'; end = '2030-12-31';
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
        const newExpense = await expensesAPI.add({ ...data, date: data.date || new Date().toISOString() } as Expense);
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
    const headers = viewMode === 'expenses' ? ['Date,Description,Category,Status,Amount'] : ['Date,Source,Notes,Amount'];
    const rows = filteredData.map((item: any) => 
      viewMode === 'expenses' 
      ? `${item.date},"${item.description}",${item.category},${item.status},${item.amount}`
      : `${item.date},"${item.source}","${item.notes || ''}",${item.amount}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `financial_report_${dateRange.from}_to_${dateRange.to}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  function openEditModal(_item: any): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 pt-2 w-full">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Financial Ledger</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Track cash flow, budgets, and expenses.</p>
        </div>
        
        <div className="flex gap-2 items-center">
           <Button variant="outline" onClick={handleExport} className="h-9 text-xs bg-white shadow-sm font-bold rounded-full px-4">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export
           </Button>
           <Button onClick={() => setIsBudgetModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs shadow-md font-bold rounded-full px-4">
              <Wallet className="w-3.5 h-3.5 mr-1.5" /> Log Income
           </Button>
           <Button onClick={() => { setEditingExpense(undefined); setIsExpenseModalOpen(true); }} className="bg-slate-900 text-white hover:bg-slate-800 h-9 text-xs shadow-md font-bold rounded-full px-4">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Expense
           </Button>
        </div>
      </div>

      {/* 2. DATE FILTER BAR (Global) */}
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto no-scrollbar">
           <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200 shrink-0">
             <Calendar className="w-4 h-4 text-slate-400 ml-2" />
             <Input type="date" value={dateRange.from} onChange={(e) => setDateRange(p => ({...p, from: e.target.value}))} className="h-8 w-[125px] text-xs bg-transparent border-0 focus-visible:ring-0 shadow-none font-medium text-slate-700" />
             <span className="text-slate-300 text-[10px] font-bold px-1 uppercase">to</span>
             <Input type="date" value={dateRange.to} onChange={(e) => setDateRange(p => ({...p, to: e.target.value}))} className="h-8 w-[125px] text-xs bg-transparent border-0 focus-visible:ring-0 shadow-none font-medium text-slate-700" />
           </div>
        </div>
        <div className="flex gap-1 overflow-x-auto w-full xl:w-auto pb-1 xl:pb-0 no-scrollbar">
           <Button variant="ghost" size="sm" onClick={() => setQuickDate('this_month')} className="text-xs h-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full font-semibold">This Month</Button>
           <Button variant="ghost" size="sm" onClick={() => setQuickDate('last_month')} className="text-xs h-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full font-semibold">Last Month</Button>
           <Button variant="ghost" size="sm" onClick={() => setQuickDate('this_year')} className="text-xs h-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full font-semibold">This Year</Button>
           <Button variant="ghost" size="sm" onClick={() => setQuickDate('all')} className="text-xs h-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full font-semibold">All Time</Button>
        </div>
      </div>

      {/* 3. PERIOD STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 w-full">
        <StatCard title="Net Balance" value={formatCurrency(periodStats.balance)} icon={Wallet} colorClass={periodStats.balance >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"} subtext="For selected period" />
        <StatCard title="Total Income" value={formatCurrency(periodStats.totalInc)} icon={ArrowUpCircle} colorClass="bg-blue-50 text-blue-600" subtext="Cash In" />
        <StatCard title="Total Expenses" value={formatCurrency(periodStats.totalExp)} icon={ArrowDownCircle} colorClass="bg-rose-50 text-rose-600" subtext="Cash Out" />
        <StatCard title="Pending Bills" value={periodStats.pendingCount} icon={Filter} colorClass="bg-amber-50 text-amber-600" subtext="Unpaid Invoices" />
      </div>

      {/* 4. ANALYTICS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-5 w-full">
         
         {/* Distribution Chart */}
         <Card className="lg:col-span-2 border-slate-200/60 shadow-sm flex flex-col min-h-[400px] w-full rounded-2xl">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 bg-white rounded-t-2xl shrink-0">
               <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                  <PieChart className="w-4 h-4 text-slate-500" /> Spending Distribution
               </CardTitle>
            </CardHeader>
            {/* Height fix applied here: flex-1 relative min-h-[350px] forces Recharts to grow correctly */}
            <CardContent className="w-full flex-1 relative min-h-[350px] p-0 overflow-hidden">
               {chartData.length > 0 ? (
                  <div className="absolute inset-0">
                     <ExpenseDistributionChart data={chartData} />
                  </div>
               ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">No expenses for this period.</div>
               )}
            </CardContent>
         </Card>

         {/* Top Categories List */}
         <Card className="border-slate-200/60 shadow-sm flex flex-col h-[400px] w-full rounded-2xl overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 bg-white shrink-0">
                <CardTitle className="text-base font-bold text-slate-800">Top Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-5 overflow-y-auto flex-1 space-y-5 no-scrollbar">
               {chartData.map((item, idx) => {
                  const percent = (item.value / periodStats.totalExp) * 100;
                  const colors = ['bg-[#5d88c6]', 'bg-[#10b981]', 'bg-[#f59e0b]', 'bg-[#ef4444]', 'bg-[#8b5cf6]'];
                  return (
                     <div key={item.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                           <span className="text-slate-600">{item.name}</span>
                           <span className="text-slate-900">{formatCurrency(item.value)}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                           <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", colors[idx % colors.length] || 'bg-slate-400')} style={{ width: `${percent}%` }} />
                        </div>
                     </div>
                  );
               })}
               {chartData.length === 0 && <p className="text-center text-slate-400 text-sm py-12 font-medium">No data available.</p>}
            </CardContent>
         </Card>
      </div>

      {/* 5. MAIN LEDGER (Paginated Table) */}
      <Card className="border border-slate-200/60 shadow-sm bg-white overflow-hidden rounded-2xl">
         
         <div className="px-5 py-4 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between items-center bg-white">
            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 w-full xl:w-auto">
                <button onClick={() => { setViewMode('expenses'); setCurrentPage(1); }} className={cn("flex-1 xl:flex-none px-6 py-2 text-xs font-bold rounded-lg transition-all", viewMode === 'expenses' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Expenses</button>
                <button onClick={() => { setViewMode('income'); setCurrentPage(1); }} className={cn("flex-1 xl:flex-none px-6 py-2 text-xs font-bold rounded-lg transition-all", viewMode === 'income' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Income Log</button>
            </div>

            <div className="flex gap-2 w-full xl:w-auto overflow-x-auto no-scrollbar">
               <div className="relative flex-1 min-w-[150px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search records..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-full focus-visible:ring-[#5d88c6]" />
               </div>
               {viewMode === 'expenses' && (
                   <>
                       <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="w-[140px] h-9 text-xs bg-white border-slate-200 rounded-full font-medium shadow-none"><SelectValue placeholder="Category" /></SelectTrigger>
                          <SelectContent>
                             <SelectItem value="all">All Categories</SelectItem>
                             {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                       </Select>
                       <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[120px] h-9 text-xs bg-white border-slate-200 rounded-full font-medium shadow-none"><SelectValue placeholder="Status" /></SelectTrigger>
                          <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent>
                       </Select>
                   </>
               )}
            </div>
         </div>

         <ExpenseTable data={paginatedData} type={viewMode} isLoading={isLoading} onEdit={openEditModal} onDelete={handleDelete} />

         {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
               <span className="text-xs text-slate-500 font-semibold">Page {currentPage} of {totalPages}</span>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 text-xs bg-white rounded-full px-4 font-bold">Previous</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 text-xs bg-white rounded-full px-4 font-bold">Next</Button>
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