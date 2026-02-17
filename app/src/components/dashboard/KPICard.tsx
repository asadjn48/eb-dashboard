// /* eslint-disable @typescript-eslint/no-unused-vars */


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency, formatCompactNumber } from '@/utils/formatters';

interface KPICardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  format?: 'currency' | 'number' | 'percentage';
  color?: 'emerald' | 'amber' | 'rose' | 'lime' | 'sky' | 'slate'; // The 6 Soft Palette colors
}

const colorStyles = {
  emerald: { bg: 'bg-[#10B981]', text: 'text-white', sub: 'text-emerald-50' },
  amber:   { bg: 'bg-[#F59E0B]', text: 'text-white', sub: 'text-amber-50' },
  rose:    { bg: 'bg-[#F43F5E]', text: 'text-white', sub: 'text-rose-50' },
  lime:    { bg: 'bg-[#84CC16]', text: 'text-white', sub: 'text-lime-50' },
  sky:     { bg: 'bg-[#0EA5E9]', text: 'text-white', sub: 'text-sky-50' },
  slate:   { bg: 'bg-[#1E293B]', text: 'text-white', sub: 'text-slate-300' },
};

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  icon, 
  format = 'number',
  color = 'slate'
}) => {
  const styles = colorStyles[color];

  const formatValue = (val: number) => {
    if (format === 'currency') return formatCurrency(val);
    if (format === 'number') return formatCompactNumber(val);
    if (format === 'percentage') return `${val.toFixed(1)}%`;
    return val;
  };

  return (
    <Card className={cn("border-0 shadow-md overflow-hidden", styles.bg)}>
      <CardContent className="p-4 flex flex-col justify-between h-[100px]">
        
        {/* Top Row: Title + Icon */}
        <div className="flex justify-between items-start">
          <p className={cn("text-sm font-medium opacity-90", styles.sub)}>{title}</p>
          {icon && <div className={cn("p-1.5 rounded-md bg-white/20 text-white")}>{icon}</div>}
        </div>

        {/* Bottom Row: Value */}
        <div>
          <h3 className={cn("text-2xl font-bold tracking-tight", styles.text)}>
            {formatValue(value)}
          </h3>
        </div>

      </CardContent>
    </Card>
  );
};

export default KPICard;