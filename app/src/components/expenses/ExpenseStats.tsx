/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Wallet, ArrowDownCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ExpenseStatsProps {
  budget: number;       
  totalSpent: number;   
  pending: number;
  pendingCount: number;
}

export const ExpenseStats: React.FC<ExpenseStatsProps> = ({ budget, totalSpent, pending, pendingCount }) => {
  const remaining = budget - totalSpent;
  const percentageSpent = budget > 0 ? (totalSpent / budget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      
      {/* 1. Budget & Balance Card */}
      <Card className="shadow-sm border-blue-100 bg-blue-50/30">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Available Funds</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(remaining)}</h3>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>{formatCurrency(totalSpent)} Spent</span>
              <span>{formatCurrency(budget)} Total Budget</span>
            </div>
            
            {/* FIXED: Custom Progress Bar to avoid TS errors and ensure color application */}
            <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-600 transition-all duration-500 ease-in-out" 
                    style={{ width: `${Math.min(percentageSpent, 100)}%` }} 
                />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Spent Card */}
      <StatCard 
        icon={ArrowDownCircle} 
        bg="bg-red-50" color="text-red-600" border="border-red-100"
        title="Total Expenses" 
        value={formatCurrency(totalSpent)}
        subtext="Lifetime spend"
      />

      {/* 3. Pending Card */}
      <StatCard 
        icon={AlertCircle} 
        bg="bg-amber-50" color="text-amber-600" border="border-amber-100"
        title="Pending Bills" 
        value={formatCurrency(pending)} 
        subtext={`${pendingCount} unpaid invoices`}
      />
    </div>
  );
};

// Helper Sub-component
const StatCard = ({ icon: Icon, color, bg, border, title, value, subtext }: any) => (
  <Card className={cn("shadow-sm transition-all hover:shadow-md border", border)}>
    <CardContent className="p-5 flex items-center gap-4">
      <div className={cn("p-3 rounded-xl", bg, color)}><Icon className="w-5 h-5" /></div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtext && <p className="text-[11px] text-gray-400 mt-1 font-medium">{subtext}</p>}
      </div>
    </CardContent>
  </Card>
);