/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, X, ChevronLeft, Plus, Trash2, Users } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { type Project } from '@/types';

const staticClients = ['TechCorp', 'MediCare'];
const staticCategories = ['Website', 'Mobile App', 'GIZ', 'NAVTTC'];

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Project>) => Promise<void>;
  initialData?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCustomClient, setIsCustomClient] = useState(false);
  const [, setIsCustomCategory] = useState(false);

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '', clientName: '', type: 'commercial', subType: '',
    budget: 0, startDate: new Date().toISOString().split('T')[0], endDate: '', description: '',
  });

  // --- Inline Investor State ---
  const [investors, setInvestors] = useState<{name: string, investment: number, equity: number, date: string}[]>([]);
  const [invName, setInvName] = useState('');
  const [invAmount, setInvAmount] = useState('');
  const [invEquity, setInvEquity] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        setIsCustomClient(!!initialData.clientName && !staticClients.includes(initialData.clientName));
        setIsCustomCategory(!!initialData.subType && !staticCategories.includes(initialData.subType));
        setInvestors((initialData as any).investors || []);
      } else {
        setFormData({
          name: '', clientName: '', type: 'commercial', subType: '',
          budget: 0, startDate: new Date().toISOString().split('T')[0], endDate: '', description: '',
        });
        setIsCustomClient(false); setIsCustomCategory(false); setInvestors([]);
      }
      setInvName(''); setInvAmount(''); setInvEquity('');
    }
  }, [isOpen, initialData]);

  const handleAddInvestor = () => {
    if (!invName || !invAmount) return;
    setInvestors([...investors, { 
      name: invName, 
      investment: Number(invAmount), 
      equity: Number(invEquity || 0), 
      date: new Date().toISOString() 
    }]);
    setInvName(''); setInvAmount(''); setInvEquity('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.budget) {
      alert("Project Name and Budget are required.");
      return;
    }

    try {
      setIsProcessing(true);
      await onSave({
        ...formData,
        budget: Number(formData.budget),
        subType: formData.subType || 'General',
        clientName: formData.clientName || 'Internal',
        investors: investors // Attach investors directly to project
      } as any);
      onClose();
    } catch (error) {
      alert("Failed to save project.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isProcessing && onClose()}>
      <DialogContent className="w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl rounded-2xl no-scrollbar">
        <DialogHeader className="px-6 py-4 bg-slate-900 border-b flex flex-row items-center justify-between sticky top-0 z-10">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
             <Briefcase className="w-5 h-5 text-[#5d88c6]" /> 
             {initialData ? 'Edit Project Details' : 'Create New Project'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isProcessing} className="text-white hover:bg-white/20 h-8 w-8 rounded-full shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 bg-white space-y-6">
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Basic Fields */}
              <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
                 <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Project Name *</Label>
                 <Input required placeholder="e.g. AI Dashboard" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-10 bg-slate-50 border-slate-200 focus-visible:ring-[#5d88c6] font-medium text-base" />
              </div>

              <div className="space-y-1.5">
                 <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Project Type</Label>
                 <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200 font-medium focus:ring-[#5d88c6]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="commercial">Commercial (Client Paid)</SelectItem>
                       <SelectItem value="funded">Funded (NGO / Gov Grant)</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="space-y-1.5">
                 <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Client / Organization</Label>
                 {isCustomClient ? (
                    <div className="flex gap-2 animate-in fade-in">
                      <Input autoFocus placeholder="Enter Client Name" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="h-10 bg-[#5d88c6]/5 border-[#5d88c6]/30 focus-visible:ring-[#5d88c6] font-medium" />
                      <Button type="button" variant="ghost" size="icon" onClick={() => setIsCustomClient(false)} className="shrink-0 h-10 w-10 text-slate-400 hover:text-slate-700"><ChevronLeft className="w-4 h-4" /></Button>
                    </div>
                 ) : (
                    <Select value={formData.clientName} onValueChange={(v) => v === 'other' ? setIsCustomClient(true) : setFormData({...formData, clientName: v})}>
                       <SelectTrigger className="h-10 bg-slate-50 border-slate-200 focus:ring-[#5d88c6] font-medium"><SelectValue placeholder="Select Client" /></SelectTrigger>
                       <SelectContent>
                          {staticClients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          <SelectItem value="other" className="text-[#5d88c6] font-bold">+ Add Custom Client</SelectItem>
                       </SelectContent>
                    </Select>
                 )}
              </div>

              <div className="space-y-1.5">
                 <Label className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Total Budget (PKR) *</Label>
                 <Input required type="number" placeholder="0.00" value={formData.budget || ''} onChange={e => setFormData({...formData, budget: e.target.value})} className="h-10 bg-emerald-50/30 border-emerald-100 focus-visible:ring-emerald-500 font-mono font-bold text-lg" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                 <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Start Date *</Label>
                    <Input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="h-10 bg-slate-50 border-slate-200 text-xs" />
                 </div>
                 <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Deadline</Label>
                    <Input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="h-10 bg-slate-50 border-slate-200 text-xs" />
                 </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                 <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Project Notes & Scope</Label>
                 <Textarea placeholder="Enter details..." className="resize-none h-16 bg-slate-50 border-slate-200 focus-visible:ring-[#5d88c6]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              {/* --- INLINE INVESTOR SECTION --- */}
              <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                 <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                   <Users className="w-3.5 h-3.5" /> Shareholders & Investments (Optional)
                 </Label>
                 
                 {investors.length > 0 && (
                   <div className="mb-3 flex flex-col gap-2">
                     {investors.map((inv, idx) => (
                       <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2.5 rounded-lg animate-in fade-in">
                         <div className="flex flex-col">
                           <span className="text-sm font-bold text-slate-800">{inv.name}</span>
                         </div>
                         <div className="flex items-center gap-4 text-sm">
                           <span className="font-mono font-semibold text-emerald-600">{formatCurrency(inv.investment)}</span>
                           <span className="font-bold text-purple-600 w-10 text-right">{inv.equity}%</span>
                           <button type="button" onClick={() => setInvestors(investors.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-4 h-4"/></button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}

                 <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                   <Input placeholder="Investor Name" value={invName} onChange={e=>setInvName(e.target.value)} className="h-9 text-sm border-slate-200 flex-1" />
                   <Input type="number" placeholder="Investment (PKR)" value={invAmount} onChange={e=>setInvAmount(e.target.value)} className="h-9 text-sm font-mono border-slate-200 w-full sm:w-1/3" />
                   <div className="flex gap-2 w-full sm:w-auto">
                      <Input type="number" placeholder="Equity %" value={invEquity} onChange={e=>setInvEquity(e.target.value)} className="h-9 text-sm font-mono border-slate-200 w-24" />
                      <Button type="button" onClick={handleAddInvestor} className="h-9 px-3 bg-slate-900 text-white hover:bg-slate-800"><Plus className="w-4 h-4 mr-1"/> Add</Button>
                   </div>
                 </div>
              </div>

           </div>

           <DialogFooter className="pt-4 border-t border-slate-100">
             <Button type="button" variant="outline" className="rounded-full font-bold px-6 h-10" onClick={onClose} disabled={isProcessing}>Cancel</Button>
             <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full font-bold px-8 h-10 shadow-md transition-transform active:scale-95" disabled={isProcessing}>
               {isProcessing ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Project')}
             </Button>
           </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
};