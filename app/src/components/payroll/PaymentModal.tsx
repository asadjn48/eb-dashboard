// /* eslint-disable prefer-const */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { useState, useEffect } from 'react';
// import { Wallet, X } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { formatCurrency } from '@/utils/formatters';

// export const PaymentModal = ({ isOpen, onClose, employee, onConfirm, currentBalance }: any) => {
//   const [form, setForm] = useState({
//     type: 'salary', 
//     amount: '',     
//     bonus: 0,
//     deduction: 0,
//     tax: 0,
//     date: new Date().toISOString().split('T')[0],
//     method: 'bank',
//     notes: ''
//   });
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Reset form when opening
//   useEffect(() => {
//     if (isOpen && employee) {
//       setForm({
//         type: 'salary',
//         amount: currentBalance > 0 ? currentBalance.toString() : '',
//         bonus: 0, deduction: 0, tax: 0,
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
//       // Determine net salary based on type
//       let netSalary = Number(form.amount);
//       // Only apply bonus/deduction math if it's a salary payment logic
//       // For now, we assume 'amount' IS the net amount user wants to transfer
      
//       await onConfirm({ 
//         ...form, 
//         netSalary: netSalary, // Important: pass the final amount here
//         bonus: Number(form.bonus),
//         deduction: Number(form.deduction),
//         tax: Number(form.tax)
//       });
//       onClose();
//     } catch (error) {
//       console.error("Payment Error:", error);
//       alert("Failed to save transaction.");
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
//            {/* Summary Section */}
//            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
//               <div className="flex justify-between items-start border-b border-slate-200 pb-3">
//                  <div>
//                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</p>
//                     <p className="font-bold text-lg text-slate-900">{employee.name}</p>
//                  </div>
//                  <div className="text-right">
//                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Due</p>
//                     <p className="font-bold text-xl text-emerald-600">{formatCurrency(currentBalance)}</p>
//                  </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4 text-xs">
//                  <div>
//                     <p className="text-slate-500 font-bold">Bank:</p> 
//                     <p className="text-slate-700">{employee.bankName || 'N/A'}</p>
//                  </div>
//                  <div>
//                     <p className="text-slate-500 font-bold">Account:</p> 
//                     <p className="text-slate-700 font-mono">{employee.accountNumber || 'N/A'}</p>
//                  </div>
//               </div>
//            </div>

//            {/* Input Fields */}
//            <div className="grid grid-cols-2 gap-4">
//               <div className="col-span-2">
//                  <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Transaction Type</Label>
//                  <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
//                     <SelectTrigger className="h-10 bg-white"><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                        <SelectItem value="salary">Salary Payment</SelectItem>
//                        <SelectItem value="advance">Advance / Loan</SelectItem>
//                        <SelectItem value="reimbursement">Reimbursement (Add to Due)</SelectItem>
//                     </SelectContent>
//                  </Select>
//               </div>

//               {/* Amount Field */}
//               <div className="col-span-2">
//                  <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Total Amount to Pay</Label>
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

//               {/* Optional Breakdowns */}
//               {form.type === 'salary' && (
//                 <>
//                   <div>
//                      <Label className="text-xs text-gray-500 mb-1 block">Bonus (+)</Label>
//                      <Input type="number" className="h-9" value={form.bonus} onChange={e => setForm({...form, bonus: Number(e.target.value)})} />
//                   </div>
//                   <div>
//                      <Label className="text-xs text-gray-500 mb-1 block">Deduction (-)</Label>
//                      <Input type="number" className="h-9" value={form.deduction} onChange={e => setForm({...form, deduction: Number(e.target.value)})} />
//                   </div>
//                 </>
//               )}

//               <div className="col-span-2">
//                  <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Notes</Label>
//                  <Textarea 
//                     placeholder="Description..."
//                     className="resize-none h-20"
//                     value={form.notes}
//                     onChange={e => setForm({...form, notes: e.target.value})}
//                  />
//               </div>
//            </div>
//         </div>

//         <DialogFooter>
//            <Button variant="outline" onClick={() => onClose(false)} disabled={isProcessing}>Cancel</Button>
//            <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={handleSubmit} disabled={isProcessing}>
//              {isProcessing ? 'Processing...' : 'Confirm Transaction'}
//            </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };


























/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { Wallet, X, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

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

  // Auto calculate net on typing
  const netAmount = Math.max(0, (Number(form.amount) || 0) + (Number(form.bonus) || 0) - ((Number(form.deduction) || 0) + (Number(form.tax) || 0)));

  const handleSubmit = async () => {
    if (netAmount <= 0) {
      alert("Please ensure the final net amount is greater than zero.");
      return;
    }

    try {
      setIsProcessing(true);
      await onConfirm({ 
        ...form, 
        netSalary: netAmount, 
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
      {/* FIXED: Changed sm:max-w-md to md:max-w-2xl (wider). 
        Added max-h-[90vh] to ensure it never exceeds the screen height 
      */}
      <DialogContent className="w-[95vw] md:max-w-2xl max-h-[99vh] overflow-y-auto p-0 border-0 shadow-2xl rounded-2xl ">
        
        {/* Header */}
        <DialogHeader className="px-6 py-4 bg-slate-900 border-b flex flex-row items-center justify-between sticky top-0 z-10">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
             <Wallet className="w-5 h-5 text-emerald-400" /> Record Transaction
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onClose(false)} disabled={isProcessing} className="text-white hover:bg-white/20 h-8 w-8 rounded-full shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6 bg-white">
           
           {/* Employee & Balance Banner */}
           <div className={cn("p-3 rounded-xl border flex justify-between items-center shadow-sm", currentBalance > 0 ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100")}>
              <div>
                 <p className="text-[8px] font-extrabold uppercase tracking-wider text-slate-500">To Employee</p>
                 <p className="font-bold text-slate-900 text-lg">{employee.name}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Current Arrears</p>
                 <p className={cn("font-extrabold text-xl leading-none mt-0.5", currentBalance > 0 ? "text-rose-600" : "text-emerald-600")}>
                    {currentBalance <= 0 ? 'Rs 0' : formatCurrency(currentBalance)}
                 </p>
              </div>
           </div>

          
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Type Selection - 1 Column */}
              <div className="space-y-1">
                 <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Transaction Type</Label>
                 <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200 font-medium focus:ring-[#5d88c6]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="salary">Salary Payment</SelectItem>
                       <SelectItem value="advance">Advance / Loan</SelectItem>
                       <SelectItem value="reimbursement">Reimbursement (Add to Due)</SelectItem>
                    </SelectContent>
                 </Select>
                 {form.type === 'reimbursement' && <p className="text-[10px] text-blue-600 flex items-center mt-1.5"><AlertCircle className="w-3 h-3 mr-1"/> Adds to the arrears owed to the employee.</p>}
              </div>

              {/* Amount - 1 Column */}
              <div className="space-y-1">
                 <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Base Amount (PKR)</Label>
                 <Input type="number" className="h-11 font-mono font-bold text-lg bg-slate-50 border-slate-200 focus-visible:ring-[#5d88c6]" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" />
              </div>

              {/* Bonus & Deduction side-by-side if it's a salary payment */}
              {form.type === 'salary' && (
                <>
                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Bonus (+)</Label>
                     <Input type="number" className="h-10 font-mono font-semibold bg-emerald-50/30 border-emerald-100 focus-visible:ring-emerald-400" value={form.bonus} onChange={e => setForm({...form, bonus: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-1.5">
                     <Label className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Deductions (-)</Label>
                     <Input type="number" className="h-10 font-mono font-semibold bg-rose-50/30 border-rose-100 focus-visible:ring-rose-400" value={form.deduction} onChange={e => setForm({...form, deduction: Number(e.target.value)})} />
                  </div>
                </>
              )}

              {/* Notes - Spans 2 Columns to stay wide and short */}
              <div className="sm:col-span-2 space-y-1.5">
                 <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Notes & Description</Label>
                 <Textarea placeholder="E.g., Final settlement for this month..." className="resize-none h-16 bg-slate-50 border-slate-200 focus-visible:ring-[#5d88c6]" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
           </div>
           
           {/* Final Calculation Banner */}
           <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl text-white shadow-inner">
               <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Final Processing Amount</span>
               <span className="font-mono font-extrabold text-2xl tracking-tight">{formatCurrency(netAmount)}</span>
           </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-slate-50 border-t sticky bottom-0">
           <div className="flex w-full justify-end gap-3">
             <Button variant="outline" className="rounded-full font-bold px-6 h-10 bg-white" onClick={() => onClose(false)} disabled={isProcessing}>Cancel</Button>
             <Button className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-full font-bold px-8 h-10 shadow-md transition-transform active:scale-95" onClick={handleSubmit} disabled={isProcessing}>
               {isProcessing ? 'Processing...' : 'Confirm Transaction'}
             </Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};