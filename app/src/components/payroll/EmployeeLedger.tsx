/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Search, Filter, Printer,
//   ArrowUpCircle, ExternalLink, Calculator, Calendar,
//   Trash2
// } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';

// import { formatCurrency } from '@/utils/formatters';
// import type { PayrollRecord, Employee } from '@/types';
// import { cn } from '@/lib/utils';

// interface EmployeeLedgerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   employee: Employee | null;
//   records: PayrollRecord[];
//   onDelete: (id: string) => void;
// }

// export const EmployeeLedger = ({ isOpen, onClose, employee, records, onDelete }: EmployeeLedgerProps) => {
//   const navigate = useNavigate();
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [typeFilter, setTypeFilter] = useState('all');
  
//   // UX Improvement: Single Calendar Filter
//   // Default to empty (All Time) or set a default like new Date().toISOString().slice(0, 7)
//   const [monthFilter, setMonthFilter] = useState(''); 
  
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   // --- 1. Filter Logic ---
//   const filteredRecords = useMemo(() => {
//     if (!employee) return [];

//     return records.filter(r => {
//       // 1. Calendar Filter (Month/Year)
//       // Checks if the record's "month" (YYYY-MM) matches the filter
//       // OR if the paidDate starts with the filter (handles exact dates if needed)
//       if (monthFilter && r.month !== monthFilter && !r.paidDate.startsWith(monthFilter)) {
//          return false;
//       }

//       // 2. Type Filter
//       if (typeFilter === 'salary' && r.method === 'reimbursement') return false;
//       if (typeFilter === 'reimbursement' && r.method !== 'reimbursement') return false;

//       // 3. Search Filter
//       const searchLower = searchTerm.toLowerCase();
//       return (r.notes?.toLowerCase() || '').includes(searchLower) || 
//              r.month.toLowerCase().includes(searchLower);
//     });
//   }, [records, searchTerm, typeFilter, monthFilter, employee]);

//   // --- 2. Stats (Dynamic based on Filter) ---
//   const stats = useMemo(() => {
//     const totalGiven = filteredRecords
//       .filter(r => r.method !== 'reimbursement')
//       .reduce((sum, r) => sum + r.netSalary, 0);
    
//     const totalAdded = filteredRecords
//       .filter(r => r.method === 'reimbursement')
//       .reduce((sum, r) => sum + r.netSalary, 0);

//     return { totalGiven, totalAdded, count: filteredRecords.length };
//   }, [filteredRecords]);

//   // --- 3. Pagination ---
//   const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
//   const paginatedRecords = filteredRecords.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   if (!employee) return null;

//   const handleProfileClick = () => {
//     onClose();
//     navigate(`/team/profile/${employee.id}`);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-50 border-0 shadow-2xl">
        
//         {/* --- HEADER --- */}
//         <DialogHeader className="px-5 py-4 bg-white border-b shrink-0 flex flex-row items-center justify-between">
//           <div className="flex items-center gap-3 overflow-hidden">
//              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200 shrink-0">
//                 {employee.name.charAt(0)}
//              </div>
//              <div className="min-w-0">
//                 <div 
//                   className="flex items-center gap-2 cursor-pointer group" 
//                   onClick={handleProfileClick}
//                   title="View Profile"
//                 >
//                    <DialogTitle className="text-lg font-bold text-slate-900 leading-none truncate group-hover:text-blue-600 transition-colors">
//                       {employee.name}
//                    </DialogTitle>
//                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
//                 </div>
//                 <p className="text-xs text-slate-500 mt-1 font-medium truncate">{employee.designation}</p>
//              </div>
//           </div>
          
//           <div className="flex gap-2 print:hidden">
//             <Button variant="outline" size="sm" onClick={() => window.print()} className="h-9 text-xs gap-2 bg-white">
//                <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print Statement</span>
//             </Button>
//             {/* Duplicate 'X' removed. DialogContent provides the default close button. */}
//           </div>
//         </DialogHeader>

//         {/* --- STATS & FILTERS RIBBON --- */}
//         <div className="px-5 py-4 bg-white border-b flex flex-wrap gap-4 items-center justify-between shrink-0 print:hidden">
           
//            {/* Stats Container - Responsive Grid */}
//            <div className="grid grid-cols-2 md:flex md:items-center gap-2 md:gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 w-full md:w-auto">
              
//               {/* Total Given */}
//               <div className="flex items-center gap-3 md:pr-6 md:border-r border-slate-200">
//                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full"><ArrowUpCircle className="w-4 h-4" /></div>
//                  <div>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Given</p>
//                     <p className="text-sm md:text-base font-bold text-slate-900 leading-none">{formatCurrency(stats.totalGiven)}</p>
//                  </div>
//               </div>

//               {/* Added / Future */}
//               <div className="flex items-center gap-3 md:pr-6 md:border-r border-slate-200">
//                  <div className="p-2 bg-blue-100 text-blue-700 rounded-full"><Calculator className="w-4 h-4" /></div>
//                  <div>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Added / Future</p>
//                     <p className="text-sm md:text-base font-bold text-slate-900 leading-none">{formatCurrency(stats.totalAdded)}</p>
//                  </div>
//               </div>

//               {/* Records Count */}
//               <div className="hidden md:block">
//                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Records</p>
//                  <p className="text-sm md:text-base font-bold text-slate-900 leading-none">{stats.count}</p>
//               </div>
//            </div>

//            {/* --- FILTERS --- */}
//            <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
              
//               {/* Calendar Filter (Month Picker) */}
//               <div className="relative">
//                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
//                  <Input 
//                     type="month" 
//                     value={monthFilter}
//                     onChange={(e) => setMonthFilter(e.target.value)}
//                     className="pl-8 h-9 w-[140px] text-xs bg-white border-slate-200 shadow-sm"
//                     placeholder="Select Month"
//                  />
//                  {monthFilter && (
//                     <button 
//                        onClick={() => setMonthFilter('')}
//                        className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] text-blue-600 hover:underline font-medium"
//                     >
//                        Clear
//                     </button>
//                  )}
//               </div>

//               {/* Type Filter */}
//               <Select value={typeFilter} onValueChange={setTypeFilter}>
//                  <SelectTrigger className="h-9 w-[130px] text-xs bg-white border-slate-200 shadow-sm">
//                     <Filter className="w-3.5 h-3.5 mr-2 text-slate-400"/> <SelectValue />
//                  </SelectTrigger>
//                  <SelectContent>
//                     <SelectItem value="all">All Types</SelectItem>
//                     <SelectItem value="salary">Payments</SelectItem>
//                     <SelectItem value="reimbursement">Reimbursements</SelectItem>
//                  </SelectContent>
//               </Select>

//               {/* Search */}
//               <div className="relative flex-1 min-w-[140px]">
//                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//                  <Input 
//                    placeholder="Search notes..." 
//                    value={searchTerm}
//                    onChange={e => setSearchTerm(e.target.value)}
//                    className="pl-8 h-9 text-xs bg-white border-slate-200 shadow-sm"
//                  />
//               </div>
//            </div>
//         </div>

//         {/* --- TABLE CONTENT --- */}
//         <div className="flex-1 overflow-auto bg-white p-0 relative">
//            <table className="w-full text-sm text-left border-collapse">
//               <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-semibold border-b sticky top-0 z-10 shadow-sm">
//                  <tr>
//                     <th className="px-6 py-3">Date</th>
//                     <th className="px-6 py-3">Type</th>
//                     <th className="px-6 py-3">Description / Cycle</th>
//                     <th className="px-6 py-3 text-right">Amount</th>
//                     <th className="px-6 py-3 text-center print:hidden"></th>
//                  </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                  {paginatedRecords.length === 0 ? (
//                     <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs">No transactions match your filters.</td></tr>
//                  ) : (
//                     paginatedRecords.map(record => (
//                        <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                          
//                           {/* Date Column */}
//                           <td className="px-6 py-3">
//                              <div className="font-medium text-slate-700 text-xs">{new Date(record.paidDate).toLocaleDateString()}</div>
//                              <div className="text-[10px] text-slate-400 mt-0.5">{new Date(record.paidDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
//                           </td>

//                           {/* Type Column */}
//                           <td className="px-6 py-3">
//                              <Badge variant="secondary" className={cn(
//                                 "text-[10px] px-2 py-0 h-5 font-medium border-0 rounded-md",
//                                 record.method === 'reimbursement' ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
//                              )}>
//                                 {record.method === 'reimbursement' ? 'Added / Future' : 'Paid Out'}
//                              </Badge>
//                              <div className="text-[10px] text-slate-400 mt-1 capitalize pl-1">{record.method}</div>
//                           </td>

//                           {/* Description */}
//                           <td className="px-6 py-3 max-w-[200px]">
//                              <div className="truncate text-xs font-medium text-slate-700">{record.notes || `Salary Payment`}</div>
//                              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Cycle: {record.month}</div>
//                           </td>

//                           {/* Amount */}
//                           <td className="px-6 py-3 text-right">
//                              <div className={cn("font-mono font-bold text-sm", record.method === 'reimbursement' ? "text-blue-600" : "text-slate-900")}>
//                                 {formatCurrency(record.netSalary)}
//                              </div>
//                           </td>

//                           {/* Actions (Delete only visible on hover) */}
//                           <td className="px-6 py-3 text-center print:hidden">
//                              <Button 
//                                 variant="ghost" size="sm" 
//                                 className="h-7 w-7 p-0 text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all" 
//                                 onClick={() => { if(confirm("Delete this transaction permanently?")) onDelete(record.id); }}
//                              >
//                                 {/* Using text "Delete" or icon depending on preference, sticking to icon for compactness */}
//                                 <Trash2 className="w-3.5 h-3.5" />
//                              </Button>
//                           </td>
//                        </tr>
//                     ))
//                  )}
//               </tbody>
//            </table>
//         </div>

//         {/* --- PAGINATION --- */}
//         {totalPages > 1 && (
//            <div className="px-5 py-2 border-t bg-slate-50 flex items-center justify-between shrink-0 print:hidden">
//               <span className="text-[10px] text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
//               <div className="flex gap-2">
//                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-7 text-xs">
//                     Previous
//                  </Button>
//                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-7 text-xs">
//                     Next
//                  </Button>
//               </div>
//            </div>
//         )}

//       </DialogContent>
//     </Dialog>
//   );
// };





















































import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Printer, PlusCircle, MinusCircle, Wallet,
  ExternalLink, Trash2, X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { formatCurrency } from '@/utils/formatters';
import type { PayrollRecord, Employee } from '@/types';
import { cn } from '@/lib/utils';
// Import our new engine from the main Payroll file
import { calculateEmployeeLedger } from '@/pages/Payroll'; 

interface EmployeeLedgerProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  records: PayrollRecord[];
  onDelete: (id: string) => void;
}

export const EmployeeLedger = ({ isOpen, onClose, employee, records, onDelete }: EmployeeLedgerProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Generate the unified auto-accrual ledger
  const { ledger, lifetimeAccrued, lifetimePaid, currentBalance } = useMemo(() => {
    if (!employee) return { ledger: [], lifetimeAccrued: 0, lifetimePaid: 0, currentBalance: 0 };
    return calculateEmployeeLedger(employee, records);
  }, [employee, records]);

  // Apply Search
  const filteredLedger = useMemo(() => {
    return ledger.filter(item => 
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ledger, searchTerm]);

  if (!employee) return null;

  const handleProfileClick = () => {
    onClose();
    navigate(`/team/profile/${employee.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
        
        {/* --- HEADER --- */}
        <DialogHeader className="px-6 py-5 bg-slate-900 border-b shrink-0 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
             <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-inner">
                {employee.name.charAt(0)}
             </div>
             <div className="min-w-0">
                <div 
                  className="flex items-center gap-2 cursor-pointer group" 
                  onClick={handleProfileClick}
                  title="View Profile"
                >
                   <DialogTitle className="text-xl font-extrabold text-white leading-none truncate group-hover:text-blue-300 transition-colors">
                      {employee.name}
                   </DialogTitle>
                   <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <p className="text-xs text-white/60 mt-1.5 font-medium truncate uppercase tracking-wider">{employee.designation}</p>
             </div>
          </div>
          
          <div className="flex gap-2 print:hidden items-center">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="h-9 text-xs gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white rounded-full px-4 font-bold">
               <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print Ledger</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full h-9 w-9"><X className="w-4 h-4"/></Button>
          </div>
        </DialogHeader>

        {/* --- LIFETIME STATS RIBBON --- */}
        <div className="px-6 py-4 bg-slate-50 border-b flex flex-wrap gap-4 items-center justify-between shrink-0 print:hidden">
           <div className="flex gap-6 w-full md:w-auto">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl shadow-sm"><Wallet className="w-4 h-4" /></div>
                 <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lifetime Accrued</p>
                    <p className="text-lg font-extrabold text-slate-900 leading-none mt-0.5">{formatCurrency(lifetimeAccrued)}</p>
                 </div>
              </div>
              <div className="w-px h-10 bg-slate-200 hidden md:block" />
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shadow-sm"><MinusCircle className="w-4 h-4" /></div>
                 <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lifetime Paid</p>
                    <p className="text-lg font-extrabold text-slate-900 leading-none mt-0.5">{formatCurrency(lifetimePaid)}</p>
                 </div>
              </div>
              <div className="w-px h-10 bg-slate-200 hidden lg:block" />
              <div className="flex items-center gap-3">
                 <div className={cn("p-2.5 rounded-xl shadow-sm", currentBalance > 0 ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-700")}><PlusCircle className="w-4 h-4" /></div>
                 <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current Arrears</p>
                    <p className={cn("text-lg font-extrabold leading-none mt-0.5", currentBalance > 0 ? "text-rose-600" : "text-slate-900")}>{formatCurrency(currentBalance)}</p>
                 </div>
              </div>
           </div>

           <div className="relative flex-1 max-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search ledger..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-full shadow-sm focus-visible:ring-[#5d88c6]"/>
           </div>
        </div>

        {/* --- TABLE CONTENT --- */}
        <div className="flex-1 overflow-auto bg-white p-0 relative">
           <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-white text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b sticky top-0 z-10 shadow-sm">
                 <tr>
                    <th className="px-6 py-4">Timeline</th>
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4 text-right">Added to Due (+)</th>
                    <th className="px-6 py-4 text-right">Payment Made (-)</th>
                    <th className="px-6 py-4 text-right border-l bg-slate-50">Running Balance</th>
                    <th className="px-4 py-4 text-center print:hidden"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {filteredLedger.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No transactions found.</td></tr>
                 ) : (
                    filteredLedger.map((item, _idx) => (
                       <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                          
                          <td className="px-6 py-4 align-top">
                             <div className="font-bold text-slate-700 text-xs">{new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</div>
                             <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          </td>

                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                               {item.type === 'accrual' ? (
                                  <Badge variant="outline" className="bg-indigo-50 border-indigo-100 text-indigo-700 text-[9px] uppercase px-1.5 py-0">System Accrual</Badge>
                               ) : (
                                  <Badge variant="outline" className="bg-emerald-50 border-emerald-100 text-emerald-700 text-[9px] uppercase px-1.5 py-0">Manual Payout</Badge>
                               )}
                             </div>
                             <div className="text-xs font-semibold text-slate-800 mt-1.5">{item.description}</div>
                          </td>

                          <td className="px-6 py-4 text-right align-top font-mono">
                             {item.type === 'accrual' ? <span className="font-bold text-slate-900">{formatCurrency(item.amount)}</span> : <span className="text-slate-300">-</span>}
                          </td>

                          <td className="px-6 py-4 text-right align-top font-mono">
                             {item.type === 'payment' ? <span className="font-bold text-emerald-600">{formatCurrency(item.amount)}</span> : <span className="text-slate-300">-</span>}
                          </td>

                          <td className="px-6 py-4 text-right align-top font-mono border-l bg-slate-50/30 group-hover:bg-slate-50 transition-colors">
                             <span className={cn("font-bold", item.runningBalance > 0 ? "text-rose-600" : "text-slate-500")}>
                               {formatCurrency(item.runningBalance)}
                             </span>
                          </td>

                          <td className="px-4 py-4 text-center align-top print:hidden">
                             {item.isManual && (
                               <Button 
                                  variant="ghost" size="icon" 
                                  className="h-7 w-7 p-0 text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all rounded-full" 
                                  onClick={() => { if(confirm("Reverse this payment? This will update the running balance.")) onDelete(item.record.id); }}
                                  title="Delete Record"
                               >
                                  <Trash2 className="w-3.5 h-3.5" />
                               </Button>
                             )}
                          </td>
                       </tr>
                    ))
                 )}
              </tbody>
           </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};