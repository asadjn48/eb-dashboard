// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useMemo } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { X, History, Briefcase, Building2, DollarSign, Printer } from 'lucide-react';
// import { formatCurrency } from '@/utils/formatters';
// import type { Project } from '@/types';
// import { cn } from '@/lib/utils';

// interface ProjectHistoryModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   project: Project | null;
// }

// export const ProjectHistoryModal: React.FC<ProjectHistoryModalProps> = ({ isOpen, onClose, project }) => {
  
//   // Dynamically generate a ledger based on the budget and actual payment history array
//   const ledger = useMemo(() => {
//     if (!project) return [];
    
//     const budget = project.budget || 0;
//     const payments = (project as any).payments || []; // Pull the array of individual payments
    
//     const records: any[] = [];

//     // 1. Initial Credit (The Total Budget Billed to Client)
//     if (budget > 0) {
//       records.push({
//         id: 'initial-budget',
//         date: project.startDate || project.createdAt || new Date().toISOString(),
//         description: 'Initial Project Budget (Billed)',
//         debit: 0,
//         credit: budget,
//         isBudget: true
//       });
//     }

//     // 2. Map every single payment into the ledger as a Debit
//     payments.forEach((p: any, index: number) => {
//       records.push({
//         id: p.id || `payment-${index}`,
//         date: p.date,
//         description: p.notes ? `Payment Received: ${p.notes}` : 'Payment Received',
//         debit: Number(p.amount) || 0,
//         credit: 0,
//         isBudget: false
//       });
//     });

//     // 3. Sort Ascending by Date (Oldest to Newest)
//     records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//     // 4. Calculate the Running Balance line-by-line
//     let currentBalance = 0;
//     return records.map(record => {
//       currentBalance += record.credit;
//       currentBalance -= record.debit;
//       return { ...record, balance: currentBalance };
//     });

//   }, [project]);

//   if (!project) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
//       <DialogContent className="w-[95vw] md:max-w-4xl max-h-[90vh] flex flex-col p-0 border-0 shadow-2xl rounded-2xl overflow-hidden bg-slate-50">
        
//         {/* --- HEADER --- */}
//         <DialogHeader className="px-6 py-4 bg-slate-900 border-b shrink-0 flex flex-row items-center justify-between">
//           <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
//              <History className="w-5 h-5 text-[#5d88c6]" /> Payment History
//           </DialogTitle>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 text-xs gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white rounded-full px-4 print:hidden">
//                <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print Ledger</span>
//             </Button>
//             <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 rounded-full shrink-0 print:hidden">
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         </DialogHeader>

//         {/* --- WIREFRAME BANNER: Project Name | Client Name | Total Payment --- */}
//         <div className="px-6 py-5 bg-white border-b border-slate-200 shrink-0">
//            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
//               <div className="flex items-start gap-3">
//                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Briefcase className="w-4 h-4" /></div>
//                  <div>
//                     <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Project Name</p>
//                     <p className="font-bold text-slate-900 text-base leading-tight mt-0.5 truncate">{project.name}</p>
//                  </div>
//               </div>

//               <div className="flex items-start gap-3 sm:border-l sm:border-slate-100 sm:pl-4">
//                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Building2 className="w-4 h-4" /></div>
//                  <div>
//                     <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Client Name</p>
//                     <p className="font-bold text-slate-900 text-base leading-tight mt-0.5 truncate">{project.clientName || 'Internal / N/A'}</p>
//                  </div>
//               </div>

//               <div className="flex items-start gap-3 sm:border-l sm:border-slate-100 sm:pl-4">
//                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="w-4 h-4" /></div>
//                  <div>
//                     <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600/70">Total Payment Received</p>
//                     <p className="font-extrabold text-emerald-600 text-xl leading-none mt-1">{formatCurrency((project as any).receivedAmount || 0)}</p>
//                  </div>
//               </div>

//            </div>
//         </div>

//         {/* --- TABLE AREA (Scrollable) --- */}
//         <div className="flex-1 overflow-auto bg-white p-0 relative">
//            <table className="w-full text-sm text-left border-collapse">
//               <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b sticky top-0 z-10 shadow-sm">
//                  <tr>
//                     <th className="px-6 py-4">Date</th>
//                     <th className="px-6 py-4">Description</th>
//                     <th className="px-6 py-4 text-right text-emerald-600">Debit (Received)</th>
//                     <th className="px-6 py-4 text-right text-blue-600">Credit (Billed)</th>
//                     <th className="px-6 py-4 text-right bg-slate-100 border-l border-slate-200">Running Balance</th>
//                  </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                  {ledger.length === 0 ? (
//                     <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No ledger records found for this project.</td></tr>
//                  ) : (
//                     ledger.map((item) => (
//                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
//                           <td className="px-6 py-4 align-top whitespace-nowrap">
//                              <div className="font-bold text-slate-700 text-xs">
//                                {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}
//                              </div>
//                              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
//                                {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                              </div>
//                           </td>
//                           <td className="px-6 py-4 align-top">
//                              <span className={cn("text-xs font-semibold", item.isBudget ? "text-blue-700" : "text-emerald-700")}>
//                                {item.description}
//                              </span>
//                           </td>
//                           <td className="px-6 py-4 text-right align-top font-mono">
//                              {item.debit > 0 ? <span className="font-bold text-emerald-600">+{formatCurrency(item.debit)}</span> : <span className="text-slate-300">-</span>}
//                           </td>
//                           <td className="px-6 py-4 text-right align-top font-mono">
//                              {item.credit > 0 ? <span className="font-bold text-blue-600">{formatCurrency(item.credit)}</span> : <span className="text-slate-300">-</span>}
//                           </td>
//                           <td className="px-6 py-4 text-right align-top font-mono bg-slate-50/50 border-l border-slate-100">
//                              <span className={cn("font-bold", item.balance > 0 ? "text-rose-600" : "text-slate-500")}>
//                                {formatCurrency(item.balance)}
//                              </span>
//                           </td>
//                        </tr>
//                     ))
//                  )}
//               </tbody>
//            </table>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };














































/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, History, Briefcase, Building2, DollarSign, Download } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ProjectHistoryModal: React.FC<ProjectHistoryModalProps> = ({ isOpen, onClose, project }) => {
  
  const ledger = useMemo(() => {
    if (!project) return [];
    
    const budget = project.budget || 0;
    const payments = (project as any).payments || []; 
    
    const records: any[] = [];

    if (budget > 0) {
      records.push({
        id: 'initial-budget',
        date: project.startDate || project.createdAt || new Date().toISOString(),
        description: 'Initial Project Budget (Billed)',
        debit: 0,
        credit: budget,
        isBudget: true
      });
    }

    payments.forEach((p: any, index: number) => {
      records.push({
        id: p.id || `payment-${index}`,
        date: p.date,
        description: p.notes ? `Payment Received: ${p.notes}` : 'Payment Received',
        debit: Number(p.amount) || 0,
        credit: 0,
        isBudget: false
      });
    });

    records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentBalance = 0;
    return records.map(record => {
      currentBalance += record.credit;
      currentBalance -= record.debit;
      return { ...record, balance: currentBalance };
    });

  }, [project]);

  // NEW: CSV Export for Ledger
  const handleExportCSV = () => {
    if (!project) return;
    
    const headers = ['Date', 'Time', 'Description', 'Debit (Received)', 'Credit (Billed)', 'Running Balance'];
    const rows = ledger.map(item => {
      const d = new Date(item.date);
      return `"${d.toLocaleDateString()}","${d.toLocaleTimeString()}","${item.description}",${item.debit},${item.credit},${item.balance}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${project.name}_Payment_Ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-[95vw] md:max-w-4xl max-h-[90vh] flex flex-col p-0 border-0 shadow-2xl rounded-2xl overflow-hidden bg-slate-50">
        
        <DialogHeader className="px-6 py-4 bg-slate-900 border-b shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
             <History className="w-5 h-5 text-[#5d88c6]" /> Payment History
          </DialogTitle>
          <div className="flex items-center gap-2">
            {/* FIXED: Replaced Print with functional CSV Download */}
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-8 text-xs gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white rounded-full px-4">
               <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 rounded-full shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 bg-white border-b border-slate-200 shrink-0">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                 <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Briefcase className="w-4 h-4" /></div>
                 <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Project Name</p>
                    <p className="font-bold text-slate-900 text-base leading-tight mt-0.5 truncate">{project.name}</p>
                 </div>
              </div>
              <div className="flex items-start gap-3 sm:border-l sm:border-slate-100 sm:pl-4">
                 <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Building2 className="w-4 h-4" /></div>
                 <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Client Name</p>
                    <p className="font-bold text-slate-900 text-base leading-tight mt-0.5 truncate">{project.clientName || 'Internal / N/A'}</p>
                 </div>
              </div>
              <div className="flex items-start gap-3 sm:border-l sm:border-slate-100 sm:pl-4">
                 <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="w-4 h-4" /></div>
                 <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600/70">Total Payment Received</p>
                    <p className="font-extrabold text-emerald-600 text-xl leading-none mt-1">{formatCurrency((project as any).receivedAmount || 0)}</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-auto bg-white p-0 relative">
           <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b sticky top-0 z-10 shadow-sm">
                 <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right text-emerald-600">Debit (Received)</th>
                    <th className="px-6 py-4 text-right text-blue-600">Credit (Billed)</th>
                    <th className="px-6 py-4 text-right bg-slate-100 border-l border-slate-200">Running Balance</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {ledger.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No ledger records found for this project.</td></tr>
                 ) : (
                    ledger.map((item) => (
                       <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 align-top whitespace-nowrap">
                             <div className="font-bold text-slate-700 text-xs">
                               {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}
                             </div>
                             <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                               {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                             <span className={cn("text-xs font-semibold", item.isBudget ? "text-blue-700" : "text-emerald-700")}>
                               {item.description}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right align-top font-mono">
                             {item.debit > 0 ? <span className="font-bold text-emerald-600">+{formatCurrency(item.debit)}</span> : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="px-6 py-4 text-right align-top font-mono">
                             {item.credit > 0 ? <span className="font-bold text-blue-600">{formatCurrency(item.credit)}</span> : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="px-6 py-4 text-right align-top font-mono bg-slate-50/50 border-l border-slate-100">
                             <span className={cn("font-bold", 
                               item.balance > 0 ? "text-rose-600" : 
                               item.balance < 0 ? "text-purple-600" : "text-slate-500"
                             )}>
                               {item.balance < 0 ? `+${formatCurrency(Math.abs(item.balance))} (Over)` : formatCurrency(item.balance)}
                             </span>
                          </td>
                       </tr>
                    ))
                 )}
              </tbody>
           </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};