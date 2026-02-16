import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Printer,
  ArrowUpCircle, ExternalLink, Calculator, Calendar,
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { formatCurrency } from '@/utils/formatters';
import type { PayrollRecord, Employee } from '@/types';
import { cn } from '@/lib/utils';

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
  const [typeFilter, setTypeFilter] = useState('all');
  
  // UX Improvement: Single Calendar Filter
  // Default to empty (All Time) or set a default like new Date().toISOString().slice(0, 7)
  const [monthFilter, setMonthFilter] = useState(''); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- 1. Filter Logic ---
  const filteredRecords = useMemo(() => {
    if (!employee) return [];

    return records.filter(r => {
      // 1. Calendar Filter (Month/Year)
      // Checks if the record's "month" (YYYY-MM) matches the filter
      // OR if the paidDate starts with the filter (handles exact dates if needed)
      if (monthFilter && r.month !== monthFilter && !r.paidDate.startsWith(monthFilter)) {
         return false;
      }

      // 2. Type Filter
      if (typeFilter === 'salary' && r.method === 'reimbursement') return false;
      if (typeFilter === 'reimbursement' && r.method !== 'reimbursement') return false;

      // 3. Search Filter
      const searchLower = searchTerm.toLowerCase();
      return (r.notes?.toLowerCase() || '').includes(searchLower) || 
             r.month.toLowerCase().includes(searchLower);
    });
  }, [records, searchTerm, typeFilter, monthFilter, employee]);

  // --- 2. Stats (Dynamic based on Filter) ---
  const stats = useMemo(() => {
    const totalGiven = filteredRecords
      .filter(r => r.method !== 'reimbursement')
      .reduce((sum, r) => sum + r.netSalary, 0);
    
    const totalAdded = filteredRecords
      .filter(r => r.method === 'reimbursement')
      .reduce((sum, r) => sum + r.netSalary, 0);

    return { totalGiven, totalAdded, count: filteredRecords.length };
  }, [filteredRecords]);

  // --- 3. Pagination ---
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!employee) return null;

  const handleProfileClick = () => {
    onClose();
    navigate(`/team/profile/${employee.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-50 border-0 shadow-2xl">
        
        {/* --- HEADER --- */}
        <DialogHeader className="px-5 py-4 bg-white border-b shrink-0 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200 shrink-0">
                {employee.name.charAt(0)}
             </div>
             <div className="min-w-0">
                <div 
                  className="flex items-center gap-2 cursor-pointer group" 
                  onClick={handleProfileClick}
                  title="View Profile"
                >
                   <DialogTitle className="text-lg font-bold text-slate-900 leading-none truncate group-hover:text-blue-600 transition-colors">
                      {employee.name}
                   </DialogTitle>
                   <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium truncate">{employee.designation}</p>
             </div>
          </div>
          
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="h-9 text-xs gap-2 bg-white">
               <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print Statement</span>
            </Button>
            {/* Duplicate 'X' removed. DialogContent provides the default close button. */}
          </div>
        </DialogHeader>

        {/* --- STATS & FILTERS RIBBON --- */}
        <div className="px-5 py-4 bg-white border-b flex flex-wrap gap-4 items-center justify-between shrink-0 print:hidden">
           
           {/* Stats Container - Responsive Grid */}
           <div className="grid grid-cols-2 md:flex md:items-center gap-2 md:gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 w-full md:w-auto">
              
              {/* Total Given */}
              <div className="flex items-center gap-3 md:pr-6 md:border-r border-slate-200">
                 <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full"><ArrowUpCircle className="w-4 h-4" /></div>
                 <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Given</p>
                    <p className="text-sm md:text-base font-bold text-slate-900 leading-none">{formatCurrency(stats.totalGiven)}</p>
                 </div>
              </div>

              {/* Added / Future */}
              <div className="flex items-center gap-3 md:pr-6 md:border-r border-slate-200">
                 <div className="p-2 bg-blue-100 text-blue-700 rounded-full"><Calculator className="w-4 h-4" /></div>
                 <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Added / Future</p>
                    <p className="text-sm md:text-base font-bold text-slate-900 leading-none">{formatCurrency(stats.totalAdded)}</p>
                 </div>
              </div>

              {/* Records Count */}
              <div className="hidden md:block">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Records</p>
                 <p className="text-sm md:text-base font-bold text-slate-900 leading-none">{stats.count}</p>
              </div>
           </div>

           {/* --- FILTERS --- */}
           <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
              
              {/* Calendar Filter (Month Picker) */}
              <div className="relative">
                 <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                 <Input 
                    type="month" 
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="pl-8 h-9 w-[140px] text-xs bg-white border-slate-200 shadow-sm"
                    placeholder="Select Month"
                 />
                 {monthFilter && (
                    <button 
                       onClick={() => setMonthFilter('')}
                       className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] text-blue-600 hover:underline font-medium"
                    >
                       Clear
                    </button>
                 )}
              </div>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                 <SelectTrigger className="h-9 w-[130px] text-xs bg-white border-slate-200 shadow-sm">
                    <Filter className="w-3.5 h-3.5 mr-2 text-slate-400"/> <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="salary">Payments</SelectItem>
                    <SelectItem value="reimbursement">Reimbursements</SelectItem>
                 </SelectContent>
              </Select>

              {/* Search */}
              <div className="relative flex-1 min-w-[140px]">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                 <Input 
                   placeholder="Search notes..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="pl-8 h-9 text-xs bg-white border-slate-200 shadow-sm"
                 />
              </div>
           </div>
        </div>

        {/* --- TABLE CONTENT --- */}
        <div className="flex-1 overflow-auto bg-white p-0 relative">
           <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-semibold border-b sticky top-0 z-10 shadow-sm">
                 <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Description / Cycle</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3 text-center print:hidden"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {paginatedRecords.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs">No transactions match your filters.</td></tr>
                 ) : (
                    paginatedRecords.map(record => (
                       <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                          
                          {/* Date Column */}
                          <td className="px-6 py-3">
                             <div className="font-medium text-slate-700 text-xs">{new Date(record.paidDate).toLocaleDateString()}</div>
                             <div className="text-[10px] text-slate-400 mt-0.5">{new Date(record.paidDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          </td>

                          {/* Type Column */}
                          <td className="px-6 py-3">
                             <Badge variant="secondary" className={cn(
                                "text-[10px] px-2 py-0 h-5 font-medium border-0 rounded-md",
                                record.method === 'reimbursement' ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                             )}>
                                {record.method === 'reimbursement' ? 'Added / Future' : 'Paid Out'}
                             </Badge>
                             <div className="text-[10px] text-slate-400 mt-1 capitalize pl-1">{record.method}</div>
                          </td>

                          {/* Description */}
                          <td className="px-6 py-3 max-w-[200px]">
                             <div className="truncate text-xs font-medium text-slate-700">{record.notes || `Salary Payment`}</div>
                             <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Cycle: {record.month}</div>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-3 text-right">
                             <div className={cn("font-mono font-bold text-sm", record.method === 'reimbursement' ? "text-blue-600" : "text-slate-900")}>
                                {formatCurrency(record.netSalary)}
                             </div>
                          </td>

                          {/* Actions (Delete only visible on hover) */}
                          <td className="px-6 py-3 text-center print:hidden">
                             <Button 
                                variant="ghost" size="sm" 
                                className="h-7 w-7 p-0 text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all" 
                                onClick={() => { if(confirm("Delete this transaction permanently?")) onDelete(record.id); }}
                             >
                                {/* Using text "Delete" or icon depending on preference, sticking to icon for compactness */}
                                <Trash2 className="w-3.5 h-3.5" />
                             </Button>
                          </td>
                       </tr>
                    ))
                 )}
              </tbody>
           </table>
        </div>

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
           <div className="px-5 py-2 border-t bg-slate-50 flex items-center justify-between shrink-0 print:hidden">
              <span className="text-[10px] text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                 <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-7 text-xs">
                    Previous
                 </Button>
                 <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-7 text-xs">
                    Next
                 </Button>
              </div>
           </div>
        )}

      </DialogContent>
    </Dialog>
  );
};