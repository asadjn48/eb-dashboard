/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Pencil, Trash2, FileText, Search, FileSignature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export const DistributionTable = ({ data, onEdit, onDelete, onAdd, onNote, onToggleRefund }: any) => {
  const [activeTab, setActiveTab] = useState<'debt' | 'security' | 'investment'>('debt');
  const [search, setSearch] = useState('');

  const filteredData = data.filter((item: any) => 
    item.type === activeTab && 
    (item.name.toLowerCase().includes(search.toLowerCase()) || (item.purpose || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs & Search Row */}
      <div className="flex flex-col md:flex-row justify-between gap-4 p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0 w-full md:w-auto">
          {['debt', 'security', 'investment'].map(tab => (
            <button 
              key={tab} onClick={() => setActiveTab(tab as any)} 
              className={cn("flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg capitalize transition-all", activeTab === tab ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50")}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-lg focus-visible:ring-emerald-500" />
          </div>
          <Button onClick={() => onAdd(activeTab)} className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs font-bold rounded-lg px-5 shrink-0 shadow-sm transition-transform active:scale-95">Add Record</Button>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto w-full flex-1">
        <table className="w-full text-sm text-left border-collapse min-w-[900px]">
          <thead className="bg-white text-[10px] uppercase tracking-wider text-slate-400 font-extrabold border-b border-slate-200">
            <tr>
              {activeTab === 'debt' && (
                <>
                  <th className="px-5 py-4">Name</th><th className="px-5 py-4">Purpose</th><th className="px-5 py-4">Contact No</th><th className="px-5 py-4 text-right">Amount</th><th className="px-5 py-4">Date</th><th className="px-5 py-4 text-center">Status</th>
                </>
              )}
              {activeTab === 'security' && (
                <>
                  <th className="px-5 py-4">Deposit Name</th><th className="px-5 py-4 text-right">Amount</th><th className="px-5 py-4">Date</th><th className="px-5 py-4 text-center">Refund</th><th className="px-5 py-4 text-center">Status</th>
                </>
              )}
              {activeTab === 'investment' && (
                <>
                  <th className="px-5 py-4">Name</th><th className="px-5 py-4">Type</th><th className="px-5 py-4 text-right">Invested</th><th className="px-5 py-4">Date</th><th className="px-5 py-4 text-center">Status</th>
                </>
              )}
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400 font-medium">No {activeTab} records found.</td></tr>
            ) : (
              filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Row specific to DEBT */}
                  {activeTab === 'debt' && (
                    <>
                      <td className="px-5 py-3 font-bold text-slate-800">{item.name}</td>
                      <td className="px-5 py-3 font-medium text-slate-600">{item.purpose}</td>
                      <td className="px-5 py-3 font-mono text-slate-500 text-xs">{item.contact || '-'}</td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                      <td className="px-5 py-3 text-slate-500 font-medium text-xs">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-center">
                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase border-0 px-2", item.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>{item.status}</Badge>
                      </td>
                    </>
                  )}

                  {/* Row specific to SECURITY */}
                  {activeTab === 'security' && (
                    <>
                      <td className="px-5 py-3 font-bold text-slate-800">{item.name}</td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                      <td className="px-5 py-3 text-slate-500 font-medium text-xs">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-center align-middle">
                        <div className="flex justify-center">
                          {/* Custom Refund Switch */}
                          <div onClick={() => onToggleRefund(item.id)} className={cn("w-10 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors duration-300", item.refunded ? "bg-emerald-500" : "bg-slate-300")}>
                             <div className={cn("bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300", item.refunded ? "translate-x-5" : "translate-x-0")} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase border-0 px-2", item.refunded ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>{item.refunded ? 'Refunded' : 'Pending'}</Badge>
                      </td>
                    </>
                  )}

                  {/* Row specific to INVESTMENT */}
                  {activeTab === 'investment' && (
                    <>
                      <td className="px-5 py-3 font-bold text-slate-800">{item.name}</td>
                      <td className="px-5 py-3 font-medium text-slate-600 capitalize">{item.investmentType || 'Standard'}</td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                      <td className="px-5 py-3 text-slate-500 font-medium text-xs">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-center">
                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase border-0 px-2", item.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{item.status || 'Active'}</Badge>
                      </td>
                    </>
                  )}

                  {/* Actions Column (Consistent across all tabs) */}
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center items-center gap-1">
                      {/* Notes Button: Solid color if note exists, outline if empty */}
                      <Button variant="ghost" size="icon" onClick={() => onNote(item)} className={cn("h-8 w-8 rounded-full transition-colors", item.notes ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-slate-400 hover:bg-slate-100")} title="Notes">
                         {item.notes ? <FileText className="w-4 h-4" /> : <FileSignature className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full" title="Edit"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full" title="Delete"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};