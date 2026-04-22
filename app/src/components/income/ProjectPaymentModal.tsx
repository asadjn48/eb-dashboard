/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CircleDollarSign, X } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (projectId: string, amount: number, notes: string) => void;
}

export const ProjectPaymentModal: React.FC<ProjectPaymentModalProps> = ({ isOpen, onClose, project, onSave }) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) { setAmount(''); setNotes(''); }
  }, [isOpen]);

  if (!project) return null;

  // const budget = project.budget || 0;
  // const received = (project as any).receivedAmount || 0;
  // const pending = Math.max(0, budget - received);





const budget = project.budget || 0;
  const received = (project as any).receivedAmount || 0;
  const pending = budget - received; 




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    onSave(project.id, Number(amount), notes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-0 shadow-2xl rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-emerald-600 border-b flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
             <CircleDollarSign className="w-5 h-5 text-white/80" /> Receive Payment
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 rounded-full shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 bg-white space-y-5">
           <div className={cn("p-4 rounded-xl border flex justify-between items-center shadow-sm bg-slate-50 border-slate-100")}>
              <div>
                 <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Project</p>
                 <p className="font-bold text-slate-900 text-base">{project.name}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Pending Due</p>
                 <p className={cn("font-extrabold text-xl leading-none mt-0.5", pending > 0 ? "text-rose-600" : "text-purple-600")}>
     {pending < 0 ? `+${formatCurrency(Math.abs(pending))} (Over)` : formatCurrency(pending)}
  </p>
              </div>
           </div>

           <div className="space-y-1.5">
               <Label className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Amount Received (PKR) *</Label>
               <Input required type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="h-11 bg-emerald-50/30 border-emerald-100 focus-visible:ring-emerald-500 font-mono font-bold text-lg" />
           </div>

           <div className="space-y-1.5">
               <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Transaction Notes</Label>
               <Textarea placeholder="e.g. Milestone 2 cleared via Bank Transfer..." className="resize-none h-16 bg-slate-50 border-slate-200" value={notes} onChange={e => setNotes(e.target.value)} />
           </div>

           <DialogFooter className="pt-2">
             <Button type="button" variant="outline" className="rounded-full font-bold px-6 h-10" onClick={onClose}>Cancel</Button>
             <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-full font-bold px-8 h-10 shadow-md">
               Log Payment
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};