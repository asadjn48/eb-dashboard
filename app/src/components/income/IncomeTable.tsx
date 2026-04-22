// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react';
// import { History, Pencil, Eye, Trash2, AlertCircle, CircleDollarSign } from 'lucide-react'; // <--- Added CircleDollarSign
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { formatCurrency } from '@/utils/formatters';
// import { cn } from '@/lib/utils';

// interface IncomeTableProps {
//   data: any[];
//   isLoading: boolean;
//   onView: (id: string) => void;
//   onEdit: (id: string) => void;
//   onHistory: (id: string) => void;
//   onPayment: (id: string) => void; // <--- NEW PROP
//   onDelete: (id: string) => void;
// }

// export const IncomeTable: React.FC<IncomeTableProps> = ({ 
//   data, isLoading, onView, onEdit, onHistory, onPayment, onDelete // <--- Extract new prop
// }) => {

//   const getPaymentStatus = (budget: number, received: number) => {
//     if (received >= budget && budget > 0) return { label: 'Cleared', color: 'bg-emerald-100 text-emerald-700' };
//     if (received > 0) return { label: 'Partial', color: 'bg-blue-100 text-blue-700' };
//     return { label: 'Pending', color: 'bg-rose-100 text-rose-700' };
//   };

//   return (
//     <div className="overflow-x-auto w-full">
//       <table className="w-full text-sm text-left border-collapse min-w-[800px]">
//         <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 sticky top-0 z-10">
//           <tr>
//             <th className="px-5 py-4">Project Name</th>
//             <th className="px-5 py-4">Client Name</th>
//             <th className="px-5 py-4 text-right">Project Income</th>
//             <th className="px-5 py-4 text-right">Amount Receive</th>
//             <th className="px-5 py-4 text-right">Pending Amount</th>
//             <th className="px-5 py-4 text-center">Payment Status</th>
//             <th className="px-5 py-4 text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100 bg-white">
//           {isLoading ? (
//             <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">Loading records...</td></tr>
//           ) : data.length === 0 ? (
//             <tr>
//               <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
//                 <div className="flex flex-col items-center justify-center">
//                   <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
//                   No project income records match your filters.
//                 </div>
//               </td>
//             </tr>
//           ) : (
//             data.map((project) => {
//               const received = project.receivedAmount || 0;
//               const budget = project.budget || 0;
//               const pending = Math.max(0, budget - received);
//               const status = getPaymentStatus(budget, received);

//               return (
//                 <tr key={project.id} className="hover:bg-slate-50/80 transition-colors group">
//                   <td className="px-5 py-4">
//                     <div className="font-bold text-slate-900 group-hover:text-[#5d88c6] transition-colors truncate max-w-[200px]">
//                       {project.name}
//                     </div>
//                   </td>
//                   <td className="px-5 py-4">
//                     <div className="font-medium text-slate-600 truncate max-w-[150px]">
//                       {project.clientName || 'Unknown Client'}
//                     </div>
//                   </td>
//                   <td className="px-5 py-4 text-right">
//                     <div className="font-mono font-semibold text-slate-900">
//                       {formatCurrency(budget)}
//                     </div>
//                   </td>
//                   <td className="px-5 py-4 text-right">
//                     <div className="font-mono font-semibold text-emerald-600">
//                       {formatCurrency(received)}
//                     </div>
//                   </td>
//                   <td className="px-5 py-4 text-right">
//                     <div className={cn("font-mono font-semibold", pending > 0 ? "text-rose-600" : "text-slate-400")}>
//                       {formatCurrency(pending)}
//                     </div>
//                   </td>
//                   <td className="px-5 py-4 text-center">
//                     <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border-0", status.color)}>
//                       {status.label}
//                     </Badge>
//                   </td>
//                   <td className="px-5 py-4 text-center">
//                     <div className="flex items-center justify-center gap-0.5">
//                       {/* NEW FINANCE BUTTON */}
//                       <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full" onClick={() => onPayment(project.id)} title="Manage Finances & Investors">
//                         <CircleDollarSign className="w-3.5 h-3.5" />
//                       </Button>
                      
//                       <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full" onClick={() => onHistory(project.id)} title="Payment Ledger">
//                         <History className="w-3.5 h-3.5" />
//                       </Button>
//                       <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full" onClick={() => onEdit(project.id)} title="Edit Project Details">
//                         <Pencil className="w-3.5 h-3.5" />
//                       </Button>
//                       <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full" onClick={() => onView(project.id)} title="View Overview">
//                         <Eye className="w-3.5 h-3.5" />
//                       </Button>
//                       <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full" onClick={() => onDelete(project.id)} title="Delete Record">
//                         <Trash2 className="w-3.5 h-3.5" />
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };





























/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { History, Pencil, Eye, Trash2, AlertCircle, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface IncomeTableProps {
  data: any[];
  isLoading: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onHistory: (id: string) => void;
  onPayment: (id: string) => void; 
  onDelete: (id: string) => void;
}

export const IncomeTable: React.FC<IncomeTableProps> = ({ 
  data, isLoading, onView, onEdit, onHistory, onPayment, onDelete 
}) => {

  const getPaymentStatus = (budget: number, received: number) => {
    // FIXED: Handle Overpaid logic
    if (received > budget && budget > 0) return { label: 'Overpaid', color: 'bg-purple-100 text-purple-700' };
    if (received === budget && budget > 0) return { label: 'Cleared', color: 'bg-emerald-100 text-emerald-700' };
    if (received > 0) return { label: 'Partial', color: 'bg-blue-100 text-blue-700' };
    return { label: 'Pending', color: 'bg-rose-100 text-rose-700' };
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left border-collapse min-w-[800px]">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 sticky top-0 z-10">
          <tr>
            <th className="px-5 py-4">Project Name</th>
            <th className="px-5 py-4">Client Name</th>
            <th className="px-5 py-4 text-right">Project Income</th>
            <th className="px-5 py-4 text-right">Amount Received</th>
            <th className="px-5 py-4 text-right">Pending Amount</th>
            <th className="px-5 py-4 text-center">Payment Status</th>
            <th className="px-5 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {isLoading ? (
            <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">Loading records...</td></tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                  No project income records match your filters.
                </div>
              </td>
            </tr>
          ) : (
            data.map((project) => {
              const received = project.receivedAmount || 0;
              const budget = project.budget || 0;
              // FIXED: Remove Math.max(0, ...) so it shows negative numbers for overpayment
              const pending = budget - received;
              const status = getPaymentStatus(budget, received);

              return (
                <tr key={project.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 group-hover:text-[#5d88c6] transition-colors truncate max-w-[200px]">
                      {project.name}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-600 truncate max-w-[150px]">
                      {project.clientName || 'Unknown Client'}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="font-mono font-semibold text-slate-900">
                      {formatCurrency(budget)}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="font-mono font-semibold text-emerald-600">
                      {formatCurrency(received)}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className={cn("font-mono font-semibold", 
                       pending > 0 ? "text-rose-600" : 
                       pending < 0 ? "text-purple-600" : "text-slate-400"
                    )}>
                      {/* FIXED: Display overpayment cleanly */}
                      {pending < 0 ? `+${formatCurrency(Math.abs(pending))} (Over)` : formatCurrency(pending)}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border-0", status.color)}>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full" onClick={() => onPayment(project.id)} title="Log Payment">
                        <CircleDollarSign className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full" onClick={() => onHistory(project.id)} title="Payment Ledger">
                        <History className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full" onClick={() => onEdit(project.id)} title="Edit Project Details">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full" onClick={() => onView(project.id)} title="View Overview">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full" onClick={() => onDelete(project.id)} title="Delete Record">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};