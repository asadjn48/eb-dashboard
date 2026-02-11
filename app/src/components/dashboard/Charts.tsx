/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatCompactNumber } from '@/utils/formatters';
import type { ChartDataPoint, MonthlyFinancialData } from '@/types';

// Theme Colors (Matches your Settings Primary Color #5d88c6)
const COLORS = ['#5d88c6', '#4a6fa5', '#3d5a87', '#2f4669', '#10b981', '#f59e0b', '#ef4444'];

// --- 1. Income vs Expenses Area Chart ---
interface IncomeExpenseChartProps {
  data: MonthlyFinancialData[];
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl text-xs">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600 capitalize">{entry.name}:</span>
              <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full shadow-sm border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Monthly Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5d88c6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5d88c6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCompactNumber(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#5d88c6"
              fillOpacity={1}
              fill="url(#colorIncome)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorExpenses)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// --- 2. Expense Distribution Pie Chart (Fixed Responsiveness) ---
interface ExpenseDistributionChartProps {
  data: ChartDataPoint[];
}

export const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl text-xs">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.payload.fill }} />
             <p className="font-bold text-gray-900">{entry.name}</p>
          </div>
          <p className="text-gray-600 mb-1">{formatCurrency(entry.value)}</p>
          <p className="text-gray-400">
            {((entry.value / (entry.payload.total || 1)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total for percentage in tooltip
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total: totalValue }));

  if (data.length === 0) {
      return (
        <div className="h-[300px] w-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-2" />
            <p>No expense data</p>
        </div>
      );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={dataWithTotal}
          cx="50%"
          cy="50%"
          innerRadius="60%" // Responsive percentage
          outerRadius="80%" // Responsive percentage
          paddingAngle={5}
          dataKey="value"
        >
          {dataWithTotal.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-xs text-gray-500 ml-1">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// --- 3. Profit Trend Line Chart ---
interface ProfitTrendChartProps {
  data: MonthlyFinancialData[];
}

export const ProfitTrendChart: React.FC<ProfitTrendChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl text-xs">
          <p className="font-bold text-gray-900 mb-1">{label}</p>
          <p className="text-emerald-600 font-semibold">
            Profit: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full shadow-sm border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Profit Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCompactNumber(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="profit"
              name="Net Profit"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// --- 4. Department Distribution Bar Chart ---
interface DepartmentDistributionChartProps {
  data: ChartDataPoint[];
}

export const DepartmentDistributionChart: React.FC<DepartmentDistributionChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl text-xs">
          <p className="font-bold text-gray-900 mb-1">{entry.payload.name}</p>
          <p className="text-gray-600">
            {entry.value} Employees
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full shadow-sm border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Team by Department</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#6b7280"
              fontSize={12}
              width={100}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
            <Bar dataKey="value" name="Employees" fill="#5d88c6" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// --- 5. Top Projects Bar Chart ---
interface TopProjectsChartProps {
  data: { name: string; profit: number }[];
}

export const TopProjectsChart: React.FC<TopProjectsChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl text-xs">
          <p className="font-bold text-gray-900 mb-1">{label}</p>
          <p className="text-emerald-600 font-semibold">
            Profit: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full shadow-sm border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Top Profitable Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
                dataKey="name" 
                stroke="#9ca3af" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                interval={0}
                tick={{ dy: 10 }}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCompactNumber(value)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
            <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};