import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { source: string; amount: number; date: string }) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [customSource, setCustomSource] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    onSave({
      amount: Number(amount),
      source: source === 'Other' ? customSource : source,
      date: new Date().toISOString()
    });
    
    // Reset
    setAmount('');
    setSource('');
    setCustomSource('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Funds to Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (PKR)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="e.g. 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Source of Funds</Label>
            <Select onValueChange={setSource} value={source}>
              <SelectTrigger>
                <SelectValue placeholder="Select Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Client Payment">Client Payment</SelectItem>
                <SelectItem value="Owner Injection">Owner Investment</SelectItem>
                <SelectItem value="Upwork/Fiverr">Freelance Platform</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {source === 'Other' && (
            <div className="grid gap-2 animate-in fade-in zoom-in-95">
              <Label htmlFor="custom">Specify Source</Label>
              <Input
                id="custom"
                placeholder="e.g. Loan, Gift..."
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value)}
                required
              />
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Add Funds
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};