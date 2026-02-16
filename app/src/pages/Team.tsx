

































// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Search, Filter, UserPlus,
//   Users, DollarSign, UserCheck, Clock,
//   Building2, Eye, Pencil, Trash2, Calendar
// } from 'lucide-react';

// // UI Components
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// // Services & Utils
// import { teamAPI } from '@/services/teamService';
// import type { Employee } from '@/types';
// import { formatCurrency, getInitials } from '@/utils/formatters';
// import { cn } from '@/lib/utils';

// // --- Helper Functions ---

// const formatDateJoined = (dateString: string) => {
//   if (!dateString) return { date: 'N/A', relative: '' };
//   const date = new Date(dateString);
//   const now = new Date();
  
//   // Format: "Jan 2024"
//   const formattedDate = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  
//   // Calc Relative: "2 months ago"
//   const diffTime = Math.abs(now.getTime() - date.getTime());
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   let relative = '';
  
//   if (diffDays < 30) relative = `${diffDays} days ago`;
//   else if (diffDays < 365) relative = `${Math.floor(diffDays / 30)} months ago`;
//   else relative = `${Math.floor(diffDays / 365)} years ago`;

//   return { date: formattedDate, relative };
// };

// // --- Sub-Components ---

// const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
//   <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-200">
//     <CardContent className="p-5 flex items-center justify-between">
//       <div className="space-y-1">
//         <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
//         <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
//       </div>
//       <div className={cn("p-3 rounded-xl bg-opacity-10", colorClass)}>
//         <Icon className={cn("w-5 h-5", colorClass.replace("bg-", "text-"))} />
//       </div>
//     </CardContent>
//   </Card>
// );

// const StatusBadge = ({ status }: { status: string }) => {
//   const styles = {
//     active: "bg-emerald-100 text-emerald-700 border-emerald-200",
//     inactive: "bg-slate-100 text-slate-700 border-slate-200",
//     terminated: "bg-red-100 text-red-700 border-red-200",
//   };
//   return (
//     <Badge variant="outline" className={cn("capitalize font-medium px-2.5 py-0.5 border", styles[status as keyof typeof styles] || styles.inactive)}>
//       {status}
//     </Badge>
//   );
// };

// // --- Main Page ---

// const Team: React.FC = () => {
//   const navigate = useNavigate();
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Filters
//   const [searchQuery, setSearchQuery] = useState('');
//   const [deptFilter, setDeptFilter] = useState(''); // Text input for custom write
//   const [typeFilter, setTypeFilter] = useState('all');

//   useEffect(() => { loadData(); }, []);

//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const data = await teamAPI.getAll(); 
//       setEmployees(data);
//     } catch (error) { console.error("Failed to load team", error); } 
//     finally { setIsLoading(false); }
//   };

//   // Stats & Filter Logic
//   const stats = useMemo(() => {
//     const active = employees.filter(e => e.status === 'active');
//     return {
//       total: employees.length,
//       activeCount: active.length,
//       payroll: active.reduce((sum, e) => sum + (Number(e.salary) || 0), 0),
//       remoteCount: active.filter(e => e.type === 'remote').length
//     };
//   }, [employees]);

//   const filteredEmployees = useMemo(() => {
//     return employees.filter(emp => {
//       if (emp.status !== 'active') return false; // Only show active on main board
      
//       const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                             emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      
//       // Custom Write Filter for Department
//       const matchesDept = deptFilter === '' || emp.department.toLowerCase().includes(deptFilter.toLowerCase());
      
//       const matchesType = typeFilter === 'all' || emp.type === typeFilter;
      
//       return matchesSearch && matchesDept && matchesType;
//     });
//   }, [employees, searchQuery, deptFilter, typeFilter]);

//   const handleDeactivate = async (id: string) => {
//     if(!confirm("Are you sure you want to remove this employee? They will be moved to the Alumni archives.")) return;
//     try {
//         await teamAPI.update(id, { status: 'inactive', exitDate: new Date().toISOString() });
//         loadData(); // Refresh list
//     } catch(e) { console.error(e); }
//   };

//   return (
//     <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-gray-900">Team Overview</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage your active workforce, roles, and profiles.</p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" onClick={() => navigate('/alumni')} className="hidden sm:flex border-dashed">
//              View Alumni
//           </Button>
//           <Button onClick={() => navigate('/team/new')} className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
//             <UserPlus className="w-4 h-4 mr-2" /> Add Member
//           </Button>
//         </div>
//       </div>

//       {/* Stats Row */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard title="Active Members" value={stats.activeCount} icon={UserCheck} colorClass="bg-emerald-50 text-emerald-600" />
//         <StatCard title="Remote" value={stats.remoteCount} icon={Clock} colorClass="bg-purple-50 text-purple-600" />
//         <StatCard title="Total Database" value={stats.total} icon={Users} colorClass="bg-blue-50 text-blue-600" />
//         <StatCard title="Est. Payroll" value={formatCurrency(stats.payroll)} icon={DollarSign} colorClass="bg-amber-50 text-amber-600" />
//       </div>

//       {/* Modern Filter Bar */}
//       <div className="flex flex-col md:flex-row gap-3 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
//         {/* Main Search */}
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <Input 
//             placeholder="Search by name or email..." 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-9 border-0 bg-transparent focus-visible:ring-0 placeholder:text-gray-400"
//           />
//         </div>
        
//         <div className="h-8 w-px bg-gray-200 hidden md:block self-center" />

//         {/* Custom Department Write/Filter */}
//         <div className="relative w-full md:w-[220px]">
//            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//            <Input 
//              placeholder="Filter Department..." 
//              value={deptFilter}
//              onChange={(e) => setDeptFilter(e.target.value)}
//              className="pl-8 h-9 bg-slate-50 border-0 focus-visible:ring-1 focus-visible:ring-slate-200 text-xs"
//            />
//         </div>

//         {/* Type Select */}
//         <Select value={typeFilter} onValueChange={setTypeFilter}>
//           <SelectTrigger className="w-full md:w-[140px] h-9 text-xs bg-slate-50 border-0">
//             <SelectValue placeholder="Work Type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Types</SelectItem>
//             <SelectItem value="on-site">On-Site</SelectItem>
//             <SelectItem value="remote">Remote</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* List View */}
//       <Card className="border-gray-200 shadow-sm overflow-hidden bg-white">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead className="text-[11px] font-semibold text-gray-500 uppercase bg-slate-50/50 border-b border-gray-100 tracking-wide">
//               <tr>
//                 <th className="px-6 py-4">Employee</th>
//                 <th className="px-6 py-4 hidden md:table-cell">Role & Dept</th>
//                 <th className="px-6 py-4 hidden lg:table-cell">Joined</th>
//                 <th className="px-6 py-4 hidden sm:table-cell">Status</th>
//                 <th className="px-6 py-4 text-right">Salary</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {isLoading ? (
//                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading team data...</td></tr>
//               ) : filteredEmployees.length === 0 ? (
//                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No active employees matches your search.</td></tr>
//               ) : (
//                 filteredEmployees.map((emp) => {
//                   const joined = formatDateJoined(emp.joinDate);
                  
//                   return (
//                     <tr key={emp.id} className="group hover:bg-slate-50/60 transition-colors">
                      
//                       {/* Name & Email */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <Avatar className="h-9 w-9 border border-gray-100 shadow-sm">
//                             <AvatarImage src={emp.avatar} />
//                             <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">{getInitials(emp.name)}</AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <div className="font-semibold text-gray-900 text-sm">{emp.name}</div>
//                             <div className="text-[11px] text-gray-500">{emp.email}</div>
//                             <div className="md:hidden text-[10px] text-slate-400 mt-0.5">{emp.designation}</div> 
//                           </div>
//                         </div>
//                       </td>

//                       {/* Role & Dept */}
//                       <td className="px-6 py-4 hidden md:table-cell">
//                         <div className="flex flex-col">
//                           <span className="font-medium text-gray-700 text-xs">{emp.designation}</span>
//                           <span className="text-[11px] text-gray-500 flex items-center mt-0.5">
//                              <Building2 className="w-3 h-3 mr-1 opacity-70" /> {emp.department}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Joined Date */}
//                       <td className="px-6 py-4 hidden lg:table-cell">
//                         <div className="flex flex-col">
//                            <span className="text-gray-700 font-medium text-xs flex items-center">
//                              <Calendar className="w-3 h-3 mr-1.5 opacity-50" /> {joined.date}
//                            </span>
//                            <span className="text-[10px] text-gray-400 mt-0.5">{joined.relative}</span>
//                         </div>
//                       </td>

//                       {/* Status */}
//                       <td className="px-6 py-4 hidden sm:table-cell">
//                          <div className="flex flex-col items-start gap-1.5">
//                             <StatusBadge status={emp.status} />
//                             <span className="text-[10px] text-gray-400 font-medium">{emp.type}</span>
//                          </div>
//                       </td>

//                       {/* Salary */}
//                       <td className="px-6 py-4 text-right">
//                         <div className="font-mono font-medium text-gray-900 text-xs">{formatCurrency(emp.salary)}</div>
//                       </td>

//                       {/* DIRECT ACTIONS */}
//                       <td className="px-6 py-4 text-right">
//                         <TooltipProvider>
//                           <div className="flex items-center justify-end gap-1">
                            
//                             <Tooltip>
//                               <TooltipTrigger asChild>
//                                 <Button 
//                                   variant="ghost" size="icon" 
//                                   className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
//                                   onClick={() => navigate(`/team/profile/${emp.id}`)}
//                                 >
//                                   <Eye className="w-4 h-4" />
//                                 </Button>
//                               </TooltipTrigger>
//                               <TooltipContent><p>View Profile</p></TooltipContent>
//                             </Tooltip>

//                             <Tooltip>
//                               <TooltipTrigger asChild>
//                                 <Button 
//                                   variant="ghost" size="icon" 
//                                   className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
//                                   onClick={() => navigate(`/team/edit/${emp.id}`)}
//                                 >
//                                   <Pencil className="w-4 h-4" />
//                                 </Button>
//                               </TooltipTrigger>
//                               <TooltipContent><p>Edit Details</p></TooltipContent>
//                             </Tooltip>

//                             <Tooltip>
//                               <TooltipTrigger asChild>
//                                 <Button 
//                                   variant="ghost" size="icon" 
//                                   className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
//                                   onClick={() => handleDeactivate(emp.id)}
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                 </Button>
//                               </TooltipTrigger>
//                               <TooltipContent><p>Remove / Alumni</p></TooltipContent>
//                             </Tooltip>

//                           </div>
//                         </TooltipProvider>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Team;























import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, UserPlus,
  Users, DollarSign, UserCheck, Clock,
  Building2, Eye, Pencil, Trash2, Calendar
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { teamAPI } from '@/services/teamService';
import type { Employee } from '@/types';
import { formatCurrency, getInitials } from '@/utils/formatters';


const Team: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await teamAPI.getAll(); 
        setEmployees(data);
      } catch (error) { console.error(error); } 
      finally { setIsLoading(false); }
    };
    loadData();
  }, []);

  const stats = useMemo(() => ({
    total: employees.length,
    activeCount: employees.filter(e => e.status === 'active').length,
    payroll: employees.filter(e => e.status === 'active').reduce((sum, e) => sum + (Number(e.salary) || 0), 0),
    remoteCount: employees.filter(e => e.status === 'active' && e.type === 'remote').length
  }), [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (emp.status !== 'active') return false;
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = deptFilter === '' || emp.department.toLowerCase().includes(deptFilter.toLowerCase());
      const matchesType = typeFilter === 'all' || emp.type === typeFilter;
      return matchesSearch && matchesDept && matchesType;
    });
  }, [employees, searchQuery, deptFilter, typeFilter]);

  const handleDeactivate = async (id: string) => {
    if(!confirm("Move employee to Alumni/Archives?")) return;
    await teamAPI.update(id, { status: 'inactive', exitDate: new Date().toISOString() });
    window.location.reload(); 
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Team Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your active workforce.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/alumni')} className="h-8 text-xs bg-white">View Alumni</Button>
          <Button onClick={() => navigate('/team/new')} className="bg-slate-900 hover:bg-slate-800 text-white h-8 text-xs shadow-sm">
            <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 border-none shadow-sm bg-white flex-row items-center justify-between">
           <div><p className="text-[10px] font-bold text-gray-400 uppercase">Active Members</p><h3 className="text-xl font-bold text-gray-900">{stats.activeCount}</h3></div>
           <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><UserCheck className="w-4 h-4"/></div>
        </Card>
        <Card className="p-4 border-none shadow-sm bg-white flex-row items-center justify-between">
           <div><p className="text-[10px] font-bold text-gray-400 uppercase">Remote</p><h3 className="text-xl font-bold text-gray-900">{stats.remoteCount}</h3></div>
           <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Clock className="w-4 h-4"/></div>
        </Card>
        <Card className="p-4 border-none shadow-sm bg-white flex-row items-center justify-between">
           <div><p className="text-[10px] font-bold text-gray-400 uppercase">Total Database</p><h3 className="text-xl font-bold text-gray-900">{stats.total}</h3></div>
           <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-4 h-4"/></div>
        </Card>
        <Card className="p-4 border-none shadow-sm bg-white flex-row items-center justify-between">
           <div><p className="text-[10px] font-bold text-gray-400 uppercase">Payroll Est.</p><h3 className="text-xl font-bold text-gray-900">{formatCurrency(stats.payroll)}</h3></div>
           <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><DollarSign className="w-4 h-4"/></div>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden rounded-xl">
        
        {/* Filter Ribbon */}
        <div className="px-4 py-3 border-b border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between bg-white">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <Input placeholder="Search team..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 text-xs bg-gray-50 border-gray-200" />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <div className="relative">
                 <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                 <Input placeholder="Filter Dept..." value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="pl-7 h-8 w-[140px] text-xs bg-white" />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                 <SelectTrigger className="w-[120px] h-8 text-xs bg-white"><SelectValue placeholder="Type" /></SelectTrigger>
                 <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="on-site">On-Site</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                 </SelectContent>
              </Select>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] font-semibold text-gray-500 uppercase bg-slate-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3 hidden md:table-cell">Role</th>
                <th className="px-6 py-3 hidden lg:table-cell">Joined</th>
                <th className="px-6 py-3 hidden sm:table-cell">Status</th>
                <th className="px-6 py-3 text-right">Salary</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                 <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-xs">Loading...</td></tr>
              ) : filteredEmployees.length === 0 ? (
                 <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-xs">No active members found.</td></tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-gray-100 shadow-sm">
                          <AvatarImage src={emp.avatar} />
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">{getInitials(emp.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900 text-xs">{emp.name}</div>
                          <div className="text-[10px] text-gray-500">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700 text-xs">{emp.designation}</span>
                        <span className="text-[10px] text-gray-500 flex items-center mt-0.5">
                           <Building2 className="w-3 h-3 mr-1 opacity-70" /> {emp.department}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 hidden lg:table-cell">
                       <span className="text-gray-500 text-xs flex items-center">
                         <Calendar className="w-3 h-3 mr-1.5 opacity-50" /> {new Date(emp.joinDate).toLocaleDateString()}
                       </span>
                    </td>
                    <td className="px-6 py-3 hidden sm:table-cell">
                        <div className="flex flex-col items-start gap-1">
                           <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-emerald-200 bg-emerald-50 text-emerald-700 capitalize">Active</Badge>
                           <span className="text-[10px] text-gray-400 capitalize pl-1">{emp.type}</span>
                        </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="font-mono font-medium text-gray-900 text-xs">{formatCurrency(emp.salary)}</div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 ">
                         <TooltipProvider>
                           <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-600" onClick={() => navigate(`/team/profile/${emp.id}`)}><Eye className="w-3.5 h-3.5"/></Button></TooltipTrigger><TooltipContent>View</TooltipContent></Tooltip>
                           <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-emerald-600" onClick={() => navigate(`/team/edit/${emp.id}`)}><Pencil className="w-3.5 h-3.5"/></Button></TooltipTrigger><TooltipContent>Edit</TooltipContent></Tooltip>
                           <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-600" onClick={() => handleDeactivate(emp.id)}><Trash2 className="w-3.5 h-3.5"/></Button></TooltipTrigger><TooltipContent>Remove</TooltipContent></Tooltip>
                         </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Team;