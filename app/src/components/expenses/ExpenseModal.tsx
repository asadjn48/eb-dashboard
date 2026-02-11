/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Expense, ExpenseCategory } from '@/types'; 

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Expense>) => void;
  categories: ExpenseCategory[]; 
  initialData?: Expense;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave, categories, initialData }) => {
  const [formData, setFormData] = useState<{
    description: string;
    amount: string;
    category: ExpenseCategory | ''; 
    status: 'paid' | 'pending';
    isRecurring: boolean;
  }>({
    description: '',
    amount: '',
    category: '', 
    status: 'paid',
    isRecurring: false
  });

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData({
                description: initialData.description,
                amount: initialData.amount.toString(),
                category: initialData.category,
                status: initialData.status,
                // FIXED: Use nullish coalescing to ensure boolean type
                isRecurring: initialData.isRecurring ?? false 
            });
        } else {
            setFormData({ 
              description: '', 
              amount: '', 
              category: categories[0] || 'Other', 
              status: 'paid', 
              isRecurring: false 
            });
        }
    }
  }, [isOpen, initialData, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) return;

    onSave({
      ...formData,
      amount: Number(formData.amount),
      category: formData.category as ExpenseCategory
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  placeholder="e.g. Office Rent"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  required 
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rs</span>
                      <Input 
                        type="number" 
                        className="pl-8"
                        value={formData.amount} 
                        onChange={e => setFormData({...formData, amount: e.target.value})} 
                        required 
                      />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(v) => setFormData({...formData, category: v as ExpenseCategory})}
                    >
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(v: 'paid' | 'pending') => setFormData({...formData, status: v})}
                >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="recurring" 
                  checked={formData.isRecurring} 
                  onCheckedChange={(c) => setFormData({...formData, isRecurring: !!c})} 
                />
                <Label htmlFor="recurring" className="font-normal cursor-pointer text-gray-600">
                    This is a monthly recurring expense
                </Label>
            </div>
            
            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">
                  {initialData ? 'Save Changes' : 'Add Expense'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};