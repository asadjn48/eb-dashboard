/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Layers, X, FileSignature } from 'lucide-react';

export const DistributionModal = ({ isOpen, onClose, onSave, initialData, defaultType }: any) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) setFormData({ ...initialData, amount: initialData.amount.toString() });
      else setFormData({ type: defaultType || 'debt', name: '', purpose: '', contact: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'pending', investmentType: 'equity', refunded: false });
    }
  }, [isOpen, initialData, defaultType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, amount: Number(formData.amount) });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-[95vw] md:max-w-2xl p-0 border-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
        <DialogHeader className="px-6 py-4 bg-slate-900 border-b flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
             <Layers className="w-5 h-5 text-emerald-400" /> {initialData ? 'Edit Record' : 'Add New Record'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 rounded-full shrink-0"><X className="w-4 h-4" /></Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-5">
           
           <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Record Type</Label>
              <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                 <SelectTrigger className="h-10 bg-slate-50 font-bold text-slate-800"><SelectValue /></SelectTrigger>
                 <SelectContent>
                    <SelectItem value="debt">Debt / Loan</SelectItem>
                    <SelectItem value="security">Security Deposit</SelectItem>
                    <SelectItem value="investment">Investment / Payout</SelectItem>
                 </SelectContent>
              </Select>
           </div>

           <div className="space-y-1.5">
              <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{formData.type === 'security' ? 'Deposit Name' : 'Name'} *</Label>
              <Input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="h-10 bg-slate-50 font-bold" />
           </div>

           <div className="space-y-1.5">
              <Label className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Amount (PKR) *</Label>
              <Input required type="number" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: e.target.value})} className="h-10 bg-emerald-50/30 border-emerald-100 focus-visible:ring-emerald-500 font-mono font-bold text-lg" placeholder="0" />
           </div>

           {formData.type === 'debt' && (
             <>
               <div className="space-y-1.5">
                 <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Purpose *</Label>
                 <Input required value={formData.purpose || ''} onChange={e => setFormData({...formData, purpose: e.target.value})} className="h-10 bg-slate-50" />
               </div>
               <div className="space-y-1.5">
                 <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Contact No</Label>
                 <Input value={formData.contact || ''} onChange={e => setFormData({...formData, contact: e.target.value})} className="h-10 bg-slate-50 font-mono" />
               </div>
             </>
           )}

           {formData.type === 'investment' && (
             <div className="space-y-1.5">
                 <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Investment Type</Label>
                 <Select value={formData.investmentType || 'equity'} onValueChange={v => setFormData({...formData, investmentType: v})}>
                    <SelectTrigger className="h-10 bg-slate-50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="equity">Equity Share</SelectItem>
                       <SelectItem value="fixed">Fixed Return</SelectItem>
                    </SelectContent>
                 </Select>
             </div>
           )}

           <div className="space-y-1.5">
              <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Date *</Label>
              <Input required type="date" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="h-10 bg-slate-50 font-medium text-slate-700" />
           </div>

           <div className="space-y-1.5">
              <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status</Label>
              <Select value={formData.status || 'pending'} onValueChange={v => setFormData({...formData, status: v})}>
                 <SelectTrigger className="h-10 bg-slate-50 font-medium capitalize"><SelectValue /></SelectTrigger>
                 <SelectContent>
                    {formData.type === 'investment' ? (
                       <><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></>
                    ) : (
                       <><SelectItem value="pending">Pending</SelectItem><SelectItem value="completed">Completed</SelectItem></>
                    )}
                 </SelectContent>
              </Select>
           </div>

           <DialogFooter className="sm:col-span-2 pt-4 mt-2 border-t border-slate-100">
             <Button type="button" variant="outline" className="rounded-full font-bold px-6 h-10" onClick={onClose}>Cancel</Button>
             <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold px-8 h-10 shadow-md">
               {initialData ? 'Save Changes' : 'Add Record'}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Sub-Component: Notes Modal
export const NotesModal = ({ isOpen, onClose, onSave, record }: any) => {
  const [notes, setNotes] = useState('');
  useEffect(() => { if (isOpen && record) setNotes(record.notes || ''); }, [isOpen, record]);

  const handleSave = () => { onSave(record.id, notes); onClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
        <DialogHeader className="px-5 py-4 bg-blue-50 border-b border-blue-100 flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-blue-900"><FileSignature className="w-4 h-4" /> Record Notes</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full shrink-0 text-blue-500 hover:bg-blue-100"><X className="w-4 h-4" /></Button>
        </DialogHeader>
        <div className="p-5">
           <Textarea autoFocus placeholder="Write your notes here..." value={notes} onChange={e => setNotes(e.target.value)} className="min-h-[150px] resize-none bg-slate-50 border-slate-200 focus-visible:ring-blue-500" />
           <div className="flex justify-end gap-2 mt-4">
             <Button variant="outline" onClick={onClose} className="rounded-full h-9">Cancel</Button>
             <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-9 px-6 font-bold">Save Notes</Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};