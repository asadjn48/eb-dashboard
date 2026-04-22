/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Landmark, Plus,  X, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export const BankBalanceCard = ({ banks, onAddBank, onEditBank, onDeleteBank }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  const totalBalance = banks.reduce((sum: number, b: any) => sum + Number(b.balance), 0);

  const handleSave = async () => {
    if (!name || !balance) return;
    setIsProcessing(true);
    try {
      if (editingId) {
        await onEditBank(editingId, { name, balance: Number(balance) });
        setEditingId(null);
      } else {
        await onAddBank({ name, balance: Number(balance) });
        setIsAdding(false);
      }
      setName(''); setBalance('');
    } finally {
      setIsProcessing(false);
    }
  };

  const startEdit = (bank: any) => {
    setEditingId(bank.id);
    setName(bank.name);
    setBalance(bank.balance.toString());
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remove this bank account?")) {
      await onDeleteBank(id);
    }
  };

  return (
    <Card className="border border-slate-200/60 shadow-sm rounded-2xl flex flex-col h-[380px] bg-gradient-to-br from-[#5d88c6]/10 to-white">
      <CardHeader className="p-5 pb-4 shrink-0 border-b border-[#5d88c6]/10">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xs font-bold text-[#5d88c6] uppercase tracking-wider">Total Payment in Bank</CardTitle>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 font-mono tracking-tight">{formatCurrency(totalBalance)}</p>
          </div>
          <Button size="icon" onClick={() => { setIsAdding(true); setEditingId(null); setName(''); setBalance(''); }} className="h-8 w-8 bg-[#5d88c6] hover:bg-[#4a6d9e] text-white rounded-lg shadow-md transition-transform active:scale-95" disabled={isProcessing}>
             <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 overflow-y-auto flex-1 no-scrollbar space-y-3">
         
         {(isAdding || editingId) && (
            <div className="bg-white p-3 rounded-xl border border-[#5d88c6]/30 shadow-sm animate-in fade-in zoom-in-95 space-y-2">
               <Input placeholder="Bank Name (e.g. HBL)" value={name} onChange={e=>setName(e.target.value)} className="h-8 text-xs bg-slate-50" autoFocus disabled={isProcessing} />
               <Input type="number" placeholder="Current Balance" value={balance} onChange={e=>setBalance(e.target.value)} className="h-8 text-xs font-mono bg-slate-50" disabled={isProcessing} />
               <div className="flex gap-2 justify-end pt-1">
                  <Button variant="ghost" size="sm" onClick={() => { setIsAdding(false); setEditingId(null); }} className="h-7 text-[10px] uppercase font-bold text-slate-500" disabled={isProcessing}><X className="w-3 h-3 mr-1"/> Cancel</Button>
                  <Button size="sm" onClick={handleSave} className="h-7 text-[10px] uppercase font-bold bg-[#5d88c6] hover:bg-[#4a6d9e] text-white" disabled={isProcessing}>
                     {isProcessing ? 'Saving...' : <><Check className="w-3 h-3 mr-1"/> Save</>}
                  </Button>
               </div>
            </div>
         )}

         {banks.map((bank: any) => (
            <div key={bank.id} className={cn("flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm group transition-all", editingId === bank.id ? "hidden" : "block")}>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg"><Landmark className="w-4 h-4 text-[#5d88c6]" /></div>
                  <div>
                     <p className="font-bold text-slate-800 text-sm leading-tight">{bank.name}</p>
                     <div className="flex items-center gap-1 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(bank)} className="text-[10px] text-blue-500 hover:underline font-bold uppercase">Edit</button>
                        <span className="text-slate-300">|</span>
                        <button onClick={() => handleDelete(bank.id)} className="text-[10px] text-rose-500 hover:underline font-bold uppercase">Delete</button>
                     </div>
                  </div>
               </div>
               <p className="font-mono font-bold text-slate-900 text-base">{formatCurrency(bank.balance)}</p>
            </div>
         ))}
         {banks.length === 0 && !isAdding && <p className="text-center text-slate-400 text-xs py-8 font-medium">No bank accounts added.</p>}
      </CardContent>
    </Card>
  );
};