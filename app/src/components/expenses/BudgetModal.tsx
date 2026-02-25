// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// interface BudgetModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: { source: string; amount: number; date: string }) => void;
// }

// export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, onSave }) => {
//   const [amount, setAmount] = useState('');
//   const [source, setSource] = useState('');
//   const [customSource, setCustomSource] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!amount) return;

//     onSave({
//       amount: Number(amount),
//       source: source === 'Other' ? customSource : source,
//       date: new Date().toISOString()
//     });
    
//     // Reset
//     setAmount('');
//     setSource('');
//     setCustomSource('');
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add Funds to Budget</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
//           <div className="grid gap-2">
//             <Label htmlFor="amount">Amount (PKR)</Label>
//             <Input
//               id="amount"
//               type="number"
//               placeholder="e.g. 50000"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//             />
//           </div>

//           <div className="grid gap-2">
//             <Label>Source of Funds</Label>
//             <Select onValueChange={setSource} value={source}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Source" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Client Payment">Client Payment</SelectItem>
//                 <SelectItem value="Owner Injection">Owner Investment</SelectItem>
//                 <SelectItem value="Upwork/Fiverr">Freelance Platform</SelectItem>
//                 <SelectItem value="Other">Other</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {source === 'Other' && (
//             <div className="grid gap-2 animate-in fade-in zoom-in-95">
//               <Label htmlFor="custom">Specify Source</Label>
//               <Input
//                 id="custom"
//                 placeholder="e.g. Loan, Gift..."
//                 value={customSource}
//                 onChange={(e) => setCustomSource(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           <DialogFooter className="mt-4">
//             <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
//             <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
//               Add Funds
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };
















import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Landmark, Calendar, FileText, X } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { source: string; amount: number; date: string; notes: string }) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setSource('');
      setCustomSource('');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]); // Default to today
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !source || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    onSave({
      amount: Number(amount),
      source: source === 'Other' ? customSource : source,
      date: date,
      notes: notes
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 border-0 shadow-2xl rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 py-5 bg-slate-900 flex flex-row justify-between items-center">
          <DialogTitle className="flex items-center gap-2 text-white text-lg">
             <Landmark className="w-5 h-5 text-emerald-400" /> Log Income / Funds
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 rounded-full shrink-0">
             <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
             
             {/* Amount */}
             <div className="space-y-1.5">
               <Label htmlFor="amount" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (PKR) *</Label>
               <Input id="amount" type="number" placeholder="e.g. 50000" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-10 font-mono font-bold text-lg bg-slate-50 focus-visible:ring-emerald-500" required />
             </div>

             {/* Date */}
             <div className="space-y-1.5">
               <Label htmlFor="date" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Date Received *</Label>
               <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10 bg-slate-50 focus-visible:ring-emerald-500" required />
             </div>

             {/* Source */}
             <div className="space-y-1.5">
               <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source of Funds *</Label>
               <Select onValueChange={setSource} value={source}>
                 <SelectTrigger className="h-10 bg-slate-50 focus:ring-emerald-500">
                   <SelectValue placeholder="Select Source" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="Client Payment">Client Payment</SelectItem>
                   <SelectItem value="Owner Injection">Owner Investment</SelectItem>
                   <SelectItem value="Upwork/Fiverr">Freelance Platform</SelectItem>
                   <SelectItem value="Other">Other (Custom)</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             {/* Custom Source (Only shows if 'Other' is selected) */}
             {source === 'Other' ? (
               <div className="space-y-1.5 animate-in fade-in zoom-in-95">
                 <Label htmlFor="custom" className="text-xs font-bold text-blue-600 uppercase tracking-wider">Specify Source *</Label>
                 <Input id="custom" placeholder="e.g. Bank Loan, Angel Investor..." value={customSource} onChange={(e) => setCustomSource(e.target.value)} className="h-10 border-blue-200 focus-visible:ring-blue-500" required />
               </div>
             ) : <div className="hidden sm:block" /> /* Empty div to keep grid aligned */}

             {/* Notes / Description */}
             <div className="sm:col-span-2 space-y-1.5">
               <Label htmlFor="notes" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Description / Notes</Label>
               <Textarea id="notes" placeholder="Optional details about this income..." value={notes} onChange={(e) => setNotes(e.target.value)} className="resize-none h-20 bg-slate-50 focus-visible:ring-emerald-500" />
             </div>

          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full h-10 px-6 font-bold">Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-10 px-8 font-bold shadow-md">
              Log Income
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};