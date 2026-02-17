// /* eslint-disable react-hooks/set-state-in-effect */
// import React, { useEffect, useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import type { Expense, ExpenseCategory } from '@/types'; 

// interface ExpenseModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: Partial<Expense>) => void;
//   categories: ExpenseCategory[]; 
//   initialData?: Expense;
// }

// export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave, categories, initialData }) => {
//   const [formData, setFormData] = useState<{
//     description: string;
//     amount: string;
//     category: ExpenseCategory | ''; 
//     status: 'paid' | 'pending';
//     isRecurring: boolean;
//   }>({
//     description: '',
//     amount: '',
//     category: '', 
//     status: 'paid',
//     isRecurring: false
//   });

//   useEffect(() => {
//     if (isOpen) {
//         if (initialData) {
//             setFormData({
//                 description: initialData.description,
//                 amount: initialData.amount.toString(),
//                 category: initialData.category,
//                 status: initialData.status,
//                 // FIXED: Use nullish coalescing to ensure boolean type
//                 isRecurring: initialData.isRecurring ?? false 
//             });
//         } else {
//             setFormData({ 
//               description: '', 
//               amount: '', 
//               category: categories[0] || 'Other', 
//               status: 'paid', 
//               isRecurring: false 
//             });
//         }
//     }
//   }, [isOpen, initialData, categories]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.category) return;

//     onSave({
//       ...formData,
//       amount: Number(formData.amount),
//       category: formData.category as ExpenseCategory
//     });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>{initialData ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
//         </DialogHeader>
        
//         <form onSubmit={handleSubmit} className="space-y-4 py-2">
//             <div className="space-y-2">
//                 <Label>Description</Label>
//                 <Input 
//                   placeholder="e.g. Office Rent"
//                   value={formData.description} 
//                   onChange={e => setFormData({...formData, description: e.target.value})} 
//                   required 
//                 />
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label>Amount</Label>
//                     <div className="relative">
//                       <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rs</span>
//                       <Input 
//                         type="number" 
//                         className="pl-8"
//                         value={formData.amount} 
//                         onChange={e => setFormData({...formData, amount: e.target.value})} 
//                         required 
//                       />
//                     </div>
//                 </div>
                
//                 <div className="space-y-2">
//                     <Label>Category</Label>
//                     <Select 
//                       value={formData.category} 
//                       onValueChange={(v) => setFormData({...formData, category: v as ExpenseCategory})}
//                     >
//                         <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
//                         <SelectContent>
//                           {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
//                         </SelectContent>
//                     </Select>
//                 </div>
//             </div>
            
//             <div className="space-y-2">
//                 <Label>Status</Label>
//                 <Select 
//                   value={formData.status} 
//                   onValueChange={(v: 'paid' | 'pending') => setFormData({...formData, status: v})}
//                 >
//                     <SelectTrigger><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="paid">Paid</SelectItem>
//                         <SelectItem value="pending">Pending</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>
            
//             <div className="flex items-center space-x-2 pt-2">
//                 <Checkbox 
//                   id="recurring" 
//                   checked={formData.isRecurring} 
//                   onCheckedChange={(c) => setFormData({...formData, isRecurring: !!c})} 
//                 />
//                 <Label htmlFor="recurring" className="font-normal cursor-pointer text-gray-600">
//                     This is a monthly recurring expense
//                 </Label>
//             </div>
            
//             <DialogFooter className="pt-4">
//                 <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
//                 <Button type="submit">
//                   {initialData ? 'Save Changes' : 'Add Expense'}
//                 </Button>
//             </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };















/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Expense, ExpenseCategory } from '@/types'; 
import { Calendar, Clock } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Expense>) => void;
  categories: ExpenseCategory[]; 
  initialData?: Expense;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave, categories, initialData }) => {
  // Split date and time for better UI control
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '' as ExpenseCategory | '', 
    status: 'paid' as 'paid' | 'pending',
    isRecurring: false,
    date: '', 
    time: ''
  });

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            const dt = new Date(initialData.date);
            // Format to YYYY-MM-DD and HH:MM for inputs
            const dateStr = dt.toISOString().split('T')[0];
            const timeStr = dt.toTimeString().slice(0, 5);

            setFormData({
                description: initialData.description,
                amount: initialData.amount.toString(),
                category: initialData.category,
                status: initialData.status,
                isRecurring: initialData.isRecurring ?? false,
                date: dateStr,
                time: timeStr
            });
        } else {
            // Default to NOW
            const now = new Date();
            setFormData({ 
              description: '', 
              amount: '', 
              category: categories[0] || 'Other', 
              status: 'paid', 
              isRecurring: false,
              date: now.toISOString().split('T')[0],
              time: now.toTimeString().slice(0, 5)
            });
        }
    }
  }, [isOpen, initialData, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    // Combine Date & Time into ISO string
    const combinedDateTime = new Date(`${formData.date}T${formData.time}:00`);

    onSave({
      // If editing, preserve ID, otherwise new ID handled by service
      ...(initialData ? { id: initialData.id } : {}), 
      description: formData.description,
      amount: Number(formData.amount),
      category: formData.category as ExpenseCategory,
      status: formData.status,
      isRecurring: formData.isRecurring,
      date: combinedDateTime.toISOString()
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Transaction' : 'Record New Expense'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
            {/* Amount & Category Row */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">Amount</Label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">Rs</span>
                     <Input 
                       type="number" 
                       className="pl-9 h-10 font-mono text-lg font-semibold" 
                       value={formData.amount} 
                       onChange={e => setFormData({...formData, amount: e.target.value})} 
                       required 
                       placeholder="0.00"
                     />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v) => setFormData({...formData, category: v as ExpenseCategory})}
                  >
                     <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                     <SelectContent>
                       {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Description</Label>
                <Input 
                  placeholder="e.g. Monthly Office Rent"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  required 
                  className="h-10"
                />
            </div>
            
            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</Label>
                  <Input 
                     type="date" 
                     className="h-10"
                     value={formData.date}
                     onChange={e => setFormData({...formData, date: e.target.value})}
                     required
                  />
               </div>
               <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> Time</Label>
                  <Input 
                     type="time" 
                     className="h-10"
                     value={formData.time}
                     onChange={e => setFormData({...formData, time: e.target.value})}
                     required
                  />
               </div>
            </div>
            
            {/* Status & Recurring */}
            <div className="grid grid-cols-2 gap-4 items-start">
               <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">Payment Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v: 'paid' | 'pending') => setFormData({...formData, status: v})}
                  >
                     <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               
               <div className="flex items-center space-x-2 pt-8">
                  <Checkbox 
                    id="recurring" 
                    checked={formData.isRecurring} 
                    onCheckedChange={(c) => setFormData({...formData, isRecurring: !!c})} 
                  />
                  <Label htmlFor="recurring" className="font-normal cursor-pointer text-gray-600 text-sm">
                     Recurring monthly
                  </Label>
               </div>
            </div>
            
            <DialogFooter className="pt-2 gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={onClose} className="h-10">Cancel</Button>
                <Button type="submit" className="h-10 bg-slate-900 text-white hover:bg-slate-800">
                  {initialData ? 'Update Record' : 'Add Record'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};