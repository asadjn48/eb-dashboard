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