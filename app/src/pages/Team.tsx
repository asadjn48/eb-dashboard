/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Mail, MoreVertical,
  UserPlus, Briefcase, Users, DollarSign, UserCheck, Clock
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Custom Components
import { DeactivateModal } from '@/components/team/DeactivateModal';

// Services & Utils
import { teamAPI } from '@/services/teamService';
import type { Employee } from '@/types';
import { formatCurrency, getInitials } from '@/utils/formatters';
import { cn } from '@/lib/utils';

// --- Sub-Components ---

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-xl bg-opacity-10", colorClass)}>
        <Icon className={cn("w-6 h-6", colorClass.replace("bg-", "text-"))} />
      </div>
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-gray-50 text-gray-600 border-gray-200",
    terminated: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize", styles[status as keyof typeof styles] || styles.inactive)}>
      {status}
    </span>
  );
};

const TypeBadge = ({ type }: { type: string }) => {
  return (
    <Badge variant="outline" className="font-normal capitalize text-blue-700 bg-blue-50 border-blue-200">
      {type}
    </Badge>
  );
};

const EmployeeCard = ({ employee, onAction }: { employee: Employee, onAction: (a: string, e: Employee) => void }) => (
  <Card className="group hover:shadow-xl transition-all duration-300 border-gray-100 overflow-hidden flex flex-col h-full">
    <CardContent className="p-0 flex flex-col h-full">
      <div className="h-24 bg-gradient-to-r from-slate-100 to-gray-50 relative">
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/50 backdrop-blur-sm hover:bg-white transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('view', employee)}>View Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('edit', employee)}>Edit Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onAction('deactivate', employee)} 
                className="text-red-600 focus:text-red-600"
              >
                Deactivate / Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-6 flex-1 relative">
        <div className="absolute -top-12 left-6 p-1 bg-white rounded-full">
          <Avatar className="w-24 h-24 border-4 border-white shadow-sm">
            <AvatarImage src={employee.avatar} className="object-cover" />
            <AvatarFallback className="bg-slate-900 text-white text-2xl font-medium">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="mt-14 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-1">{employee.name}</h3>
              <p className="text-sm text-gray-500 font-medium line-clamp-1">{employee.designation}</p>
            </div>
            <StatusBadge status={employee.status} />
          </div>
          <div className="mt-3 flex gap-2"><TypeBadge type={employee.type} /></div>
        </div>

        <div className="space-y-3 pb-6 border-t border-gray-100 pt-4 mt-auto">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-3 text-gray-400 shrink-0" />
            <span className="truncate">{employee.department}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-3 text-gray-400 shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2">
             <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Salary</span>
             <span className="font-mono font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded">
               {formatCurrency(employee.salary)}
             </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// --- Main Page ---

const Team: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ department: 'all', type: 'all' });

  // Modal State
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await teamAPI.getAll(); 
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load team", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Stats Calculation
  const stats = useMemo(() => {
    const active = employees.filter(e => e.status === 'active');
    return {
      total: employees.length, // Database total
      activeCount: active.length, // Currently active
      payroll: active.reduce((sum, e) => sum + (e.salary || 0), 0),
      remoteCount: active.filter(e => e.type === 'remote').length
    };
  }, [employees]);

  // 3. Filter Logic (Hides Inactive Employees)
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Logic: Only show 'active' employees on the Team Board
      // Inactive/Terminated employees are moved to the Alumni page
      if (emp.status !== 'active') return false;

      const matchesSearch = emp.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                            emp.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesDept = filters.department === 'all' || emp.department === filters.department;
      const matchesType = filters.type === 'all' || emp.type === filters.type;
      
      return matchesSearch && matchesDept && matchesType;
    });
  }, [employees, debouncedSearch, filters]);

  // --- Handlers ---
  const handleAction = (action: string, emp: Employee) => {
    setSelectedEmp(emp);
    if (action === 'view') navigate(`/team/profile/${emp.id}`);
    if (action === 'edit') navigate(`/team/edit/${emp.id}`);
    if (action === 'deactivate') setIsDeactivateOpen(true);
  };

  const handleDeactivateConfirm = async (data: { exitDate: string; exitType: string; exitReason: string }) => {
    if (!selectedEmp) return;

    try {
      // Update in Firebase -> Sets status to 'inactive'
      await teamAPI.update(selectedEmp.id, {
        status: 'inactive',
        exitDate: data.exitDate,
        exitType: data.exitType,
        exitReason: data.exitReason
      });

      // Update Local State -> Removes card from view instantly
      setEmployees(prev => prev.map(e => 
        e.id === selectedEmp.id ? { ...e, status: 'inactive', ...data } : e
      ));

    } catch (error) {
      console.error("Failed to deactivate", error);
    }
    
    setIsDeactivateOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage profiles, assignments, and roles.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/alumni')}>
              View Alumni Archives
          </Button>
          <Button onClick={() => navigate('/team/new')} className="bg-[var(--primary)] text-white hover:opacity-90 shadow-lg">
            <UserPlus className="w-4 h-4 mr-2" /> Add Employee
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Members" value={stats.activeCount} icon={UserCheck} colorClass="bg-emerald-50 text-emerald-600" />
        <StatCard title="Remote Team" value={stats.remoteCount} icon={Clock} colorClass="bg-purple-50 text-purple-600" />
        <StatCard title="Total Database" value={stats.total} icon={Users} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Monthly Payroll" value={formatCurrency(stats.payroll)} icon={DollarSign} colorClass="bg-orange-50 text-orange-600" />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search active employees..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.department} onValueChange={(v) => setFilters(f => ({...f, department: v}))}>
            <SelectTrigger className="w-[180px]"><Filter className="w-4 h-4 mr-2 text-gray-400"/> <SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
              <SelectItem value="Web Developer">Web Developer</SelectItem>
              <SelectItem value="AI Engineer">AI Engineer</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.type} onValueChange={(v) => setFilters(f => ({...f, type: v}))}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="on-site">On-Site</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employee Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed text-gray-500">
          No active team members found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} onAction={handleAction} />
          ))}
        </div>
      )}

      {/* Deactivate Modal */}
      <DeactivateModal
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={handleDeactivateConfirm}
        employeeName={selectedEmp?.name}
      />

    </div>
  );
};

export default Team;