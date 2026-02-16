// import React from 'react';
// import { MoreHorizontal, Clock, Edit2, Trash2, Home, Wifi, Zap, Utensils, Wrench, Users } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { formatDate, formatCurrency } from '@/utils/formatters';
// import { cn } from '@/lib/utils';
// import type { Expense } from '@/types';

// const CATEGORY_ICONS: Record<string, { icon: React.ReactNode, color: string, bg: string }> = {
//   Rent: { icon: <Home className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-50' },
//   WiFi: { icon: <Wifi className="w-4 h-4" />, color: 'text-purple-600', bg: 'bg-purple-50' },
//   Electricity: { icon: <Zap className="w-4 h-4" />, color: 'text-yellow-600', bg: 'bg-yellow-50' },
//   Food: { icon: <Utensils className="w-4 h-4" />, color: 'text-green-600', bg: 'bg-green-50' },
//   Maintenance: { icon: <Wrench className="w-4 h-4" />, color: 'text-orange-600', bg: 'bg-orange-50' },
//   Guest: { icon: <Users className="w-4 h-4" />, color: 'text-pink-600', bg: 'bg-pink-50' },
//   Other: { icon: <MoreHorizontal className="w-4 h-4" />, color: 'text-gray-600', bg: 'bg-gray-50' },
// };

// interface ExpenseTableProps {
//   expenses: Expense[];
//   isLoading: boolean;
//   onEdit: (expense: Expense) => void;
//   onDelete: (id: string) => void;
// }

// export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, isLoading, onEdit, onDelete }) => {
//   return (
//     <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50/30 border-b border-gray-100">
//             <tr>
//               <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Expense Details</th>
//               <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
//               <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
//               <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {isLoading ? (
//               <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading expenses...</td></tr>
//             ) : expenses.length === 0 ? (
//               <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No records match your filters</td></tr>
//             ) : (
//               expenses.map((expense) => {
//                 const config = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS['Other'];
//                 return (
//                   <tr key={expense.id} className="group hover:bg-gray-50/50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-4">
//                         <div className={cn('p-2.5 rounded-xl shrink-0 transition-colors group-hover:bg-white', config.bg, config.color)}>
//                           {config.icon}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-gray-900 text-sm">{expense.description}</p>
//                           <div className="flex items-center gap-2 mt-0.5">
//                               <span className="text-xs text-gray-500 font-medium">{expense.category}</span>
//                               {expense.isRecurring && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Recurring</span>}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500 font-medium">{formatDate(expense.date)}</td>
//                     <td className="px-6 py-4 text-center">
//                       <Badge variant="outline" 
//                         className={cn(
//                           "capitalize font-normal border-0 px-2.5 py-0.5", 
//                           expense.status === 'paid' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
//                         )}>
//                         {expense.status === 'pending' && <Clock className="w-3 h-3 mr-1.5 opacity-70" />}
//                         {expense.status}
//                       </Badge>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <span className="font-bold text-gray-900">{formatCurrency(expense.amount)}</span>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
//                             <MoreHorizontal className="w-4 h-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem onClick={() => onEdit(expense)}>
//                             <Edit2 className="w-4 h-4 mr-2" /> Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(expense.id)}>
//                             <Trash2 className="w-4 h-4 mr-2" /> Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

























/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ExpenseTableProps {
  data: any[]; // Accepts Expense[] or Income[]
  type: 'expenses' | 'income';
  isLoading: boolean;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export const ExpenseTable = ({ data, type, isLoading, onEdit, onDelete }: ExpenseTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-[11px] uppercase text-gray-500 font-semibold bg-gray-50/50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-3 min-w-[200px]">
              {type === 'expenses' ? 'Description' : 'Source'}
            </th>
            {type === 'expenses' && <th className="px-6 py-3">Category</th>}
            <th className="px-6 py-3">Date</th>
            {type === 'expenses' && <th className="px-6 py-3 text-center">Status</th>}
            <th className="px-6 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {isLoading ? (
            <tr>
              <td colSpan={type === 'expenses' ? 6 : 4} className="px-6 py-12 text-center text-gray-400 text-xs">
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={type === 'expenses' ? 6 : 4} className="px-6 py-12 text-center text-gray-400 text-xs">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                
                {/* 1. Description / Source */}
                <td className="px-6 py-3">
                  <div className="font-medium text-gray-900 text-sm">
                    {type === 'expenses' ? item.description : item.source}
                  </div>
                  {type === 'income' && (
                    <div className="text-[10px] text-gray-400 mt-0.5">ID: {item.id.slice(0,6)}</div>
                  )}
                </td>

                {/* 2. Category (Expenses Only) */}
                {type === 'expenses' && (
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{item.category}</span>
                    </div>
                  </td>
                )}

                {/* 3. Date */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3 h-3 opacity-70" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </td>

                {/* 4. Status (Expenses Only) */}
                {type === 'expenses' && (
                  <td className="px-6 py-3 text-center">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-[10px] px-2 py-0 h-5 border capitalize",
                        item.status === 'paid' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : 
                        item.status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-700" : 
                        "bg-gray-50 text-gray-600"
                      )}
                    >
                      {item.status}
                    </Badge>
                  </td>
                )}

                {/* 5. Amount */}
                <td className="px-6 py-3 text-right">
                  <div className={cn(
                    "font-mono font-medium text-sm",
                    type === 'income' ? "text-emerald-600" : "text-gray-900"
                  )}>
                    {type === 'income' ? '+' : ''}{formatCurrency(item.amount)}
                  </div>
                </td>

                {/* 6. Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Only show Edit for Expenses currently, as Income edit is usually rare/simple */}
                    {type === 'expenses' && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-600" onClick={() => onEdit(item)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-600" onClick={() => onDelete(item.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};