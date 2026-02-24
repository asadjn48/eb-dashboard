/* eslint-disable prefer-const */
// /* eslint-disable react-hooks/static-components */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   Area,
//   AreaChart,
// } from 'recharts';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { formatCurrency, formatCompactNumber } from '@/utils/formatters';
// import type { ChartDataPoint, MonthlyFinancialData } from '@/types';

// // Theme Colors (Matches your Settings Primary Color #5d88c6)
// const COLORS = ['#5d88c6', '#4a6fa5', '#3d5a87', '#2f4669', '#10b981', '#f59e0b', '#ef4444'];

// // --- 1. Income vs Expenses Area Chart ---
// interface IncomeExpenseChartProps {
//   data: MonthlyFinancialData[];
// }

// export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl text-xs">
//           <p className="font-bold text-gray-900 mb-2">{label}</p>
//           {payload.map((entry: any, index: number) => (
//             <div key={index} className="flex items-center gap-2 mb-1">
//               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
//               <span className="text-gray-600 capitalize">{entry.name}:</span>
//               <span className="font-semibold">{formatCurrency(entry.value)}</span>
//             </div>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <Card className="h-full shadow-sm border-gray-100">
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold text-gray-800">Monthly Income vs Expenses</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//             <defs>
//               <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#5d88c6" stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="#5d88c6" stopOpacity={0} />
//               </linearGradient>
//               <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//             <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
//             <YAxis
//               stroke="#9ca3af"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={(value) => formatCompactNumber(value)}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend verticalAlign="top" height={36} iconType="circle" />
//             <Area
//               type="monotone"
//               dataKey="income"
//               name="Income"
//               stroke="#5d88c6"
//               fillOpacity={1}
//               fill="url(#colorIncome)"
//               strokeWidth={2}
//             />
//             <Area
//               type="monotone"
//               dataKey="expenses"
//               name="Expenses"
//               stroke="#ef4444"
//               fillOpacity={1}
//               fill="url(#colorExpenses)"
//               strokeWidth={2}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };

// // --- 2. Expense Distribution Pie Chart (Fixed Responsiveness) ---
// interface ExpenseDistributionChartProps {
//   data: ChartDataPoint[];
// }

// export const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({ data }) => {
//   const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       const entry = payload[0];
//       return (
//         <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl text-xs">
//           <div className="flex items-center gap-2 mb-1">
//              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.payload.fill }} />
//              <p className="font-bold text-gray-900">{entry.name}</p>
//           </div>
//           <p className="text-gray-600 mb-1">{formatCurrency(entry.value)}</p>
//           <p className="text-gray-400">
//             {((entry.value / (entry.payload.total || 1)) * 100).toFixed(1)}% of total
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Calculate total for percentage in tooltip
//   const totalValue = data.reduce((sum, d) => sum + d.value, 0);
//   const dataWithTotal = data.map(item => ({ ...item, total: totalValue }));

//   if (data.length === 0) {
//       return (
//         <div className="h-[300px] w-full flex flex-col items-center justify-center text-gray-400">
//             <div className="w-16 h-16 bg-gray-100 rounded-full mb-2" />
//             <p>No expense data</p>
//         </div>
//       );
//   }

//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <PieChart>
//         <Pie
//           data={dataWithTotal}
//           cx="50%"
//           cy="50%"
//           innerRadius="60%" // Responsive percentage
//           outerRadius="80%" // Responsive percentage
//           paddingAngle={5}
//           dataKey="value"
//         >
//           {dataWithTotal.map((_entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth={2} />
//           ))}
//         </Pie>
//         <Tooltip content={<CustomTooltip />} />
//         <Legend 
//             verticalAlign="bottom" 
//             height={36} 
//             iconType="circle"
//             formatter={(value) => <span className="text-xs text-gray-500 ml-1">{value}</span>}
//         />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// // --- 3. Profit Trend Line Chart ---
// interface ProfitTrendChartProps {
//   data: MonthlyFinancialData[];
// }

// export const ProfitTrendChart: React.FC<ProfitTrendChartProps> = ({ data }) => {
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl text-xs">
//           <p className="font-bold text-gray-900 mb-1">{label}</p>
//           <p className="text-emerald-600 font-semibold">
//             Profit: {formatCurrency(payload[0].value)}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <Card className="h-full shadow-sm border-gray-100">
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold text-gray-800">Profit Trend</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//             <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
//             <YAxis
//               stroke="#9ca3af"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={(value) => formatCompactNumber(value)}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Line
//               type="monotone"
//               dataKey="profit"
//               name="Net Profit"
//               stroke="#10b981"
//               strokeWidth={3}
//               dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
//               activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };

// // --- 4. Department Distribution Bar Chart ---
// interface DepartmentDistributionChartProps {
//   data: ChartDataPoint[];
// }

// export const DepartmentDistributionChart: React.FC<DepartmentDistributionChartProps> = ({ data }) => {
//   const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       const entry = payload[0];
//       return (
//         <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl text-xs">
//           <p className="font-bold text-gray-900 mb-1">{entry.payload.name}</p>
//           <p className="text-gray-600">
//             {entry.value} Employees
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <Card className="h-full shadow-sm border-gray-100">
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold text-gray-800">Team by Department</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
//             <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
//             <YAxis
//               type="category"
//               dataKey="name"
//               stroke="#6b7280"
//               fontSize={12}
//               width={100}
//               tickLine={false}
//               axisLine={false}
//             />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
//             <Bar dataKey="value" name="Employees" fill="#5d88c6" radius={[0, 4, 4, 0]} barSize={20} />
//           </BarChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };

// // --- 5. Top Projects Bar Chart ---
// interface TopProjectsChartProps {
//   data: { name: string; profit: number }[];
// }

// export const TopProjectsChart: React.FC<TopProjectsChartProps> = ({ data }) => {
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl text-xs">
//           <p className="font-bold text-gray-900 mb-1">{label}</p>
//           <p className="text-emerald-600 font-semibold">
//             Profit: {formatCurrency(payload[0].value)}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <Card className="h-full shadow-sm border-gray-100">
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold text-gray-800">Top Profitable Projects</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//             <XAxis 
//                 dataKey="name" 
//                 stroke="#9ca3af" 
//                 fontSize={11} 
//                 tickLine={false} 
//                 axisLine={false}
//                 interval={0}
//                 tick={{ dy: 10 }}
//             />
//             <YAxis
//               stroke="#9ca3af"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={(value) => formatCompactNumber(value)}
//             />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
//             <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
//           </BarChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };



























/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatCompactNumber } from '@/utils/formatters';
import type { ChartDataPoint, MonthlyFinancialData } from '@/types';
import { cn } from '@/lib/utils';

// --- Theme Colors ---
const PRIMARY_COLOR = '#5d88c6';
const DANGER_COLOR = '#ef4444';
const SUCCESS_COLOR = '#10b981';

const PIE_COLORS = [
  '#5d88c6', '#3b82f6', '#0ea5e9', '#0284c7', 
  '#0d9488', '#0891b2', '#0369a1', '#1d4ed8'
];

// --- Smart Date Filter Logic ---
// This safely compares full dates (2026-01-01) OR simple month names ("Jan", "Feb")
const isWithinDateRange = (itemDateStr: string | undefined, start: string, end: string) => {
  if (!itemDateStr) return true; // Pass through if data has no date field
  if (!start && !end) return true;

  const s = start ? new Date(start).getTime() : -Infinity;
  const e = end ? new Date(end).getTime() + 86399999 : Infinity; // Include end of day

  const itemStr = itemDateStr.toLowerCase();
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const monthIdx = months.findIndex(m => itemStr.startsWith(m));

  if (monthIdx !== -1) {
    // If data is just "Jan", compare by month index
    const startMonth = start ? new Date(start).getMonth() : 0;
    const endMonth = end ? new Date(end).getMonth() : 11;
    return monthIdx >= startMonth && monthIdx <= endMonth;
  }

  // If data is a full date string
  const itemTime = new Date(itemDateStr).getTime();
  if (!isNaN(itemTime)) {
    return itemTime >= s && itemTime <= e;
  }

  return true; // Fallback
};

// --- Shared Glassmorphism Tooltip ---
const GlassTooltip = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white/95 backdrop-blur-md p-3.5 border border-slate-200/60 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-xs min-w-[150px] z-50">
    {children}
  </div>
);

// --- Shared Unified Filter Header ---
const ChartHeader = ({ title, startDate, endDate, setStartDate, setEndDate, extraFilter }: any) => (
  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4 shrink-0">
    <CardTitle className="text-base font-bold text-slate-800 tracking-tight">{title}</CardTitle>
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
        <Input 
          type="month" // "month" is much better UX for financial tracking than selecting specific days
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="h-7 w-[120px] text-xs bg-transparent border-0 focus-visible:ring-0 shadow-none" 
          title="Start Month"
        />
        <span className="text-slate-400 text-xs font-semibold px-1">to</span>
        <Input 
          type="month" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="h-7 w-[120px] text-xs bg-transparent border-0 focus-visible:ring-0 shadow-none" 
          title="End Month"
        />
      </div>
      {extraFilter && extraFilter}
    </div>
  </CardHeader>
);


// ==========================================
// 1. UNIQUE Income vs Expenses Composed Chart
// ==========================================
interface IncomeExpenseChartProps { data: MonthlyFinancialData[]; }

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item => isWithinDateRange(item.month, startDate, endDate));
  }, [data, startDate, endDate]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <GlassTooltip>
          <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1.5 uppercase tracking-wider">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 mb-1.5 last:mb-0">
              <div className="flex items-center gap-2">
                <div className={cn("w-2.5 h-2.5 shadow-sm", entry.name === 'Income' ? 'rounded-sm' : 'rounded-full')} style={{ backgroundColor: entry.color }} />
                <span className="text-slate-500 font-medium">{entry.name}</span>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </GlassTooltip>
      );
    }
    return null;
  };

  return (
    <Card className="h-full shadow-sm border-slate-200/60 bg-white hover:shadow-md transition-shadow">
      <ChartHeader 
        title="Financial Overview" 
        startDate={startDate} endDate={endDate} 
        setStartDate={setStartDate} setEndDate={setEndDate} 
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PRIMARY_COLOR} stopOpacity={0.9} />
                <stop offset="100%" stopColor={PRIMARY_COLOR} stopOpacity={0.3} />
              </linearGradient>
              <filter id="expenseShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={DANGER_COLOR} floodOpacity="0.4" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatCompactNumber} dx={-10} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }} />
            
            <Bar dataKey="income" name="Income" fill="url(#barIncome)" radius={[6, 6, 0, 0]} barSize={36} animationDuration={1000} />
            <Line type="monotone" dataKey="expenses" name="Expenses" stroke={DANGER_COLOR} strokeWidth={3.5} filter="url(#expenseShadow)" dot={{ fill: 'white', strokeWidth: 2, r: 4, stroke: DANGER_COLOR }} activeDot={{ r: 7, stroke: 'white', strokeWidth: 2, fill: DANGER_COLOR }} animationDuration={1000} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ==========================================
// 2. Expense Distribution Pie Chart
// ==========================================
interface ExpenseDistributionChartProps { data: ChartDataPoint[]; }

export const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({ data }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [limit, setLimit] = useState('5');

  const filteredData = useMemo(() => {
    // 1. Filter by Date (Requires parent to pass `date` or `month` field inside ChartDataPoint)
    let processed = data.filter((item: any) => isWithinDateRange(item.date || item.month, startDate, endDate));
    
    // 2. Sort & Limit
    processed = processed.sort((a, b) => b.value - a.value);
    if (limit !== 'all') {
      const limitNum = parseInt(limit);
      const top = processed.slice(0, limitNum);
      const rest = processed.slice(limitNum);
      if (rest.length > 0) {
        top.push({ name: 'Others', value: rest.reduce((sum, item) => sum + item.value, 0) });
      }
      processed = top;
    }
    return processed;
  }, [data, startDate, endDate, limit]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const percent = ((entry.value / (entry.payload.total || 1)) * 100).toFixed(1);
      return (
        <GlassTooltip>
          <div className="flex items-center gap-2 mb-1.5">
             <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.payload.fill }} />
             <p className="font-bold text-slate-800">{entry.name}</p>
          </div>
          <div className="flex justify-between items-center gap-4 border-t border-slate-100 pt-1.5">
            <span className="font-bold text-slate-900">{formatCurrency(entry.value)}</span>
            <span className="text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded text-[10px]">{percent}%</span>
          </div>
        </GlassTooltip>
      );
    }
    return null;
  };

  const totalValue = filteredData.reduce((sum, d) => sum + d.value, 0);
  const dataWithTotal = filteredData.map(item => ({ ...item, total: totalValue }));

  const limitSelect = (
    <Select value={limit} onValueChange={setLimit}>
      <SelectTrigger className="h-9 w-[100px] text-xs bg-white border-slate-200 rounded-lg shadow-sm">
        <SelectValue placeholder="Show" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">Top 5</SelectItem>
        <SelectItem value="8">Top 8</SelectItem>
        <SelectItem value="all">All</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <Card className="h-full shadow-sm border-slate-200/60 bg-white hover:shadow-md transition-shadow flex flex-col">
      <ChartHeader 
        title="Categories" 
        startDate={startDate} endDate={endDate} 
        setStartDate={setStartDate} setEndDate={setEndDate}
        extraFilter={limitSelect}
      />
      <CardContent className="flex-1 min-h-0 pb-2">
        {filteredData.length === 0 ? (
           <div className="h-full w-full flex flex-col items-center justify-center text-slate-400">
               <div className="w-12 h-12 bg-slate-50 rounded-full mb-3 shadow-inner" />
               <p className="text-sm font-medium">No data in range</p>
           </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dataWithTotal} cx="50%" cy="45%" innerRadius="55%" outerRadius="80%" paddingAngle={4} dataKey="value" stroke="none">
                {dataWithTotal.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-xs font-medium text-slate-500 ml-1">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

// ==========================================
// 3. Profit Trend Area Chart
// ==========================================
interface ProfitTrendChartProps { data: MonthlyFinancialData[]; }

export const ProfitTrendChart: React.FC<ProfitTrendChartProps> = ({ data }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item => isWithinDateRange(item.month, startDate, endDate));
  }, [data, startDate, endDate]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPositive = payload[0].value >= 0;
      return (
        <GlassTooltip>
          <p className="font-bold text-slate-800 mb-1.5 border-b border-slate-100 pb-1">{label}</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium">Net Profit:</span>
            <span className={cn("font-bold text-[13px]", isPositive ? "text-emerald-600" : "text-rose-500")}>
              {formatCurrency(payload[0].value)}
            </span>
          </div>
        </GlassTooltip>
      );
    }
    return null;
  };

  return (
    <Card className="h-full shadow-sm border-slate-200/60 bg-white hover:shadow-md transition-shadow">
      <ChartHeader 
        title="Profit Trend" 
        startDate={startDate} endDate={endDate} 
        setStartDate={setStartDate} setEndDate={setEndDate} 
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SUCCESS_COLOR} stopOpacity={0.3} />
                <stop offset="95%" stopColor={SUCCESS_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatCompactNumber} dx={-10} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area type="monotone" dataKey="profit" name="Net Profit" stroke={SUCCESS_COLOR} fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0, fill: SUCCESS_COLOR }} animationDuration={1000} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ==========================================
// 4. Department Distribution Bar Chart
// ==========================================
// interface DepartmentDistributionChartProps { data: ChartDataPoint[]; }

// export const DepartmentDistributionChart: React.FC<DepartmentDistributionChartProps> = ({ data }) => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

//   const filteredData = useMemo(() => {
//     let processed = data.filter((item: any) => isWithinDateRange(item.date, startDate, endDate));
//     return processed.sort((a, b) => sortOrder === 'desc' ? b.value - a.value : a.value - b.value);
//   }, [data, startDate, endDate, sortOrder]);

//   const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       const entry = payload[0];
//       return (
//         <GlassTooltip>
//           <p className="font-bold text-slate-800 mb-1 border-b border-slate-100 pb-1">{entry.payload.name}</p>
//           <div className="flex justify-between gap-6 mt-1.5">
//              <span className="text-slate-500 font-medium">Headcount:</span>
//              <span className="font-bold text-slate-900">{entry.value}</span>
//           </div>
//         </GlassTooltip>
//       );
//     }
//     return null;
//   };

//   const sortSelect = (
//     <Select value={sortOrder} onValueChange={(v: any) => setSortOrder(v)}>
//       <SelectTrigger className="h-9 w-[110px] text-xs bg-white border-slate-200 rounded-lg shadow-sm">
//         <SelectValue placeholder="Sort" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="desc">Highest First</SelectItem>
//         <SelectItem value="asc">Lowest First</SelectItem>
//       </SelectContent>
//     </Select>
//   );

//   return (
//     <Card className="h-full shadow-sm border-slate-200/60 bg-white hover:shadow-md transition-shadow">
//       <ChartHeader 
//         title="Team Headcount" 
//         startDate={startDate} endDate={endDate} 
//         setStartDate={setStartDate} setEndDate={setEndDate}
//         extraFilter={sortSelect}
//       />
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={filteredData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
//             <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
//             <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
//             <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={85} tickLine={false} axisLine={false} />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
//             <Bar dataKey="value" name="Employees" fill={PRIMARY_COLOR} radius={[0, 6, 6, 0]} barSize={24} animationDuration={1000} />
//           </BarChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };










// ==========================================
// 4. SCALABLE Team Headcount (Hybrid List)
// ==========================================
interface DepartmentDistributionChartProps { data: ChartDataPoint[]; }

export const DepartmentDistributionChart: React.FC<DepartmentDistributionChartProps> = ({ data }) => {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Sort data directly without date filtering
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => sortOrder === 'desc' ? b.value - a.value : a.value - b.value);
  }, [data, sortOrder]);

  const totalEmployees = useMemo(() => sortedData.reduce((acc, curr) => acc + curr.value, 0), [sortedData]);

  return (
    <Card className="h-full w-full shadow-sm border-slate-200/60 bg-white hover:shadow-md transition-shadow flex flex-col min-h-[320px] rounded-2xl">
      
      {/* Clean Header without date inputs */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 shrink-0 border-b border-slate-100 bg-white">
        <CardTitle className="text-base font-bold text-slate-800 tracking-tight">Team Headcount</CardTitle>
        <Select value={sortOrder} onValueChange={(v: any) => setSortOrder(v)}>
          <SelectTrigger className="h-8 w-[110px] text-xs bg-slate-50 border-slate-200 rounded-lg shadow-sm focus:ring-0">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Highest First</SelectItem>
            <SelectItem value="asc">Lowest First</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* Scrollable body with no-scrollbar class applied */}
      <CardContent className="flex-1 min-h-0 p-5 overflow-y-auto no-scrollbar">
        {sortedData.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-slate-400">
             <div className="w-12 h-12 bg-slate-50 rounded-full mb-3 shadow-inner" />
             <p className="text-sm font-medium">No team data available</p>
          </div>
        ) : (
          <div className="space-y-5">
             {sortedData.map((dept, idx) => {
                const percent = totalEmployees > 0 ? (dept.value / totalEmployees) * 100 : 0;
                // Cycle through a vibrant palette for different departments
                const colors = ['bg-[#5d88c6]', 'bg-[#10b981]', 'bg-[#f59e0b]', 'bg-[#ef4444]', 'bg-[#8b5cf6]', 'bg-[#0ea5e9]', 'bg-[#ec4899]'];
                const barColor = colors[idx % colors.length];

                return (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-700 truncate pr-4">{dept.name}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold text-slate-400">{percent.toFixed(0)}%</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{dept.value}</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", barColor)} 
                        style={{ width: `${percent}%` }} 
                      />
                    </div>
                  </div>
                );
             })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};




// ==========================================
// 5. Top Projects Bar Chart
// ==========================================
interface TopProjectsChartProps { data: { name: string; profit: number; date?: string; startDate?: string }[]; }

export const TopProjectsChart: React.FC<TopProjectsChartProps> = ({ data }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [limit, setLimit] = useState('5');

  const filteredData = useMemo(() => {
    let processed = data.filter((item) => isWithinDateRange(item.date || item.startDate, startDate, endDate));
    processed = processed.sort((a, b) => b.profit - a.profit);
    if (limit !== 'all') return processed.slice(0, parseInt(limit));
    return processed;
  }, [data, startDate, endDate, limit]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <GlassTooltip>
          <p className="font-bold text-slate-800 mb-1.5 border-b border-slate-100 pb-1 truncate max-w-[200px]">{label}</p>
          <div className="flex justify-between gap-6">
             <span className="text-slate-500 font-medium">Profit:</span>
             <span className="font-bold text-emerald-600">{formatCurrency(payload[0].value)}</span>
          </div>
        </GlassTooltip>
      );
    }
    return null;
  };

  const limitSelect = (
    <Select value={limit} onValueChange={setLimit}>
      <SelectTrigger className="h-9 w-[100px] text-xs bg-white border-slate-200 rounded-lg shadow-sm">
        <SelectValue placeholder="Show" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="3">Top 3</SelectItem>
        <SelectItem value="5">Top 5</SelectItem>
        <SelectItem value="10">Top 10</SelectItem>
        <SelectItem value="all">All</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <Card className="h-full shadow-sm border-slate-200/60 bg-white hover:shadow-md transition-shadow">
      <ChartHeader 
        title="Top Projects" 
        startDate={startDate} endDate={endDate} 
        setStartDate={setStartDate} setEndDate={setEndDate}
        extraFilter={limitSelect}
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} interval={0} tick={{ dy: 10 }} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatCompactNumber} dx={-10} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="profit" name="Profit" fill={SUCCESS_COLOR} radius={[6, 6, 0, 0]} barSize={32} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};