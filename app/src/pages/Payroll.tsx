// import React, { useEffect, useState } from 'react';
// import {
//   Search,
//   Filter,
//   Download,
//   CheckCircle2,
//   XCircle,
//   Calendar,
//   Users,
//   Wallet,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Card, CardContent } from '@/components/ui/card';


// import { teamAPI } from '@/services/teamService'; 


// // Remove this line:
// // import { api } from '@/services/api';

// // Add this line:
// // import { teamAPI } from '@/services/teamService'; 

// // ... inside the component, replace api.getEmployees() with:
// // await teamAPI.getAll();




// import type { PayrollRecord, Department } from '@/types';
// import { formatCurrency } from '@/utils/formatters';
// import { DepartmentDistributionChart } from '@/components/dashboard/Charts';
// import type { ChartDataPoint } from '@/types';

// const Payroll: React.FC = () => {
//   const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
//   const [filteredPayroll, setFilteredPayroll] = useState<PayrollRecord[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'paid' | 'unpaid' | 'all'>('all');
//   const [deptFilter, setDeptFilter] = useState<Department | 'all'>('all');
//   const [summary, setSummary] = useState({ totalPaid: 0, totalUnpaid: 0, totalAmount: 0 });
//   const [deptDistribution, setDeptDistribution] = useState<ChartDataPoint[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     filterPayroll();
//   }, [searchQuery, statusFilter, deptFilter, payroll]);

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const [payrollData, summaryData, deptDist] = await Promise.all([
//         payrollAPI.getAll(),
//         payrollAPI.getSummary(),
//         teamAPI.getDepartmentDistribution(),
//       ]);
//       setPayroll(payrollData);
//       setFilteredPayroll(payrollData);
//       setSummary(summaryData);
//       setDeptDistribution(deptDist);
//     } catch (error) {
//       console.error('Error fetching payroll data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filterPayroll = () => {
//     let filtered = [...payroll];

//     if (searchQuery.trim()) {
//       filtered = filtered.filter(
//         (p) =>
//           p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           p.department.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter((p) => p.status === statusFilter);
//     }

//     if (deptFilter !== 'all') {
//       filtered = filtered.filter((p) => p.department === deptFilter);
//     }

//     setFilteredPayroll(filtered);
//   };

//   const getStatusBadge = (status: 'paid' | 'unpaid') => {
//     return status === 'paid' ? (
//       <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//         <CheckCircle2 className="w-3 h-3 mr-1" />
//         Paid
//       </Badge>
//     ) : (
//       <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
//         <XCircle className="w-3 h-3 mr-1" />
//         Unpaid
//       </Badge>
//     );
//   };

//   const departments: Department[] = [
//     'Graphic Designer',
//     'Web Developer',
//     'App Developer',
//     'Instructor',
//     'AI Engineer',
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
//           <p className="text-gray-500 mt-1">Manage employee salaries and payments</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline">
//             <Download className="w-4 h-4 mr-2" />
//             Export
//           </Button>
//           <Button className="bg-[#5d88c6] hover:bg-[#4a6fa5]">
//             Process Payroll
//           </Button>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-4 flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-[#5d88c6]/10 flex items-center justify-center">
//               <Wallet className="w-6 h-6 text-[#5d88c6]" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Payroll</p>
//               <p className="text-xl font-bold text-gray-900">
//                 {formatCurrency(summary.totalAmount)}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
//               <CheckCircle2 className="w-6 h-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Paid</p>
//               <p className="text-xl font-bold text-green-600">
//                 {formatCurrency(summary.totalPaid)}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
//               <XCircle className="w-6 h-6 text-yellow-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Pending</p>
//               <p className="text-xl font-bold text-yellow-600">
//                 {formatCurrency(summary.totalUnpaid)}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
//               <Users className="w-6 h-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Employees</p>
//               <p className="text-xl font-bold text-gray-900">{payroll.length}</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <DepartmentDistributionChart data={deptDistribution} />
//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Payroll Summary</h3>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                 <span className="text-gray-600">Total Base Salaries</span>
//                 <span className="font-semibold">
//                   {formatCurrency(payroll.reduce((sum, p) => sum + p.baseSalary, 0))}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                 <span className="text-gray-600">Total Bonuses</span>
//                 <span className="font-semibold text-green-600">
//                   {formatCurrency(payroll.reduce((sum, p) => sum + p.bonuses, 0))}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                 <span className="text-gray-600">Total Deductions</span>
//                 <span className="font-semibold text-red-600">
//                   {formatCurrency(payroll.reduce((sum, p) => sum + p.deductions + p.tax, 0))}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center p-3 bg-[#5d88c6]/10 rounded-lg">
//                 <span className="font-medium text-gray-900">Net Payroll</span>
//                 <span className="font-bold text-[#5d88c6]">
//                   {formatCurrency(payroll.reduce((sum, p) => sum + p.netSalary, 0))}
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col lg:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <Input
//             placeholder="Search employees..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'paid' | 'unpaid' | 'all')}>
//             <SelectTrigger className="w-[140px]">
//               <Filter className="w-4 h-4 mr-2" />
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="paid">Paid</SelectItem>
//               <SelectItem value="unpaid">Unpaid</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={deptFilter} onValueChange={(v) => setDeptFilter(v as Department | 'all')}>
//             <SelectTrigger className="w-[160px]">
//               <SelectValue placeholder="Department" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Departments</SelectItem>
//               {departments.map((dept) => (
//                 <SelectItem key={dept} value={dept}>
//                   {dept}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Payroll Table */}
//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Department</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Base Salary</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Bonuses</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Deductions</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Tax</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Net Salary</th>
//                 <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Status</th>
//                 <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Paid Date</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={9} className="px-4 py-8 text-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d88c6] mx-auto"></div>
//                   </td>
//                 </tr>
//               ) : filteredPayroll.length === 0 ? (
//                 <tr>
//                   <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
//                     No payroll records found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredPayroll.map((record) => (
//                   <tr key={record.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3">
//                       <p className="font-medium text-gray-900">{record.employeeName}</p>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-600">{record.department}</td>
//                     <td className="px-4 py-3 text-right font-medium text-gray-900">
//                       {formatCurrency(record.baseSalary)}
//                     </td>
//                     <td className="px-4 py-3 text-right text-green-600">
//                       +{formatCurrency(record.bonuses)}
//                     </td>
//                     <td className="px-4 py-3 text-right text-red-600">
//                       -{formatCurrency(record.deductions)}
//                     </td>
//                     <td className="px-4 py-3 text-right text-red-600">
//                       -{formatCurrency(record.tax)}
//                     </td>
//                     <td className="px-4 py-3 text-right font-bold text-gray-900">
//                       {formatCurrency(record.netSalary)}
//                     </td>
//                     <td className="px-4 py-3 text-center">{getStatusBadge(record.status)}</td>
//                     <td className="px-4 py-3 text-center text-sm text-gray-500">
//                       {record.paidDate ? (
//                         <span className="flex items-center justify-center gap-1">
//                           <Calendar className="w-3 h-3" />
//                           {record.paidDate}
//                         </span>
//                       ) : (
//                         '-'
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payroll;






















/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

// Services
import { teamAPI } from '@/services/teamService'; 
import { payrollAPI } from '@/services/payrollService'; // Added this

import type { PayrollRecord } from '@/types'; // Ensure Department is in types if needed, or string
import { formatCurrency } from '@/utils/formatters';
import { DepartmentDistributionChart } from '@/components/dashboard/Charts';
import type { ChartDataPoint } from '@/types';

// Define Department locally if not exported, or import from types if available
type Department = 'Graphic Designer' | 'Web Developer' | 'App Developer' | 'Instructor' | 'AI Engineer' | 'Management' | 'Other';

const Payroll: React.FC = () => {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [filteredPayroll, setFilteredPayroll] = useState<PayrollRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'paid' | 'unpaid' | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState<Department | 'all'>('all');
  const [summary, setSummary] = useState({ totalPaid: 0, totalUnpaid: 0, totalAmount: 0 });
  const [deptDistribution, setDeptDistribution] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Fixed Dependency Array
  useEffect(() => {
    filterPayroll();
  }, [searchQuery, statusFilter, deptFilter, payroll]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [payrollData, summaryData, deptDist] = await Promise.all([
        payrollAPI.getAll(),
        payrollAPI.getSummary(),
        teamAPI.getDepartmentDistribution(),
      ]);
      setPayroll(payrollData);
      setFilteredPayroll(payrollData);
      setSummary(summaryData);
      setDeptDistribution(deptDist);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPayroll = () => {
    let filtered = [...payroll];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (deptFilter !== 'all') {
      filtered = filtered.filter((p) => p.department === deptFilter);
    }

    setFilteredPayroll(filtered);
  };

  const getStatusBadge = (status: 'paid' | 'unpaid') => {
    return status === 'paid' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Paid
      </Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <XCircle className="w-3 h-3 mr-1" />
        Unpaid
      </Badge>
    );
  };

  const departments: Department[] = [
    'Graphic Designer',
    'Web Developer',
    'App Developer',
    'Instructor',
    'AI Engineer',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-500 mt-1">Manage employee salaries and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-[#5d88c6] hover:bg-[#4a6fa5]">
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5d88c6]/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-[#5d88c6]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Payroll</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(summary.totalAmount)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(summary.totalPaid)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {formatCurrency(summary.totalUnpaid)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Employees</p>
              <p className="text-xl font-bold text-gray-900">{payroll.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentDistributionChart data={deptDistribution} />
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payroll Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Base Salaries</span>
                <span className="font-semibold">
                  {formatCurrency(payroll.reduce((sum, p) => sum + p.baseSalary, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Bonuses</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(payroll.reduce((sum, p) => sum + p.bonuses, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Deductions</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(payroll.reduce((sum, p) => sum + p.deductions + p.tax, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#5d88c6]/10 rounded-lg">
                <span className="font-medium text-gray-900">Net Payroll</span>
                <span className="font-bold text-[#5d88c6]">
                  {formatCurrency(payroll.reduce((sum, p) => sum + p.netSalary, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'paid' | 'unpaid' | 'all')}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={deptFilter} onValueChange={(v) => setDeptFilter(v as Department | 'all')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Base Salary</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Bonuses</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Deductions</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Tax</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Net Salary</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Paid Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d88c6] mx-auto"></div>
                  </td>
                </tr>
              ) : filteredPayroll.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No payroll records found
                  </td>
                </tr>
              ) : (
                filteredPayroll.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{record.employeeName}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.department}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(record.baseSalary)}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600">
                      +{formatCurrency(record.bonuses)}
                    </td>
                    <td className="px-4 py-3 text-right text-red-600">
                      -{formatCurrency(record.deductions)}
                    </td>
                    <td className="px-4 py-3 text-right text-red-600">
                      -{formatCurrency(record.tax)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {formatCurrency(record.netSalary)}
                    </td>
                    <td className="px-4 py-3 text-center">{getStatusBadge(record.status)}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500">
                      {record.paidDate ? (
                        <span className="flex items-center justify-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {record.paidDate}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;