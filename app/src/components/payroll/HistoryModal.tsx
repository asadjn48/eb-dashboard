import { Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import type { PayrollRecord } from '@/types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  records: PayrollRecord[];
  onDelete: (id: string) => void;
}

export const HistoryModal = ({ isOpen, onClose, employeeName, records, onDelete }: HistoryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0 flex flex-row items-center justify-between">
          <DialogTitle>Salary History: <span className="text-slate-600">{employeeName}</span></DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8"><X className="w-4 h-4"/></Button>
        </DialogHeader>
        
        <div className="overflow-y-auto p-6">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Month</th>
                  <th className="px-4 py-3 text-right">Base</th>
                  <th className="px-4 py-3 text-right text-emerald-600">Bonuses</th>
                  <th className="px-4 py-3 text-right text-red-600">Deductions</th>
                  <th className="px-4 py-3 text-right font-bold">Net Paid</th>
                  <th className="px-4 py-3 text-center">Method</th>
                  <th className="px-4 py-3 text-center">Paid Date</th>
                  <th className="px-4 py-3 text-right rounded-r-lg">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {records.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-400">No payment history found.</td></tr>
                ) : (
                  records.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.month}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{formatCurrency(r.baseSalary)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600">+{formatCurrency(r.bonuses)}</td>
                      <td className="px-4 py-3 text-right text-red-600">-{formatCurrency(r.deductions + r.tax)}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(r.netSalary)}</td>
                      <td className="px-4 py-3 text-center"><Badge variant="outline" className="capitalize text-[10px]">{r.method}</Badge></td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">{r.paidDate}</td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-gray-300 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                             if(confirm("Delete this payment record? This cannot be undone.")) onDelete(r.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
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