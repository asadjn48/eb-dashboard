/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatNumber, formatCompactNumber } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  format?: 'currency' | 'number' | 'compact';
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  format = 'currency',
  className,
}) => {
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency': return formatCurrency(val);
      case 'compact': return formatCompactNumber(val);
      case 'number': default: return formatNumber(val);
    }
  };

  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;
  const isNeutral = !trend || trend === 0;

  // Dynamic colors based on trend logic
  const trendColor = isPositive ? 'text-emerald-600' : isNegative ? 'text-red-600' : 'text-gray-500';
  const iconBg = isPositive ? 'bg-emerald-50 text-emerald-600' : isNegative ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600';

  return (
    <Card className={cn('shadow-sm hover:shadow-md transition-all border-gray-100', className)}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              {formatValue(value)}
            </h3>
          </div>
          <div className={cn("p-2.5 rounded-xl", iconBg)}>
            {icon}
          </div>
        </div>

        {/* Trend Footer */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
          <div className={cn("flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-opacity-10", 
            isPositive ? "bg-emerald-100 text-emerald-700" : isNegative ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
          )}>
            {isPositive && <TrendingUp className="w-3 h-3 mr-1" />}
            {isNegative && <TrendingDown className="w-3 h-3 mr-1" />}
            {isNeutral && <Minus className="w-3 h-3 mr-1" />}
            {Math.abs(trend || 0)}%
          </div>
          {trendLabel && (
            <span className="text-xs text-gray-400 font-medium">{trendLabel}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;