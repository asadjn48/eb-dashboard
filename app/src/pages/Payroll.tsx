/* eslint-disable prefer-const */
/* eslint-disable react-refresh/only-export-components */



// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState, useMemo } from 'react';
// import { Search, Download, Calendar, History, FileText, RefreshCw, Pencil } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';

// import { teamAPI } from '@/services/teamService';
// import { payrollAPI } from '@/services/payrollService';
// import { formatCurrency, getInitials } from '@/utils/formatters';
// import { cn } from '@/lib/utils';

// import { PayrollStats } from '@/components/payroll/PayrollStats';
// import { PaymentModal } from '@/components/payroll/PaymentModal';
// import { PayslipModal } from '@/components/payroll/PayslipModal';
// import { EmployeeLedger } from '@/components/payroll/EmployeeLedger';
// import type { Employee, PayrollRecord } from '@/types';

// const Payroll: React.FC = () => {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'partial'>('all');
//   const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
//   const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
//   const [currentDueAmount, setCurrentDueAmount] = useState(0);

//   const [modals, setModals] = useState({ pay: false, history: false, payslip: false, editCycle: false });
//   const [cycleForm, setCycleForm] = useState({ salary: 0, startDate: '' });

//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const [teamData, payrollData] = await Promise.all([teamAPI.getAll(), payrollAPI.getAll()]);
//       setEmployees(teamData.filter(e => e.status === 'active'));
//       setPayrollRecords(payrollData);
//     } catch (error) { console.error("Error:", error); }
//     finally { setIsLoading(false); }
//   };

//   useEffect(() => { loadData(); }, []);

//   const processedList = useMemo(() => {
//     return employees.map(emp => {
//       const empRecords = payrollRecords.filter(p => p.employeeId === emp.id && p.month === selectedMonth);
//       const totalPaid = empRecords.filter(r => r.method !== 'reimbursement').reduce((sum, r) => sum + r.netSalary, 0);
//       const totalReimbursements = empRecords.filter(r => r.method === 'reimbursement').reduce((sum, r) => sum + r.netSalary, 0);
//       const totalDue = emp.salary + totalReimbursements;
//       const remaining = totalDue - totalPaid;
      
//       let status: 'paid' | 'pending' | 'partial' = 'pending';
//       if (remaining <= 0) status = 'paid';
//       else if (totalPaid > 0) status = 'partial';

//       const today = new Date();
//       const cycleDay = emp.salaryStartDate ? new Date(emp.salaryStartDate).getDate() : 1;
//       const isCycleComplete = today.getDate() >= cycleDay; 
//       const mainRecord = empRecords.find(r => r.method !== 'reimbursement') || empRecords[0] || null;

//       return {
//         ...emp, payrollStatus: status, totalDue, totalPaid, remaining: Math.max(0, remaining),
//         lastPaidDate: mainRecord?.paidDate || null, isCycleComplete, record: mainRecord
//       };
//     }).filter(item => {
//       const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchStatus = statusFilter === 'all' || item.payrollStatus === statusFilter;
//       return matchSearch && matchStatus;
//     });
//   }, [employees, payrollRecords, selectedMonth, searchQuery, statusFilter]);

//   const stats = useMemo(() => {
//     const totalDue = processedList.reduce((sum, p) => sum + p.totalDue, 0);
//     const totalPaid = processedList.reduce((sum, p) => sum + p.totalPaid, 0);
//     const paidCount = processedList.filter(p => p.payrollStatus === 'paid').length;
//     return { total: totalDue, paid: totalPaid, paidCount, pending: totalDue - totalPaid, pendingCount: processedList.length - paidCount, count: processedList.length };
//   }, [processedList]);

//   const handlePayClick = (employee: any) => {
//     setSelectedEmployee(employee);
//     setCurrentDueAmount(employee.remaining);
//     setModals({ ...modals, pay: true });
//   };

//   const handlePayment = async (data: any) => {
//     if (!selectedEmployee) return;
//     const newRecord: PayrollRecord = {
//       id: "temp", employeeId: selectedEmployee.id, employeeName: selectedEmployee.name, department: selectedEmployee.department,
//       mobile: selectedEmployee.phone, baseSalary: selectedEmployee.salary, bonuses: data.bonus, deductions: data.deduction,
//       tax: data.tax, netSalary: data.netSalary, status: 'paid', month: selectedMonth, paidDate: data.date,
//       method: data.type === 'reimbursement' ? 'reimbursement' : data.method, notes: data.notes
//     };
//     const saved = await payrollAPI.add(newRecord);
//     setPayrollRecords(prev => [saved, ...prev]);
//     setModals(prev => ({ ...prev, pay: false }));
//   };

//   const handleUpdateCycle = async () => {
//     if (!selectedEmployee) return;
//     try {
//       await teamAPI.update(selectedEmployee.id, { salary: cycleForm.salary, salaryStartDate: cycleForm.startDate });
//       setEmployees(prev => prev.map(e => e.id === selectedEmployee!.id ? { ...e, salary: cycleForm.salary, salaryStartDate: cycleForm.startDate } : e));
//       setModals(prev => ({ ...prev, editCycle: false }));
//     } catch(e) { console.error(e); }
//   };

//   const handleDeleteRecord = async (id: string) => {
//     await payrollAPI.delete(id);
//     setPayrollRecords(prev => prev.filter(r => r.id !== id));
//   };

//   return (
//     <div className="space-y-4 pb-20 animate-in fade-in duration-500">
      
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">Payroll</h1>
//           <p className="text-xs text-gray-500 mt-0.5">Managing: <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{selectedMonth}</span></p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" size="sm" onClick={loadData} className="h-8 w-8 p-0"><RefreshCw className="w-3.5 h-3.5" /></Button>
//           <Button variant="outline" className="h-8 text-xs bg-white"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
//         </div>
//       </div>

//       <PayrollStats stats={stats} />

//       {/* Main Table Card */}
//       <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
//         <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
//            <div className="relative flex-1 w-full">
//               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//               <Input placeholder="Search employee..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 h-8 text-xs bg-gray-50 border-gray-200" />
//            </div>
//            <div className="flex gap-2 w-full sm:w-auto">
//               <div className="relative">
//                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
//                  <Input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="pl-8 w-[140px] h-8 text-xs bg-white" />
//               </div>
//               <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
//                  <SelectTrigger className="w-[120px] h-8 text-xs bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
//                  <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent>
//               </Select>
//            </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead className="text-[11px] font-semibold text-gray-500 uppercase bg-slate-50/50 border-b border-gray-100">
//               <tr>
//                 <th className="px-6 py-3">Employee</th>
//                 <th className="px-6 py-3 hidden md:table-cell">Contact</th>
//                 <th className="px-6 py-3 text-right">Paid / Due</th>
//                 <th className="px-6 py-3 text-center">Status</th>
//                 <th className="px-6 py-3 text-center hidden sm:table-cell">Cycle</th>
//                 <th className="px-4 py-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {isLoading ? (<tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-xs">Loading...</td></tr>) 
//               : processedList.length === 0 ? (<tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-xs">No records found.</td></tr>) 
//               : (processedList.map((item) => (
//                   <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
//                     <td className="px-6 py-3">
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-8 w-8 border border-gray-100">
//                           <AvatarImage src={item.avatar} />
//                           <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-[10px]">{getInitials(item.name)}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <div className="font-medium text-gray-900 text-xs">{item.name}</div>
//                           <div className="text-[10px] text-gray-500">{item.designation}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-3 hidden md:table-cell text-xs text-gray-500">
//                        <div>{item.phone || '-'}</div>
//                        <div className="opacity-75 text-[10px]">{item.department}</div>
//                     </td>
//                     <td className="px-6 py-3 text-right">
//                       <div className="font-mono font-medium text-gray-900 text-xs">{formatCurrency(item.totalPaid)}</div>
//                       <div className="text-[10px] text-gray-400">of {formatCurrency(item.totalDue)}</div>
//                     </td>
//                     <td className="px-6 py-3 text-center">
//                       <Badge variant="secondary" className={cn("text-[10px] capitalize px-2 py-0 h-5 border", 
//                         item.payrollStatus === 'paid' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : 
//                         item.payrollStatus === 'partial' ? "bg-blue-50 border-blue-100 text-blue-700" : "bg-amber-50 border-amber-100 text-amber-700"
//                       )}>{item.payrollStatus}</Badge>
//                     </td>
//                     <td className="px-6 py-3 text-center text-[10px] text-gray-500 hidden sm:table-cell">
//                        Starts: {item.salaryStartDate ? new Date(item.salaryStartDate).getDate() : '1st'}
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <div className="flex items-center justify-end gap-1">
//                         <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-slate-700" onClick={() => { setSelectedEmployee(item); setCycleForm({ salary: item.salary, startDate: item.salaryStartDate || '' }); setModals({ ...modals, editCycle: true }); }}>
//                            <Pencil className="w-3.5 h-3.5" />
//                         </Button>
//                         {item.payrollStatus !== 'paid' ? (
//                           <Button size="sm" className={cn("h-7 text-[10px] shadow-sm px-2", item.isCycleComplete ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-600 text-white")} onClick={() => handlePayClick(item)}>Pay Now</Button>
//                         ) : (
//                           <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-600 bg-blue-50 hover:bg-blue-100" onClick={() => { if(item.record) { setSelectedRecord(item.record); setModals({ ...modals, payslip: true }); } }}>
//                              <FileText className="w-3.5 h-3.5" />
//                           </Button>
//                         )}
//                         <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-gray-600" onClick={() => { setSelectedEmployee(item); setModals({ ...modals, history: true }); }}>
//                            <History className="w-3.5 h-3.5" />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       <PaymentModal isOpen={modals.pay} onClose={() => setModals(prev => ({ ...prev, pay: false }))} employee={selectedEmployee} currentBalance={currentDueAmount} onConfirm={handlePayment} />
//       <EmployeeLedger isOpen={modals.history} onClose={() => setModals(prev => ({ ...prev, history: false }))} employee={selectedEmployee} records={payrollRecords.filter(p => p.employeeId === selectedEmployee?.id)} onDelete={handleDeleteRecord} />
//       <PayslipModal isOpen={modals.payslip} onClose={() => setModals(prev => ({ ...prev, payslip: false }))} record={selectedRecord} />
      
//       <Dialog open={modals.editCycle} onOpenChange={(v) => setModals(prev => ({ ...prev, editCycle: v }))}>
//          <DialogContent className="sm:max-w-sm"><DialogHeader><DialogTitle>Edit Salary Details</DialogTitle></DialogHeader>
//             <div className="space-y-4 py-2">
//                <div className="space-y-1.5"><Label>Base Salary</Label><Input type="number" value={cycleForm.salary} onChange={e => setCycleForm({...cycleForm, salary: Number(e.target.value)})} /></div>
//                <div className="space-y-1.5"><Label>Cycle Start Date</Label><Input type="date" value={cycleForm.startDate} onChange={e => setCycleForm({...cycleForm, startDate: e.target.value})} /></div>
//             </div>
//             <DialogFooter><Button variant="outline" onClick={() => setModals(prev => ({ ...prev, editCycle: false }))}>Cancel</Button><Button onClick={handleUpdateCycle} className="bg-slate-900 text-white">Save Changes</Button></DialogFooter>
//          </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Payroll;
























































/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react';
import { Search, Download, History, RefreshCw, Pencil, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { teamAPI } from '@/services/teamService';
import { payrollAPI } from '@/services/payrollService';
import { formatCurrency, getInitials } from '@/utils/formatters';
import { cn } from '@/lib/utils';

import { PayrollStats } from '@/components/payroll/PayrollStats';
import { PaymentModal } from '@/components/payroll/PaymentModal';
import { PayslipModal } from '@/components/payroll/PayslipModal';
import { EmployeeLedger } from '@/components/payroll/EmployeeLedger';
import type { Employee, PayrollRecord } from '@/types';

// --- CORE ACCRUAL ENGINE ---
export const calculateEmployeeLedger = (emp: Employee, records: PayrollRecord[]) => {
  const ledger: any[] = [];
  const today = new Date();
  const joinDate = new Date(emp.joinDate || today);
  const cycleDay = emp.salaryStartDate ? new Date(emp.salaryStartDate).getDate() : 1;

  // 1. Auto-Generate Salary Accruals based on cycles passed since join date
  let nextAccrual = new Date(joinDate.getFullYear(), joinDate.getMonth(), cycleDay);
  if (nextAccrual < joinDate) nextAccrual.setMonth(nextAccrual.getMonth() + 1);

  let lifetimeAccrued = 0;
  while (nextAccrual <= today) {
    lifetimeAccrued += (Number(emp.salary) || 0);
    ledger.push({
      id: `auto-${nextAccrual.getTime()}`,
      date: nextAccrual.toISOString(),
      type: 'accrual',
      description: `Salary Accrued (${nextAccrual.toLocaleString('default', { month: 'short', year: 'numeric' })})`,
      amount: Number(emp.salary) || 0,
      isManual: false
    });
    nextAccrual.setMonth(nextAccrual.getMonth() + 1);
  }

  // 2. Add Manual Payments & Reimbursements
  let lifetimePaid = 0;
  records.forEach(r => {
    if (r.method === 'reimbursement') {
      // Reimbursements ADD to the amount owed by the company
      lifetimeAccrued += r.netSalary;
      ledger.push({
        id: r.id, date: r.paidDate || r.createdAt, type: 'accrual',
        description: `Manual Adjustment: ${r.notes || 'Reimbursement'}`,
        amount: r.netSalary, isManual: true, record: r
      });
    } else {
      // Regular payments REDUCE the amount owed by the company
      lifetimePaid += r.netSalary;
      ledger.push({
        id: r.id, date: r.paidDate || r.createdAt, type: 'payment',
        description: `Payout (${r.method}) ${r.notes ? `- ${r.notes}` : ''}`,
        amount: r.netSalary, isManual: true, record: r
      });
    }
  });

  // 3. Sort chronologically and calculate running balance
  ledger.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let balance = 0; // Positive means Company owes Employee (Arrears)
  ledger.forEach(item => {
    if (item.type === 'accrual') balance += item.amount;
    else balance -= item.amount;
    item.runningBalance = balance;
  });

  return { ledger: ledger.reverse(), lifetimeAccrued, lifetimePaid, currentBalance: balance };
};

const Payroll: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'arrears' | 'cleared' | 'advance'>('all');

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedRecord] = useState<PayrollRecord | null>(null);
  const [currentDueAmount, setCurrentDueAmount] = useState(0);

  const [modals, setModals] = useState({ pay: false, history: false, payslip: false, editCycle: false });
  const [cycleForm, setCycleForm] = useState({ salary: 0, startDate: '' });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [teamData, payrollData] = await Promise.all([teamAPI.getAll(), payrollAPI.getAll()]);
      setEmployees(teamData.filter(e => e.status === 'active'));
      setPayrollRecords(payrollData);
    } catch (error) { console.error("Error:", error); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  // Process unified running balances for all employees
  const processedList = useMemo(() => {
    return employees.map(emp => {
      const empRecords = payrollRecords.filter(p => p.employeeId === emp.id);
      const { lifetimeAccrued, lifetimePaid, currentBalance } = calculateEmployeeLedger(emp, empRecords);
      
      let status: 'arrears' | 'cleared' | 'advance' = 'cleared';
      if (currentBalance > 0) status = 'arrears';
      if (currentBalance < 0) status = 'advance';

      return {
        ...emp,
        lifetimeAccrued,
        lifetimePaid,
        currentBalance,
        payrollStatus: status,
      };
    }).filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || item.payrollStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [employees, payrollRecords, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalArrears = processedList.filter(p => p.currentBalance > 0).reduce((sum, p) => sum + p.currentBalance, 0);
    const totalAdvances = processedList.filter(p => p.currentBalance < 0).reduce((sum, p) => sum + Math.abs(p.currentBalance), 0);
    const employeesInArrears = processedList.filter(p => p.currentBalance > 0).length;
    return { totalArrears, totalAdvances, employeesInArrears, count: processedList.length };
  }, [processedList]);

  const handlePayClick = (employee: any) => {
    setSelectedEmployee(employee);
    setCurrentDueAmount(employee.currentBalance);
    setModals({ ...modals, pay: true });
  };

  const handlePayment = async (data: any) => {
    if (!selectedEmployee) return;
    const newRecord: PayrollRecord = {
      id: "temp", employeeId: selectedEmployee.id, employeeName: selectedEmployee.name, department: selectedEmployee.department,
      mobile: selectedEmployee.phone, baseSalary: selectedEmployee.salary, bonuses: data.bonus, deductions: data.deduction,
      tax: data.tax, netSalary: data.netSalary, status: 'paid', month: new Date().toISOString().slice(0, 7), paidDate: data.date,
      method: data.type === 'reimbursement' ? 'reimbursement' : data.method, notes: data.notes,
      createdAt: ''
    };
    const saved = await payrollAPI.add(newRecord);
    setPayrollRecords(prev => [saved, ...prev]);
    setModals(prev => ({ ...prev, pay: false }));
  };

  const handleUpdateCycle = async () => {
    if (!selectedEmployee) return;
    try {
      await teamAPI.update(selectedEmployee.id, { salary: cycleForm.salary, salaryStartDate: cycleForm.startDate });
      setEmployees(prev => prev.map(e => e.id === selectedEmployee!.id ? { ...e, salary: cycleForm.salary, salaryStartDate: cycleForm.startDate } : e));
      setModals(prev => ({ ...prev, editCycle: false }));
    } catch(e) { console.error(e); }
  };

  const handleDeleteRecord = async (id: string) => {
    await payrollAPI.delete(id);
    setPayrollRecords(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 pt-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payroll Ledger</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Real-time auto-accrual & balances.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} className="h-9 w-9 p-0 rounded-full shadow-sm hover:bg-slate-100"><RefreshCw className="w-4 h-4 text-slate-600" /></Button>
          <Button variant="outline" className="h-9 text-xs bg-white shadow-sm font-bold"><Download className="w-3.5 h-3.5 mr-2" /> Export</Button>
        </div>
      </div>

      <PayrollStats stats={stats} />

      {/* Main Table Card */}
      <Card className="border border-slate-200/60 shadow-sm overflow-hidden bg-white rounded-2xl">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
           <div className="relative flex-1 w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search employee..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus-visible:ring-[#5d88c6] rounded-full shadow-none" />
           </div>
           <div className="flex gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                 <SelectTrigger className="w-[140px] h-9 text-xs bg-white border-slate-200 rounded-full font-medium shadow-none"><SelectValue placeholder="Status" /></SelectTrigger>
                 <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="arrears">In Arrears (Due)</SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                    <SelectItem value="advance">Advance Paid</SelectItem>
                 </SelectContent>
              </Select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] font-bold text-slate-500 uppercase bg-slate-50 border-b border-slate-100 tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4 hidden lg:table-cell">Salary Rule</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Outstanding Balance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (<tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">Calculating running balances...</td></tr>) 
              : processedList.length === 0 ? (<tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium flex flex-col items-center"><AlertCircle className="w-8 h-8 mb-2 opacity-20"/> No records found.</td></tr>) 
              : (processedList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback className="bg-[#5d88c6] text-white font-bold text-xs">{getInitials(item.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-slate-900 text-sm group-hover:text-[#5d88c6] transition-colors">{item.name}</div>
                          <div className="text-[11px] font-medium text-slate-500 mt-0.5">{item.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                       <div className="flex items-center gap-2">
                           <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">{formatCurrency(item.salary)}</span>
                           <span className="text-[10px] text-slate-400 font-medium">/ month</span>
                       </div>
                       <div className="text-[10px] text-slate-400 mt-1.5 font-medium flex items-center">
                           <Calendar className="w-3 h-3 mr-1 opacity-70" /> Cycle: {item.salaryStartDate ? new Date(item.salaryStartDate).getDate() : '1'}st of month
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border-0", 
                        item.payrollStatus === 'cleared' ? "bg-emerald-100 text-emerald-700" : 
                        item.payrollStatus === 'advance' ? "bg-purple-100 text-purple-700" : "bg-rose-100 text-rose-700"
                      )}>
                        {item.payrollStatus === 'arrears' ? 'Payment Due' : item.payrollStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={cn("font-mono font-bold text-base", 
                         item.currentBalance > 0 ? "text-rose-600" : 
                         item.currentBalance < 0 ? "text-purple-600" : "text-emerald-600"
                      )}>
                        {item.currentBalance > 0 ? formatCurrency(item.currentBalance) : 
                         item.currentBalance < 0 ? `+${formatCurrency(Math.abs(item.currentBalance))} Adv.` : 
                         'Rs 0'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-1">Lifetime: {formatCurrency(item.lifetimeAccrued)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full" onClick={() => { setSelectedEmployee(item); setCycleForm({ salary: item.salary, startDate: item.salaryStartDate || '' }); setModals({ ...modals, editCycle: true }); }} title="Edit Salary Rules">
                           <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-full" onClick={() => { setSelectedEmployee(item); setModals({ ...modals, history: true }); }} title="View Ledger">
                           <History className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className={cn("h-8 text-xs font-bold rounded-full px-4 shadow-sm transition-all", item.currentBalance > 0 ? "bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md" : "bg-slate-800 text-white hover:bg-slate-700")} onClick={() => handlePayClick(item)}>
                           Pay
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <PaymentModal isOpen={modals.pay} onClose={() => setModals(prev => ({ ...prev, pay: false }))} employee={selectedEmployee} currentBalance={currentDueAmount} onConfirm={handlePayment} />
      <EmployeeLedger isOpen={modals.history} onClose={() => setModals(prev => ({ ...prev, history: false }))} employee={selectedEmployee} records={payrollRecords.filter(p => p.employeeId === selectedEmployee?.id)} onDelete={handleDeleteRecord} />
      <PayslipModal isOpen={modals.payslip} onClose={() => setModals(prev => ({ ...prev, payslip: false }))} record={selectedRecord} />
      
      <Dialog open={modals.editCycle} onOpenChange={(v) => setModals(prev => ({ ...prev, editCycle: v }))}>
         <DialogContent className="sm:max-w-sm rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="pb-4 border-b border-slate-100">
               <DialogTitle className="text-lg font-bold text-slate-800">Edit Payroll Rules</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
               <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Base Salary (PKR)</Label>
                  <Input type="number" className="h-10 font-mono text-base font-bold bg-slate-50 border-slate-200" value={cycleForm.salary} onChange={e => setCycleForm({...cycleForm, salary: Number(e.target.value)})} />
               </div>
               <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cycle Anchor Date</Label>
                  <Input type="date" className="h-10 bg-slate-50 border-slate-200 text-slate-700 font-medium" value={cycleForm.startDate} onChange={e => setCycleForm({...cycleForm, startDate: e.target.value})} />
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Salaries will auto-accrue based on the day of this date.</p>
               </div>
            </div>
            <DialogFooter className="pt-2">
               <Button variant="outline" className="rounded-full font-bold h-9 px-6" onClick={() => setModals(prev => ({ ...prev, editCycle: false }))}>Cancel</Button>
               <Button onClick={handleUpdateCycle} className="bg-slate-900 text-white rounded-full font-bold h-9 px-6 hover:bg-slate-800 shadow-md">Apply Rules</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payroll;