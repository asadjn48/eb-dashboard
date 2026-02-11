import React from 'react';
import { MoreHorizontal, Clock, Edit2, Trash2, Home, Wifi, Zap, Utensils, Wrench, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import type { Expense } from '@/types';

const CATEGORY_ICONS: Record<string, { icon: React.ReactNode, color: string, bg: string }> = {
  Rent: { icon: <Home className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-50' },
  WiFi: { icon: <Wifi className="w-4 h-4" />, color: 'text-purple-600', bg: 'bg-purple-50' },
  Electricity: { icon: <Zap className="w-4 h-4" />, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  Food: { icon: <Utensils className="w-4 h-4" />, color: 'text-green-600', bg: 'bg-green-50' },
  Maintenance: { icon: <Wrench className="w-4 h-4" />, color: 'text-orange-600', bg: 'bg-orange-50' },
  Guest: { icon: <Users className="w-4 h-4" />, color: 'text-pink-600', bg: 'bg-pink-50' },
  Other: { icon: <MoreHorizontal className="w-4 h-4" />, color: 'text-gray-600', bg: 'bg-gray-50' },
};

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, isLoading, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/30 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Expense Details</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading expenses...</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No records match your filters</td></tr>
            ) : (
              expenses.map((expense) => {
                const config = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS['Other'];
                return (
                  <tr key={expense.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={cn('p-2.5 rounded-xl shrink-0 transition-colors group-hover:bg-white', config.bg, config.color)}>
                          {config.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{expense.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-500 font-medium">{expense.category}</span>
                              {expense.isRecurring && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Recurring</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{formatDate(expense.date)}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" 
                        className={cn(
                          "capitalize font-normal border-0 px-2.5 py-0.5", 
                          expense.status === 'paid' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        )}>
                        {expense.status === 'pending' && <Clock className="w-3 h-3 mr-1.5 opacity-70" />}
                        {expense.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-gray-900">{formatCurrency(expense.amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(expense)}>
                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(expense.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};