/* eslint-disable @typescript-eslint/no-explicit-any */


import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { Printer, AlertCircle } from 'lucide-react';

export const PayslipModal = ({ isOpen, onClose, record }: any) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white">
         
         {!record ? (
            <div className="p-8 text-center text-gray-500">
               <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
               <p>No receipt data found.</p>
               <Button variant="ghost" onClick={onClose} className="mt-4">Close</Button>
            </div>
         ) : (
            <>
               <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-slate-50/50">
                  <div>
                     <h2 className="text-lg font-bold text-gray-900">Payslip Receipt</h2>
                     <p className="text-xs text-gray-500 uppercase tracking-wider">{record.month} • {record.id.slice(0,6)}</p>
                  </div>
                  <div className="bg-white p-2 rounded shadow-sm border border-gray-100">
                     {/* Replace with your logo if available */}
                     <span className="font-bold text-lg text-slate-800">EB</span>
                  </div>
               </div>
               
               <div className="p-6 space-y-6">
                  <div className="text-center">
                     <p className="text-sm text-gray-500">Net Amount Paid</p>
                     <h1 className="text-3xl font-bold text-gray-900">{formatCurrency(record.netSalary)}</h1>
                     <span className="inline-block mt-2 px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                        Paid via {record.method}
                     </span>
                  </div>

                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Employee</span>
                        <span className="font-medium text-gray-900">{record.employeeName}</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Department</span>
                        <span className="font-medium text-gray-900">{record.department}</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Paid Date</span>
                        <span className="font-medium text-gray-900">{new Date(record.paidDate).toLocaleDateString()}</span>
                     </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded text-xs space-y-2">
                     <div className="flex justify-between"><span>Base Salary</span> <span>{formatCurrency(record.baseSalary)}</span></div>
                     <div className="flex justify-between text-green-600"><span>Bonus</span> <span>+{formatCurrency(record.bonuses || 0)}</span></div>
                     <div className="flex justify-between text-red-600"><span>Deductions</span> <span>-{formatCurrency((record.deductions || 0) + (record.tax || 0))}</span></div>
                  </div>
               </div>

               <div className="p-4 bg-gray-50 flex gap-3">
                  <Button variant="outline" className="flex-1 bg-white" onClick={onClose}>Close</Button>
                  <Button className="flex-1 bg-slate-900 text-white" onClick={() => window.print()}>
                     <Printer className="w-4 h-4 mr-2" /> Print
                  </Button>
               </div>
            </>
         )}
      </DialogContent>
    </Dialog>
  );
};