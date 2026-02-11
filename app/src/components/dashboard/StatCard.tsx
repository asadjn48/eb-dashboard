// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { formatCurrency, formatNumber } from '@/utils/formatters';
// import { cn } from '@/lib/utils';

// interface StatCardProps {
//   title: string;
//   value: number;
//   maxValue?: number; // Needed to calculate progress %
//   subtitle?: string;
//   format?: 'currency' | 'percentage' | 'number';
//   variant?: 'default' | 'success' | 'warning' | 'danger';
//   className?: string;
// }

// const StatCard: React.FC<StatCardProps> = ({
//   title,
//   value,
//   maxValue,
//   subtitle,
//   format = 'currency',
//   variant = 'default',
//   className,
// }) => {
  
//   const formatValue = (val: number): string => {
//     switch (format) {
//       case 'currency': return formatCurrency(val);
//       case 'percentage': return `${val.toFixed(1)}%`;
//       case 'number': default: return formatNumber(val);
//     }
//   };

//   // Calculate percentage safely
//   const percentage = maxValue ? Math.min((value / maxValue) * 100, 100) : 0;

//   // Progress Bar Colors
//   const colorMap = {
//     default: 'bg-blue-600',
//     success: 'bg-emerald-500',
//     warning: 'bg-amber-500',
//     danger: 'bg-red-500',
//   };

//   return (
//     <Card className={cn('shadow-sm hover:shadow-md transition-all border-gray-100 h-full', className)}>
//       <CardContent className="p-5 flex flex-col justify-between h-full">
        
//         <div className="space-y-1 mb-4">
//           <div className="flex justify-between items-start">
//             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
//             {/* Optional badge/icon could go here */}
//           </div>
//           <div className="flex items-baseline gap-2">
//             <h4 className="text-xl font-bold text-gray-900">
//               {formatValue(value)}
//             </h4>
//             {maxValue && format === 'currency' && (
//               <span className="text-xs text-gray-400 font-medium">
//                 / {formatCurrency(maxValue)}
//               </span>
//             )}
//           </div>
//           {subtitle && (
//             <p className="text-xs text-gray-500">{subtitle}</p>
//           )}
//         </div>

//         {/* Progress Bar Section */}
//         {maxValue && (
//           <div className="space-y-1.5">
//             <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
//                 <div 
//                     className={cn("h-full rounded-full transition-all duration-500", colorMap[variant])} 
//                     style={{ width: `${percentage}%` }} 
//                 />
//             </div>
//             <div className="flex justify-between text-[10px] font-medium text-gray-400">
//               <span>0%</span>
//               <span className={cn(
//                   variant === 'danger' ? 'text-red-600' : 
//                   variant === 'success' ? 'text-emerald-600' : 
//                   'text-gray-600'
//               )}>
//                 {percentage.toFixed(0)}% Utilized
//               </span>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default StatCard;




















import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency, formatCompactNumber } from '@/utils/formatters';

// REMOVED: import { Progress } from '@/components/ui/progress';

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