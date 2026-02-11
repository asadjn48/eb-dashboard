/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  maxValue?: number; // Needed to calculate progress %
  subtitle?: string;
  format?: 'currency' | 'percentage' | 'number';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  maxValue,
  subtitle,
  format = 'currency',
  variant = 'default',
  className,
}) => {
  
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency': return formatCurrency(val);
      case 'percentage': return `${val.toFixed(1)}%`;
      case 'number': default: return formatNumber(val);
    }
  };

  // Calculate percentage safely
  const percentage = maxValue ? Math.min((value / maxValue) * 100, 100) : 0;

  // Progress Bar Colors
  const colorMap = {
    default: 'bg-blue-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };

  return (
    <Card className={cn('shadow-sm hover:shadow-md transition-all border-gray-100 h-full', className)}>
      <CardContent className="p-5 flex flex-col justify-between h-full">
        
        <div className="space-y-1 mb-4">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
            {/* Optional badge/icon could go here */}
          </div>
          <div className="flex items-baseline gap-2">
            <h4 className="text-xl font-bold text-gray-900">
              {formatValue(value)}
            </h4>
            {maxValue && format === 'currency' && (
              <span className="text-xs text-gray-400 font-medium">
                / {formatCurrency(maxValue)}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>

        {/* Progress Bar Section */}
        {maxValue && (
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={cn("h-full rounded-full transition-all duration-500", colorMap[variant])} 
                    style={{ width: `${percentage}%` }} 
                />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-gray-400">
              <span>0%</span>
              <span className={cn(
                  variant === 'danger' ? 'text-red-600' : 
                  variant === 'success' ? 'text-emerald-600' : 
                  'text-gray-600'
              )}>
                {percentage.toFixed(0)}% Utilized
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;