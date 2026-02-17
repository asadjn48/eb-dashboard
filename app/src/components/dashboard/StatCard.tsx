
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency, formatCompactNumber } from '@/utils/formatters';


interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ElementType; // Made optional to fit dynamic usage
  maxValue?: number; // Optional now
  variant?: 'default' | 'success' | 'warning' | 'danger';
  subtitle?: string;
  format?: 'currency' | 'number' | 'percentage';
  currency?: string;
  // Added these to support the generic StatCard usage in Expenses
  bg?: string;
  color?: string;
  border?: string;
  subtext?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = 'default',
  subtitle,
  format = 'currency',
  currency = 'PKR',
  bg,
  color,
  subtext
}) => {
  
  const formatValue = (val: number) => {
    if (format === 'currency') return formatCurrency(val, currency);
    if (format === 'number') return formatCompactNumber(val);
    if (format === 'percentage') return `${val.toFixed(1)}%`;
    return val;
  };

  const getVariantStyles = () => {
    // If manual colors are passed (like in Expenses page), use them
    if (bg && color) return { bg, text: color };

    switch (variant) {
      case 'success': return { bg: 'bg-emerald-50', text: 'text-emerald-700' };
      case 'warning': return { bg: 'bg-amber-50', text: 'text-amber-700' };
      case 'danger': return { bg: 'bg-red-50', text: 'text-red-700' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700' };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className="shadow-sm">
      <CardContent className="p-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1 tracking-tight">{formatValue(value)}</h3>
          {(subtitle || subtext) && (
            <p className={cn("text-xs mt-1 font-medium", styles.text)}>
              {subtitle || subtext}
            </p>
          )}
        </div>
        
        {Icon && (
           <div className={cn("p-2 rounded-lg", styles.bg, styles.text)}>
             <Icon className="w-5 h-5" />
           </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;