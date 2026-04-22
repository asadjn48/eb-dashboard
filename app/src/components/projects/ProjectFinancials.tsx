/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Plus, Trash2, AlertCircle, 
  Wallet, Calendar, CreditCard, Filter, ArrowDownCircle, ArrowUpCircle, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { projectAPI } from '@/services/projectService';
import { formatCurrency } from '@/utils/formatters';
import type { Project, ProjectTransaction } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectFinancialsProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const ProjectFinancials: React.FC<ProjectFinancialsProps> = ({ project, isOpen, onClose, onUpdate }) => {
  const [transactions, setTransactions] = useState<ProjectTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [txType, setTxType] = useState<'payment' | 'expense'>('payment');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('bank');
  const [notes, setNotes] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');

  useEffect(() => {
    if (isOpen && project.id) {
      loadTransactions();
      setAmount(''); setNotes('');
    }
  }, [isOpen, project.id]);

  const loadTransactions = async () => {
    setLoading(true);
    const data = await projectAPI.getTransactions(project.id);
    // Ensure oldest first for ledger running balance math
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setTransactions(data);
    setLoading(false);
  };

  // --- Dynamic Stats & Ledger Calculations ---
  const { ledger, totalReceived, totalExpenses, progress } = useMemo(() => {
    let received = 0;
    let expenses = 0;
    let runningBalance = 0; // Starts at 0 (We don't count budget as actual cash in bank)

    const processedLedger = transactions.map(t => {
      let debit = 0;
      let credit = 0;

      if (t.type === 'payment') {
        received += Number(t.amount);
        credit = Number(t.amount); // Money IN
        runningBalance += credit;
      } else {
        expenses += Number(t.amount);
        debit = Number(t.amount); // Money OUT
        runningBalance -= debit;
      }

      return { ...t, debit, credit, runningBalance };
    });

    // Sort newest first for the display table
    processedLedger.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Filter by method if needed
    const finalLedger = filterMethod === 'all' ? processedLedger : processedLedger.filter(t => t.method === filterMethod);

    const prog = project.budget > 0 ? (received / project.budget) * 100 : 0;

    return { ledger: finalLedger, totalReceived: received, totalExpenses: expenses, progress: prog };
  }, [transactions, filterMethod, project.budget]);

  const remaining = project.budget - totalReceived;
  const netProfit = project.budget - totalExpenses;

  const handleAddTransaction = async () => {
    if (!amount || Number(amount) <= 0) return;
    try {
      const newTrans: Omit<ProjectTransaction, 'id'> = {
        projectId: project.id,
        amount: Number(amount),
        date: date,
        type: txType as any,
        method: method as any,
        notes: notes || (txType === 'payment' ? 'Payment Received' : 'Project Expense')
      };

      await projectAPI.addTransaction(newTrans as ProjectTransaction);
      await loadTransactions(); 
      if (onUpdate) onUpdate();
      
      setAmount(''); setNotes('');
    } catch (e) {
      console.error("Failed to add transaction", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this transaction? This will affect the project's financial history.")) {
      await projectAPI.deleteTransaction(id, project.id);
      await loadTransactions();
      if (onUpdate) onUpdate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-6xl w-[95vw] h-[90vh] flex flex-col bg-slate-50 p-0 gap-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        
        {/* --- HEADER --- */}
        <DialogHeader className="px-6 py-4 bg-slate-900 border-b flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#5d88c6]/20 rounded-lg shadow-inner">
                <Wallet className="w-5 h-5 text-[#5d88c6]" />
             </div>
             <div>
                <DialogTitle className="text-lg font-bold text-white leading-none">Financial Ledger</DialogTitle>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                   <span className="text-slate-300">{project.name}</span>
                   {project.clientName && (
                     <>
                       <span>|</span>
                       <span>{project.clientName}</span>
                     </>
                   )}
                </div>
             </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/20 h-8 w-8 rounded-full shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-6 space-y-6">
            
            {/* --- 1. KPI STATS CARDS --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border border-slate-200/60 shadow-sm bg-white p-4 rounded-xl">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar className="w-3 h-3"/> Total Budget</p>
                <span className="text-xl font-extrabold text-slate-900">{formatCurrency(project.budget)}</span>
              </Card>
              
              <Card className="border border-emerald-100 shadow-sm bg-emerald-50/50 p-4 rounded-xl">
                 <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] text-emerald-600/70 font-extrabold uppercase tracking-widest flex items-center gap-1.5"><ArrowUpCircle className="w-3 h-3"/> Received</p>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{progress.toFixed(0)}%</span>
                 </div>
                 <span className="text-xl font-extrabold text-emerald-700">{formatCurrency(totalReceived)}</span>
                 <div className="mt-2 w-full bg-emerald-200/50 rounded-full h-1 overflow-hidden">
                   <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%` }} />
                 </div>
              </Card>

              <Card className="border border-amber-100 shadow-sm bg-amber-50/50 p-4 rounded-xl">
                <p className="text-[10px] text-amber-600/70 font-extrabold uppercase tracking-widest mb-1 flex items-center gap-1.5"><AlertCircle className="w-3 h-3"/> Pending Due</p>
                <span className="text-xl font-extrabold text-amber-700">
                  {remaining < 0 ? `+${formatCurrency(Math.abs(remaining))} (Over)` : formatCurrency(remaining)}
                </span>
              </Card>

              <Card className="border border-rose-100 shadow-sm bg-rose-50/50 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] text-rose-600/70 font-extrabold uppercase tracking-widest flex items-center gap-1.5"><ArrowDownCircle className="w-3 h-3"/> Expenses</p>
                  <p className="text-[9px] text-rose-700/60 font-bold uppercase">Est. Profit: <span className={cn(netProfit >= 0 ? "text-emerald-600" : "text-rose-600")}>{formatCurrency(netProfit)}</span></p>
                </div>
                <span className="text-xl font-extrabold text-rose-700">{formatCurrency(totalExpenses)}</span>
              </Card>
            </div>

            {/* --- 2. MAIN LAYOUT: FORM + HISTORY --- */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
               
               {/* LEFT: FORM PANEL */}
               <Card className="lg:w-[340px] shrink-0 border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden sticky top-0">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                       <Plus className="w-4 h-4 text-[#5d88c6]" /> Log Transaction
                    </h3>
                  </div>
                  
                  <div className="p-5 space-y-5">
                     
                     <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Transaction Type</label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                           <button onClick={() => setTxType('payment')} className={cn("py-1.5 text-xs font-bold rounded-md transition-all", txType === 'payment' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Cash In</button>
                           <button onClick={() => setTxType('expense')} className={cn("py-1.5 text-xs font-bold rounded-md transition-all", txType === 'expense' ? "bg-white text-rose-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Expense</button>
                        </div>
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Amount (PKR) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rs</span>
                          <Input 
                            type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
                            className={cn("pl-9 h-10 font-mono font-bold text-base focus-visible:ring-offset-0", txType === 'payment' ? "bg-emerald-50/30 border-emerald-100 focus-visible:border-emerald-400" : "bg-rose-50/30 border-rose-100 focus-visible:border-rose-400")}
                          />
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date *</label>
                           <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10 bg-slate-50 border-slate-200 text-xs font-medium text-slate-700" />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Method</label>
                           <Select value={method} onValueChange={setMethod}>
                              <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs font-medium text-slate-700"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="bank">Bank Transfer</SelectItem>
                                <SelectItem value="cheque">Cheque</SelectItem>
                                <SelectItem value="online">Online / Card</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Notes / Reference</label>
                        <Input placeholder="e.g. Milestone 1, Domain Renewal..." value={notes} onChange={e => setNotes(e.target.value)} className="h-10 bg-slate-50 border-slate-200 text-sm" />
                     </div>

                     <Button onClick={handleAddTransaction} className={cn("w-full h-10 font-bold text-white shadow-md transition-transform active:scale-95", txType === 'payment' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700")}>
                        {txType === 'payment' ? 'Log Payment Received' : 'Log Project Expense'}
                     </Button>
                  </div>
               </Card>

               {/* RIGHT: FULL LEDGER TABLE */}
               <Card className="flex-1 border-slate-200 shadow-sm bg-white min-h-[400px] flex flex-col rounded-2xl overflow-hidden w-full">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                     <h3 className="text-sm font-bold text-slate-800 tracking-wide">Transaction History</h3>
                     <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <Select value={filterMethod} onValueChange={setFilterMethod}>
                           <SelectTrigger className="h-8 w-[140px] text-xs font-bold bg-white border-slate-200 rounded-full">
                             <SelectValue placeholder="All Methods" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="all">All Methods</SelectItem>
                             <SelectItem value="cash">Cash</SelectItem>
                             <SelectItem value="bank">Bank Transfer</SelectItem>
                             <SelectItem value="cheque">Cheque</SelectItem>
                             <SelectItem value="online">Online / Card</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="overflow-x-auto flex-1 bg-white">
                    <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-extrabold border-b border-slate-100 sticky top-0 z-10 tracking-wider">
                        <tr>
                          <th className="px-5 py-3">Date</th>
                          <th className="px-5 py-3">Details & Method</th>
                          <th className="px-5 py-3 text-right text-emerald-600">Credit (In)</th>
                          <th className="px-5 py-3 text-right text-rose-600">Debit (Out)</th>
                          <th className="px-5 py-3 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {loading ? (
                           <tr><td colSpan={5} className="p-10 text-center text-slate-400 text-sm font-medium">Loading ledger...</td></tr>
                        ) : ledger.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-16 text-center">
                              <div className="flex flex-col items-center justify-center text-slate-300">
                                <CreditCard className="w-10 h-10 mb-3 opacity-20" />
                                <p className="text-sm font-medium">No financial transactions recorded.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          ledger.map((t: any) => (
                            <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="px-5 py-3 align-top whitespace-nowrap">
                                <div className="text-xs font-bold text-slate-700">{new Date(t.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</div>
                              </td>
                              <td className="px-5 py-3 align-top">
                                <div className={cn("text-xs font-bold mb-1", t.type === 'payment' ? "text-emerald-700" : "text-rose-700")}>{t.notes}</div>
                                <Badge variant="outline" className="font-bold text-[9px] text-slate-500 bg-slate-50 border-slate-200 px-2 py-0 uppercase tracking-wider">
                                   {t.method}
                                </Badge>
                              </td>
                              <td className="px-5 py-3 text-right align-top">
                                {t.credit > 0 ? <span className="font-mono font-bold text-emerald-600 text-sm">+{formatCurrency(t.credit)}</span> : <span className="text-slate-300">-</span>}
                              </td>
                              <td className="px-5 py-3 text-right align-top">
                                {t.debit > 0 ? <span className="font-mono font-bold text-rose-600 text-sm">-{formatCurrency(t.debit)}</span> : <span className="text-slate-300">-</span>}
                              </td>
                              <td className="px-4 py-3 text-center align-top">
                                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all opacity-0 group-hover:opacity-100" title="Delete Record">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
               </Card>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFinancials;