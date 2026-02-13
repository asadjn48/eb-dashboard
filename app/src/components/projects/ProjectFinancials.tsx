/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { 
   Plus, Trash2, CheckCircle2, AlertCircle, 
   Wallet, Calendar, CreditCard, ArrowRight, Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { projectAPI } from '@/services/projectService';
import { formatCurrency } from '@/utils/formatters';
import type { Project, ProjectTransaction } from '@/types';

interface ProjectFinancialsProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const ProjectFinancials: React.FC<ProjectFinancialsProps> = ({ project, isOpen, onClose, onUpdate }) => {
  const [transactions, setTransactions] = useState<ProjectTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ProjectTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');

  // Stats
  const totalReceived = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const remaining = project.budget - totalReceived;
  const progress = project.budget > 0 ? (totalReceived / project.budget) * 100 : 0;

  useEffect(() => {
    if (isOpen && project.id) {
      loadTransactions();
    }
  }, [isOpen, project.id]);

  useEffect(() => {
    let res = [...transactions];
    if (filterMethod !== 'all') {
      res = res.filter(t => t.method === filterMethod);
    }
    setFilteredTransactions(res);
  }, [transactions, filterMethod]);

  const loadTransactions = async () => {
    setLoading(true);
    const data = await projectAPI.getTransactions(project.id);
    setTransactions(data);
    setLoading(false);
  };

  const handleAddPayment = async () => {
    if (!amount || Number(amount) <= 0) return;
    try {
      const newTrans = {
        projectId: project.id,
        amount: Number(amount),
        date: date,
        type: 'payment' as const,
        method: method as any,
        notes: notes
      };

      await projectAPI.addTransaction(newTrans);
      await loadTransactions(); 
      if (onUpdate) onUpdate();
      
      setAmount('');
      setNotes('');
    } catch (e) {
      console.error("Failed to add payment", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this transaction?")) {
      await projectAPI.deleteTransaction(id, project.id);
      await loadTransactions();
      if (onUpdate) onUpdate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl w-[95vw] h-[85vh] flex flex-col bg-gray-50/30 p-0 gap-0 overflow-hidden border-0 shadow-2xl rounded-lg">
        
        {/* COMPACT HEADER */}
        <DialogHeader className="px-5 py-3 bg-white border-b flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-gray-900 rounded-md shadow-sm">
                <Wallet className="w-4 h-4 text-white" />
             </div>
             <div>
                <DialogTitle className="text-base font-bold text-gray-900 leading-none">Project Financials</DialogTitle>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                   <span className="font-medium">{project.name}</span>
                   <ArrowRight className="w-3 h-3 text-gray-300" />
                   <span>{project.clientName || 'No Client'}</span>
                </div>
             </div>
          </div>
          {/* Default Close Button handles the X now */}
        </DialogHeader>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            
            {/* 1. COMPACT STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Total Budget */}
              <Card className="border-0 shadow-sm bg-[#1E293B] text-white relative overflow-hidden group">
                <div className="p-4 relative z-10">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Total Budget</p>
                  <span className="text-xl font-bold">{formatCurrency(project.budget)}</span>
                  <div className="mt-1 flex items-center text-slate-500 text-[10px]">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
              
              {/* Received */}
              <Card className="border-0 shadow-sm bg-[#10B981] text-white relative overflow-hidden group">
                <div className="p-4 relative z-10">
                  <div className="flex justify-between items-start mb-0.5">
                     <p className="text-emerald-50 text-[10px] font-bold uppercase tracking-wider flex items-center">
                       <CheckCircle2 className="w-3 h-3 mr-1" /> Received
                     </p>
                     <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {progress.toFixed(0)}%
                     </span>
                  </div>
                  <span className="text-xl font-bold">{formatCurrency(totalReceived)}</span>
                  <div className="mt-2 w-full bg-black/10 rounded-full h-1">
                    <div className="bg-white h-1 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>
              </Card>

              {/* Remaining */}
              <Card className="border-0 shadow-sm bg-[#F59E0B] text-white relative overflow-hidden group">
                 <div className="p-4 relative z-10">
                  <p className="text-amber-50 text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Pending
                  </p>
                  <span className="text-xl font-bold">{formatCurrency(remaining)}</span>
                  <p className="text-amber-100/60 text-[10px] mt-1">To collect from client</p>
                </div>
              </Card>
            </div>

            {/* 2. MAIN LAYOUT: FORM + HISTORY */}
            <div className="flex flex-col lg:flex-row gap-3 items-start">
               
               {/* LEFT: COMPACT FORM */}
               <Card className="lg:w-[313px] shrink-0 border-gray-200 shadow-sm bg-white sticky top-0 pt-3">
                  <div className="p-3  border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-xs font-bold text-gray-900 flex items-center uppercase tracking-wide">
                       <Plus className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                       Record Payment
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                     <div>
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Amount</label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rs</span>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            value={amount} onChange={e => setAmount(e.target.value)}
                            className="pl-8 h-9 bg-gray-50 border-gray-200 focus:bg-white text-sm font-medium"
                          />
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2">
                        <div>
                           <label className="text-[10px] font-semibold text-gray-500 uppercase">Date</label>
                           <Input 
                              type="date" 
                              value={date} onChange={e => setDate(e.target.value)}
                              className="mt-1 h-8 bg-gray-50 border-gray-200 text-[11px]"
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-semibold text-gray-500 uppercase">Method</label>
                           <Select value={method} onValueChange={setMethod}>
                              <SelectTrigger className="mt-1 h-8 bg-gray-50 border-gray-200 text-[11px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="bank">Bank</SelectItem>
                                <SelectItem value="cheque">Cheque</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Notes</label>
                        <Input 
                          placeholder="Optional..." 
                          value={notes} onChange={e => setNotes(e.target.value)}
                          className="mt-1 h-8 bg-gray-50 border-gray-200 text-[11px]"
                        />
                     </div>

                     <Button onClick={handleAddPayment} size="sm" className="w-full bg-gray-900 hover:bg-gray-800 text-white h-9 mt-1">
                        Add Record
                     </Button>
                  </div>
               </Card>

               {/* RIGHT: COMPACT HISTORY LIST */}
               <Card className="flex-1 pt-3 border-gray-200 shadow-sm bg-white min-h-[350px] flex flex-col">
                  <div className="p-3 pt-0 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                     <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Transaction History</h3>
                     <div className="flex items-center gap-2">
                        <Filter className="w-3 h-3 text-gray-400" />
                        <Select value={filterMethod} onValueChange={setFilterMethod}>
                           <SelectTrigger className="h-7 w-[110px] text-[10px] bg-white border-gray-200">
                             <SelectValue placeholder="All" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="all">All Methods</SelectItem>
                             <SelectItem value="cash">Cash</SelectItem>
                             <SelectItem value="bank">Bank</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white text-gray-400 text-[10px] uppercase font-bold border-b border-gray-50">
                        <tr>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Method</th>
                          <th className="px-4 py-2">Notes</th>
                          <th className="px-4 py-2 text-right">Amount</th>
                          <th className="px-4 py-2 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {loading ? (
                           <tr><td colSpan={5} className="p-6 text-center text-gray-400 text-[10px]">Loading...</td></tr>
                        ) : filteredTransactions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-300">
                                <CreditCard className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-[10px]">No transactions found</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50/80 transition-colors group">
                              <td className="px-4 py-2.5 text-[11px] text-gray-600 font-medium">
                                {new Date(t.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-2.5">
                                <Badge variant="secondary" className="font-normal text-[9px] text-gray-600 bg-gray-100 border-0 px-1.5 py-0 capitalize">
                                   {t.method}
                                </Badge>
                              </td>
                              <td className="px-4 py-2.5 text-gray-400 text-[10px] truncate max-w-[150px]">
                                {t.notes || '-'}
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <span className="font-bold text-emerald-600 text-xs">
                                  +{formatCurrency(t.amount)}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <button 
                                  onClick={() => handleDelete(t.id)} 
                                  className="p-1 text-gray-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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