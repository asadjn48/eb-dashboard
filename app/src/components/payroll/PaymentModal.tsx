/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from 'react';
// import { Wallet, X } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { formatCurrency } from '@/utils/formatters';

// export const PaymentModal = ({ isOpen, onClose, employee, onConfirm }: any) => {
//   const [form, setForm] = useState({
//     bonus: 0, deduction: 0, tax: 0,
//     date: new Date().toISOString().split('T')[0],
//     method: 'bank'
//   });
//   const [isProcessing, setIsProcessing] = useState(false);

//   if (!employee) return null;

//   const netSalary = employee.salary + Number(form.bonus) - Number(form.deduction) - Number(form.tax);

//   const handleSubmit = async () => {
//     try {
//       setIsProcessing(true);
//       // Wait for the parent to finish adding the record
//       await onConfirm({ ...form, netSalary });
      
//       // Only close if successful
//       onClose();
//     } catch (error) {
//       console.error("Payment Error:", error);
//       alert("Failed to process payment. Please check your connection or try again.");
//     } finally {
//       // Always stop loading, even if it failed
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(val) => !isProcessing && onClose(val)}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <div className="flex items-center justify-between">
//             <DialogTitle className="flex items-center gap-2">
//                <Wallet className="w-5 h-5 text-emerald-600" /> Pay Salary
//             </DialogTitle>
//             <Button variant="ghost" size="icon" onClick={() => onClose(false)} disabled={isProcessing}>
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         </DialogHeader>
        
//         <div className="space-y-4 py-2">
//            <div className="p-3 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
//               <div>
//                  <p className="text-xs text-gray-500">Employee</p>
//                  <p className="font-medium text-gray-900">{employee.name}</p>
//               </div>
//               <div className="text-right">
//                  <p className="text-xs text-gray-500">Base Salary</p>
//                  <p className="font-medium text-gray-900">{formatCurrency(employee.salary)}</p>
//               </div>
//            </div>

//            <div className="grid grid-cols-2 gap-3">
//               <div>
//                  <Label className="text-xs text-gray-600 mb-1 block">Bonus (+)</Label>
//                  <Input 
//                     type="number" className="h-9 bg-emerald-50/50 border-emerald-100" 
//                     value={form.bonus} 
//                     onChange={e => setForm({...form, bonus: Number(e.target.value)})} 
//                  />
//               </div>
//               <div>
//                  <Label className="text-xs text-gray-600 mb-1 block">Deduction (-)</Label>
//                  <Input 
//                     type="number" className="h-9 bg-red-50/50 border-red-100" 
//                     value={form.deduction} 
//                     onChange={e => setForm({...form, deduction: Number(e.target.value)})} 
//                  />
//               </div>
//            </div>

//            <div className="grid grid-cols-2 gap-3">
//               <div>
//                  <Label className="text-xs text-gray-600 mb-1 block">Payment Date</Label>
//                  <Input 
//                     type="date" className="h-9"
//                     value={form.date}
//                     onChange={e => setForm({...form, date: e.target.value})}
//                  />
//               </div>
//               <div>
//                  <Label className="text-xs text-gray-600 mb-1 block">Method</Label>
//                  <Select value={form.method} onValueChange={v => setForm({...form, method: v})}>
//                     <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                        <SelectItem value="bank">Bank Transfer</SelectItem>
//                        <SelectItem value="cash">Cash</SelectItem>
//                        <SelectItem value="cheque">Cheque</SelectItem>
//                     </SelectContent>
//                  </Select>
//               </div>
//            </div>

//            <div className="flex justify-between items-center pt-3 border-t mt-2">
//               <span className="font-semibold text-gray-700">Net Payable</span>
//               <span className="text-2xl font-bold text-emerald-600">{formatCurrency(netSalary)}</span>
//            </div>
//         </div>
//         <DialogFooter>
//            <Button variant="outline" onClick={() => onClose(false)} disabled={isProcessing}>Cancel</Button>
//            <Button className="bg-slate-900 text-white" onClick={handleSubmit} disabled={isProcessing}>
//              {isProcessing ? 'Processing...' : 'Confirm Payment'}
//            </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };






















// import { useState, useEffect } from 'react';
// import { Wallet, X, Building2, CreditCard, AlertCircle } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { formatCurrency } from '@/utils/formatters';

// export const PaymentModal = ({ isOpen, onClose, employee, onConfirm, currentBalance }: any) => {
//   const [form, setForm] = useState({
//     type: 'salary', // salary, advance, reimbursement
//     amount: '',     // Allow empty string for better UX while typing
//     date: new Date().toISOString().split('T')[0],
//     method: 'bank',
//     notes: ''
//   });
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Reset form when opening for a new employee
//   useEffect(() => {
//     if (isOpen && employee) {
//       setForm({
//         type: 'salary',
//         amount: currentBalance > 0 ? currentBalance.toString() : '', // Auto-fill remaining balance
//         date: new Date().toISOString().split('T')[0],
//         method: employee.bankName ? 'bank' : 'cash',
//         notes: ''
//       });
//     }
//   }, [isOpen, employee, currentBalance]);

//   if (!employee) return null;

//   const handleSubmit = async () => {
//     if (!form.amount || Number(form.amount) <= 0) {
//       alert("Please enter a valid amount.");
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       await onConfirm({ 
//         ...form, 
//         amount: Number(form.amount) 
//       });
//       onClose();
//     } catch (error) {
//       console.error("Payment Error:", error);
//       alert("Failed to save transaction. Please check your connection.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(val) => !isProcessing && onClose(val)}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <div className="flex items-center justify-between">
//             <DialogTitle className="flex items-center gap-2 text-xl">
//                <Wallet className="w-6 h-6 text-slate-700" /> Record Transaction
//             </DialogTitle>
//             <Button variant="ghost" size="icon" onClick={() => onClose(false)} disabled={isProcessing}>
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         </DialogHeader>
        
//         <div className="space-y-5 py-2">
           
//            {/* Employee & Bank Summary */}
//            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
//               <div className="flex justify-between items-start border-b border-slate-200 pb-3">
//                  <div>
//                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</p>
//                     <p className="font-bold text-lg text-slate-900">{employee.name}</p>
//                     <p className="text-xs text-slate-500">{employee.designation}</p>
//                  </div>
//                  <div className="text-right">
//                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Due</p>
//                     <p className="font-bold text-xl text-emerald-600">{formatCurrency(currentBalance)}</p>
//                  </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4 pt-1">
//                  <div className="flex items-center gap-2">
//                     <Building2 className="w-4 h-4 text-slate-400" />
//                     <div>
//                        <p className="text-[10px] text-slate-500 uppercase font-bold">Bank Name</p>
//                        <p className="text-sm font-medium text-slate-700">{employee.bankName || 'N/A'}</p>
//                     </div>
//                  </div>
//                  <div className="flex items-center gap-2">
//                     <CreditCard className="w-4 h-4 text-slate-400" />
//                     <div>
//                        <p className="text-[10px] text-slate-500 uppercase font-bold">Account / IBAN</p>
//                        <p className="text-sm font-medium text-slate-700 font-mono">{employee.accountNumber || 'N/A'}</p>
//                     </div>
//                  </div>
//               </div>
//            </div>

//            {/* Input Fields */}
//            <div className="grid grid-cols-2 gap-4">
//               <div className="col-span-2">
//                  <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Transaction Type</Label>
//                  <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
//                     <SelectTrigger className="h-10 bg-white">
//                        <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                        <SelectItem value="salary">Salary Payment (Pay Out)</SelectItem>
//                        <SelectItem value="advance">Advance / Loan (Pay Out)</SelectItem>
//                        <SelectItem value="reimbursement">Expense Reimbursement (Pay In/Add to Due)</SelectItem>
//                     </SelectContent>
//                  </Select>
//               </div>

//               <div>
//                  <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Amount</Label>
//                  <div className="relative">
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs</span>
//                     <Input 
//                        type="number" 
//                        className="pl-9 h-10 font-bold text-slate-900" 
//                        value={form.amount}
//                        onChange={e => setForm({...form, amount: e.target.value})}
//                        placeholder="0.00"
//                     />
//                  </div>
//               </div>

//               <div>
//                  <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Date</Label>
//                  <Input 
//                     type="date" 
//                     className="h-10"
//                     value={form.date}
//                     onChange={e => setForm({...form, date: e.target.value})}
//                  />
//               </div>

//               <div className="col-span-2">
//                  <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Method</Label>
//                  <Select value={form.method} onValueChange={v => setForm({...form, method: v})}>
//                     <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                        <SelectItem value="bank">Bank Transfer</SelectItem>
//                        <SelectItem value="cash">Cash</SelectItem>
//                        <SelectItem value="cheque">Cheque</SelectItem>
//                        <SelectItem value="other">Other</SelectItem>
//                     </SelectContent>
//                  </Select>
//               </div>

//               <div className="col-span-2">
//                  <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Description / Notes</Label>
//                  <Textarea 
//                     placeholder="e.g. Paid for February salary, or Advance for bike repair..."
//                     className="resize-none"
//                     value={form.notes}
//                     onChange={e => setForm({...form, notes: e.target.value})}
//                  />
//               </div>
//            </div>

//            {/* Warning for Overpayment */}
//            {form.type === 'salary' && Number(form.amount) > currentBalance && (
//               <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded border border-amber-200 text-xs">
//                  <AlertCircle className="w-4 h-4 shrink-0" />
//                  <span>Note: You are paying more than the calculated pending amount.</span>
//               </div>
//            )}
//         </div>

//         <DialogFooter className="gap-2 sm:gap-0">
//            <Button variant="outline" onClick={() => onClose(false)} disabled={isProcessing}>Cancel</Button>
//            <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={handleSubmit} disabled={isProcessing}>
//              {isProcessing ? 'Processing...' : 'Confirm Transaction'}
//            </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };






























import { useState, useEffect } from 'react';
import { Wallet, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/utils/formatters';

export const PaymentModal = ({ isOpen, onClose, employee, onConfirm, currentBalance }: any) => {
  const [form, setForm] = useState({
    type: 'salary', 
    amount: '',     
    bonus: 0,
    deduction: 0,
    tax: 0,
    date: new Date().toISOString().split('T')[0],
    method: 'bank',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset form when opening
  useEffect(() => {
    if (isOpen && employee) {
      setForm({
        type: 'salary',
        amount: currentBalance > 0 ? currentBalance.toString() : '',
        bonus: 0, deduction: 0, tax: 0,
        date: new Date().toISOString().split('T')[0],
        method: employee.bankName ? 'bank' : 'cash',
        notes: ''
      });
    }
  }, [isOpen, employee, currentBalance]);

  if (!employee) return null;

  const handleSubmit = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      setIsProcessing(true);
      // Determine net salary based on type
      let netSalary = Number(form.amount);
      // Only apply bonus/deduction math if it's a salary payment logic
      // For now, we assume 'amount' IS the net amount user wants to transfer
      
      await onConfirm({ 
        ...form, 
        netSalary: netSalary, // Important: pass the final amount here
        bonus: Number(form.bonus),
        deduction: Number(form.deduction),
        tax: Number(form.tax)
      });
      onClose();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to save transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !isProcessing && onClose(val)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
               <Wallet className="w-6 h-6 text-slate-700" /> Record Transaction
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onClose(false)} disabled={isProcessing}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-5 py-2">
           {/* Summary Section */}
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</p>
                    <p className="font-bold text-lg text-slate-900">{employee.name}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Due</p>
                    <p className="font-bold text-xl text-emerald-600">{formatCurrency(currentBalance)}</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                 <div>
                    <p className="text-slate-500 font-bold">Bank:</p> 
                    <p className="text-slate-700">{employee.bankName || 'N/A'}</p>
                 </div>
                 <div>
                    <p className="text-slate-500 font-bold">Account:</p> 
                    <p className="text-slate-700 font-mono">{employee.accountNumber || 'N/A'}</p>
                 </div>
              </div>
           </div>

           {/* Input Fields */}
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                 <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Transaction Type</Label>
                 <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                    <SelectTrigger className="h-10 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="salary">Salary Payment</SelectItem>
                       <SelectItem value="advance">Advance / Loan</SelectItem>
                       <SelectItem value="reimbursement">Reimbursement (Add to Due)</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              {/* Amount Field */}
              <div className="col-span-2">
                 <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Total Amount to Pay</Label>
                 <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs</span>
                    <Input 
                       type="number" 
                       className="pl-9 h-10 font-bold text-slate-900" 
                       value={form.amount}
                       onChange={e => setForm({...form, amount: e.target.value})}
                       placeholder="0.00"
                    />
                 </div>
              </div>

              {/* Optional Breakdowns */}
              {form.type === 'salary' && (
                <>
                  <div>
                     <Label className="text-xs text-gray-500 mb-1 block">Bonus (+)</Label>
                     <Input type="number" className="h-9" value={form.bonus} onChange={e => setForm({...form, bonus: Number(e.target.value)})} />
                  </div>
                  <div>
                     <Label className="text-xs text-gray-500 mb-1 block">Deduction (-)</Label>
                     <Input type="number" className="h-9" value={form.deduction} onChange={e => setForm({...form, deduction: Number(e.target.value)})} />
                  </div>
                </>
              )}

              <div className="col-span-2">
                 <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Notes</Label>
                 <Textarea 
                    placeholder="Description..."
                    className="resize-none h-20"
                    value={form.notes}
                    onChange={e => setForm({...form, notes: e.target.value})}
                 />
              </div>
           </div>
        </div>

        <DialogFooter>
           <Button variant="outline" onClick={() => onClose(false)} disabled={isProcessing}>Cancel</Button>
           <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={handleSubmit} disabled={isProcessing}>
             {isProcessing ? 'Processing...' : 'Confirm Transaction'}
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};