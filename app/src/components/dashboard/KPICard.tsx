// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React from 'react';
// import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { formatCurrency, formatNumber, formatCompactNumber } from '@/utils/formatters';
// import { cn } from '@/lib/utils';

// interface KPICardProps {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
//   trend?: number;
//   trendLabel?: string;
//   format?: 'currency' | 'number' | 'compact';
//   className?: string;
// }

// const KPICard: React.FC<KPICardProps> = ({
//   title,
//   value,
//   icon,
//   trend,
//   trendLabel,
//   format = 'currency',
//   className,
// }) => {
//   const formatValue = (val: number): string => {
//     switch (format) {
//       case 'currency': return formatCurrency(val);
//       case 'compact': return formatCompactNumber(val);
//       case 'number': default: return formatNumber(val);
//     }
//   };

//   const isPositive = trend && trend > 0;
//   const isNegative = trend && trend < 0;
//   const isNeutral = !trend || trend === 0;

//   // Dynamic colors based on trend logic
//   const trendColor = isPositive ? 'text-emerald-600' : isNegative ? 'text-red-600' : 'text-gray-500';
//   const iconBg = isPositive ? 'bg-emerald-50 text-emerald-600' : isNegative ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600';

//   return (
//     <Card className={cn('shadow-sm hover:shadow-md transition-all border-gray-100', className)}>
//       <CardContent className="p-5">
//         <div className="flex justify-between items-start">
//           <div className="space-y-1">
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
//               {formatValue(value)}
//             </h3>
//           </div>
//           <div className={cn("p-2.5 rounded-xl", iconBg)}>
//             {icon}
//           </div>
//         </div>

//         {/* Trend Footer */}
//         <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
//           <div className={cn("flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-opacity-10", 
//             isPositive ? "bg-emerald-100 text-emerald-700" : isNegative ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
//           )}>
//             {isPositive && <TrendingUp className="w-3 h-3 mr-1" />}
//             {isNegative && <TrendingDown className="w-3 h-3 mr-1" />}
//             {isNeutral && <Minus className="w-3 h-3 mr-1" />}
//             {Math.abs(trend || 0)}%
//           </div>
//           {trendLabel && (
//             <span className="text-xs text-gray-400 font-medium">{trendLabel}</span>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default KPICard;













// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { formatCurrency, formatCompactNumber } from '@/utils/formatters';

// interface KPICardProps {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
//   trend?: number;
//   trendLabel?: string;
//   format?: 'currency' | 'number' | 'percentage';
//   currency?: string;
// }

// const KPICard: React.FC<KPICardProps> = ({ 
//   title, 
//   value, 
//   icon, 
//   trend, 
//   trendLabel,
//   format = 'currency',
//   currency = 'PKR'
// }) => {
//   const isPositive = trend && trend > 0;
//   const isNeutral = !trend || trend === 0;

//   // REMOVED: const trendColor = ... (This was the error)

//   const formatValue = (val: number) => {
//     if (format === 'currency') return formatCurrency(val, currency);
//     if (format === 'number') return formatCompactNumber(val);
//     if (format === 'percentage') return `${val.toFixed(1)}%`;
//     return val;
//   };

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between space-x-4">
//           <div className="flex items-center space-x-2">
//             <div className="p-2 bg-primary/10 rounded-full text-primary">
//               {icon}
//             </div>
//             <p className="text-sm font-medium text-muted-foreground">{title}</p>
//           </div>
//           {trend !== undefined && (
//             <div className={cn(
//               "flex items-center text-xs font-medium px-2 py-1 rounded-full",
//               isPositive ? "text-emerald-700 bg-emerald-50" : 
//               isNeutral ? "text-gray-600 bg-gray-100" : "text-red-700 bg-red-50"
//             )}>
//               {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : 
//                isNeutral ? <Minus className="w-3 h-3 mr-1" /> : 
//                <ArrowDownRight className="w-3 h-3 mr-1" />}
//               {Math.abs(trend).toFixed(1)}%
//             </div>
//           )}
//         </div>
//         <div className="mt-4">
//           <h3 className="text-2xl font-bold tracking-tight">{formatValue(value)}</h3>
//           {trendLabel && (
//             <p className="text-xs text-muted-foreground mt-1">
//               {trendLabel}
//             </p>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default KPICard;






















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