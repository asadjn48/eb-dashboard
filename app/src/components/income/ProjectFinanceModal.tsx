/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CircleDollarSign, X, ArrowRightLeft, Users, Building2, Briefcase, Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onAddTransaction: (projectId: string, data: any) => void;
  onAddInvestor: (projectId: string, data: any) => void;
}

export const ProjectFinanceModal: React.FC<ProjectFinanceModalProps> = ({ 
  isOpen, onClose, project, onAddTransaction, onAddInvestor 
}) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'investors'>('transactions');

  // Transaction Form State
  const [txType, setTxType] = useState('received');
  const [txAmount, setTxAmount] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txDesc, setTxDesc] = useState('');

  // Investor Form State
  const [invName, setInvName] = useState('');
  const [invAmount, setInvAmount] = useState('');
  const [invEquity, setInvEquity] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('transactions');
      setTxAmount(''); setTxDesc('');
      setInvName(''); setInvAmount(''); setInvEquity('');
    }
  }, [isOpen]);

  if (!project) return null;

  // Safe fallback if your Project type doesn't have an investors array yet
  const investors = (project as any).investors || [];

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount) return;
    onAddTransaction(project.id, { type: txType, amount: Number(txAmount), date: txDate, description: txDesc });
    setTxAmount(''); setTxDesc('');
    alert("Transaction added to ledger!");
  };

  const handleSaveInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName || !invAmount) return;
    onAddInvestor(project.id, { name: invName, investment: Number(invAmount), equity: Number(invEquity || 0), date: new Date().toISOString() });
    setInvName(''); setInvAmount(''); setInvEquity('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-[95vw] md:max-w-2xl max-h-[90vh] flex flex-col p-0 border-0 shadow-2xl rounded-2xl overflow-hidden bg-slate-50">
        
        <DialogHeader className="px-6 py-4 bg-slate-900 border-b shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
             <CircleDollarSign className="w-5 h-5 text-emerald-400" /> Project Finance & Investments
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 rounded-full shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Project Context Banner */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#5d88c6]/10 text-[#5d88c6] rounded-xl"><Briefcase className="w-4 h-4" /></div>
              <div>
                 <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Managing Finances For</p>
                 <p className="font-bold text-slate-900 text-base leading-tight mt-0.5">{project.name}</p>
              </div>
           </div>
           <div className="text-right hidden sm:block">
               <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600/70">Project Budget</p>
               <p className="font-bold text-emerald-700 text-base leading-tight mt-0.5">{formatCurrency(project.budget || 0)}</p>
           </div>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex px-6 pt-4 bg-slate-50 gap-2 shrink-0">
           <button 
             onClick={() => setActiveTab('transactions')}
             className={cn("flex-1 py-2.5 text-xs font-bold rounded-t-xl transition-all border border-b-0 flex items-center justify-center gap-2", activeTab === 'transactions' ? "bg-white text-slate-900 border-slate-200 shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.02)] z-10" : "bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200/50")}
           >
             <ArrowRightLeft className="w-3.5 h-3.5" /> Ledger Transactions
           </button>
           <button 
             onClick={() => setActiveTab('investors')}
             className={cn("flex-1 py-2.5 text-xs font-bold rounded-t-xl transition-all border border-b-0 flex items-center justify-center gap-2", activeTab === 'investors' ? "bg-white text-slate-900 border-slate-200 shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.02)] z-10" : "bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200/50")}
           >
             <Users className="w-3.5 h-3.5" /> Shareholders / Investors
           </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto bg-white border-t border-slate-200 p-6 relative">
           
           {/* TAB 1: TRANSACTIONS */}
           {activeTab === 'transactions' && (
             <form onSubmit={handleSaveTransaction} className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-2">
                   <p className="text-xs text-blue-800 font-medium">Use this form to log payments received from the client (Credits) or specific project expenses (Debits) to keep the project ledger accurate.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                     <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction Type</Label>
                     <Select value={txType} onValueChange={setTxType}>
                        <SelectTrigger className={cn("h-10 font-bold", txType === 'received' ? "bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500" : "bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500")}>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="received" className="text-emerald-700 font-bold">Payment Received (Credit +)</SelectItem>
                           <SelectItem value="expense" className="text-rose-700 font-bold">Project Expense (Debit -)</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  
                  <div className="space-y-1.5">
                     <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (PKR) *</Label>
                     <Input required type="number" value={txAmount} onChange={e => setTxAmount(e.target.value)} className="h-10 bg-slate-50 font-mono font-bold" placeholder="0.00" />
                  </div>
                  <div className="space-y-1.5">
                     <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date *</Label>
                     <Input required type="date" value={txDate} onChange={e => setTxDate(e.target.value)} className="h-10 bg-slate-50 text-sm font-medium text-slate-700" />
                  </div>
                  
                  <div className="space-y-1.5 sm:col-span-2">
                     <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description / Notes</Label>
                     <Input value={txDesc} onChange={e => setTxDesc(e.target.value)} className="h-10 bg-slate-50 text-sm" placeholder="e.g. Milestone 1 Payment..." />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                   <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full font-bold px-8 h-10 shadow-md">
                     Log Transaction
                   </Button>
                </div>
             </form>
           )}

           {/* TAB 2: INVESTORS */}
           {activeTab === 'investors' && (
             <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Investor List */}
                <div className="space-y-3">
                   <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5"/> Current Shareholders</Label>
                   {investors.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
                         <p className="text-xs text-slate-500 font-medium">No external investors added to this project yet.</p>
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 gap-3">
                         {investors.map((inv: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50">
                               <div>
                                  <p className="font-bold text-slate-800 text-sm">{inv.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Joined: {new Date(inv.date).toLocaleDateString()}</p>
                               </div>
                               <div className="text-right flex items-center gap-4">
                                  <div>
                                     <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600/70">Investment</p>
                                     <p className="font-mono font-bold text-emerald-700">{formatCurrency(inv.investment)}</p>
                                  </div>
                                  <div className="w-px h-8 bg-slate-200" />
                                  <div className="w-12 text-center">
                                     <p className="text-[9px] font-bold uppercase tracking-wider text-purple-600/70">Equity</p>
                                     <p className="font-bold text-purple-700">{inv.equity}%</p>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>

                <div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div><div className="relative flex justify-center"><span className="bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Add New Investor</span></div></div>

                {/* Add Investor Form */}
                <form onSubmit={handleSaveInvestor} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                   <div className="space-y-1.5 sm:col-span-5">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Shareholder Name *</Label>
                      <Input required value={invName} onChange={e => setInvName(e.target.value)} className="h-9 bg-white text-sm" placeholder="e.g. Asad LLC" />
                   </div>
                   <div className="space-y-1.5 sm:col-span-4">
                      <Label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Investment Amount *</Label>
                      <Input required type="number" value={invAmount} onChange={e => setInvAmount(e.target.value)} className="h-9 bg-white font-mono text-sm" placeholder="0" />
                   </div>
                   <div className="space-y-1.5 sm:col-span-3">
                      <Label className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Equity (%)</Label>
                      <div className="flex gap-2">
                        <Input type="number" max="100" value={invEquity} onChange={e => setInvEquity(e.target.value)} className="h-9 bg-white font-mono text-sm" placeholder="0" />
                        <Button type="submit" size="icon" className="shrink-0 h-9 w-9 bg-slate-900 hover:bg-slate-800"><Plus className="w-4 h-4"/></Button>
                      </div>
                   </div>
                </form>
             </div>
           )}
        </div>

      </DialogContent>
    </Dialog>
  );
};