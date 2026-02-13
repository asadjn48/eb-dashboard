/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Pencil, Trash2, Wallet, 
  ArrowLeft, ArrowRight, X, Briefcase, CheckCircle2, Clock, 
  TrendingDown, Banknote,
  Calendar
} from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// Services & Types
import { projectAPI } from '@/services/projectService';
import type { Project, ProjectStatus } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

// Import the Financials Component
import ProjectFinancials from '@/components/projects/ProjectFinancials';

const ITEMS_PER_PAGE = 20;

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectForFinance, setSelectedProjectForFinance] = useState<Project | null>(null);
  
  // View Mode: 'active', 'completed', 'all'
  const [viewMode, setViewMode] = useState<'active' | 'completed' | 'all'>('active');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  // Derived Data: Stats
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on-hold').length,
    totalBudget: projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0),
    
    // NEW CALCULATIONS
    totalExpenses: projects.reduce((sum, p) => sum + (Number(p.expenses) || 0), 0),
    totalPending: projects.reduce((sum, p) => {
       const received = (p as any).receivedAmount || 0;
       return sum + (p.budget - received);
    }, 0)
  };

  // Unique Clients for Filter
  const clients = Array.from(new Set(projects.map(p => p.clientName || (p as any).client))).filter(Boolean).sort();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchQuery, clientFilter, dateFilter, viewMode, projects]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectAPI.getAll();
      setProjects(data);
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete project?")) return;
    await projectAPI.delete(id);
    fetchProjects(); 
    toast({ title: "Deleted", description: "Project removed." });
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // 1. View Mode Filter (The "Section" Logic)
    if (viewMode === 'active') {
      filtered = filtered.filter(p => p.status === 'active' || p.status === 'on-hold');
    } else if (viewMode === 'completed') {
      filtered = filtered.filter(p => p.status === 'completed');
    }
    // 'all' shows everything

    // 2. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name || '').toLowerCase().includes(q) || 
        (p.clientName || (p as any).client || '').toLowerCase().includes(q)
      );
    }

    // 3. Client Filter
    if (clientFilter !== 'all') {
      filtered = filtered.filter(p => (p.clientName === clientFilter || (p as any).client === clientFilter));
    }

    // 4. Date Filter
    if (dateFilter.start) {
      filtered = filtered.filter(p => new Date(p.startDate) >= new Date(dateFilter.start));
    }
    if (dateFilter.end) {
      filtered = filtered.filter(p => new Date(p.startDate) <= new Date(dateFilter.end));
    }

    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const getStatusBadge = (status: ProjectStatus) => {
    const styles = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-100",
      completed: "bg-blue-50 text-blue-700 border-blue-100",
      'on-hold': "bg-amber-50 text-amber-700 border-amber-100",
    };
    return (
      <Badge variant="outline" className={cn("font-medium capitalize px-2 py-0.5", styles[status])}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* 1. HEADER & KPI CARDS (Now 6 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
        
        
        {/* Total Value */}
        <Card className="p-4 border-l-4 border-l-gray-700 bg-white shadow-sm hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Value</p>
              <h3 className="text-xl font-bold text-gray-900 mt-0.5">{formatCurrency(stats.totalBudget)}</h3>
            </div>
            <div className="p-1.5 bg-gray-100 rounded-md">
              <Wallet className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </Card>

        {/* NEW: Total Expenses */}
        <Card className="p-4 border-l-4 border-l-rose-500 bg-white shadow-sm hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expenses</p>
              <h3 className="text-xl font-bold text-gray-900 mt-0.5">{formatCurrency(stats.totalExpenses)}</h3>
            </div>
            <div className="p-1.5 bg-rose-50 rounded-md">
              <TrendingDown className="w-4 h-4 text-rose-600" />
            </div>
          </div>
        </Card>

        {/* NEW: Total Pending */}
        <Card className="p-4 border-l-4 border-l-indigo-500 bg-white shadow-sm hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Dues</p>
              <h3 className="text-xl font-bold text-gray-900 mt-0.5">{formatCurrency(stats.totalPending)}</h3>
            </div>
            <div className="p-1.5 bg-indigo-50 rounded-md">
              <Banknote className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
        </Card>


      {/* Active */}
        <Card className="p-4 border-l-4 border-l-emerald-500 bg-white shadow-sm hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.active}</h3>
            </div>
            <div className="p-1.5 bg-emerald-50 rounded-md">
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </Card>

        {/* Completed */}
        <Card className="p-4 border-l-4 border-l-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completed</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.completed}</h3>
            </div>
            <div className="p-1.5 bg-blue-50 rounded-md">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* On Hold */}
        <Card className="p-4 border-l-4 border-l-amber-500 bg-white shadow-sm hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">On Hold</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.onHold}</h3>
            </div>
            <div className="p-1.5 bg-amber-50 rounded-md">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
        </Card>



      </div>

      {/* 2. SECTION TABS & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-1">
        <div className="flex gap-6 overflow-x-auto pb-2 sm:pb-0">
          <button 
            onClick={() => setViewMode('active')}
            className={cn(
              "pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              viewMode === 'active' ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            Active Projects
          </button>
          <button 
            onClick={() => setViewMode('completed')}
            className={cn(
              "pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              viewMode === 'completed' ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            Completed History
          </button>
          <button 
            onClick={() => setViewMode('all')}
            className={cn(
              "pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              viewMode === 'all' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            All Projects
          </button>
        </div>

        <Button onClick={() => navigate('/projects/new')} className="bg-gray-900 hover:bg-gray-800 text-white h-9 text-xs shadow-sm whitespace-nowrap">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> New Project
        </Button>
      </div>

      {/* 3. ADVANCED FILTERS BAR */}
      <div className="flex flex-col lg:flex-row gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input 
              placeholder="Search projects..." 
              className="pl-9 h-9 text-sm bg-gray-50/50 border-gray-200"
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
         </div>

         {/* Client Filter */}
         <div className="w-full lg:w-48">
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="h-9 text-xs bg-gray-50/50 border-gray-200">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
         </div>

         {/* Date Range */}
         <div className="flex gap-2 items-center">
            <Input 
               type="date" 
               className="h-9 w-32 text-xs bg-gray-50/50 border-gray-200"
               value={dateFilter.start}
               onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
            />
            <span className="text-gray-300">-</span>
            <Input 
               type="date" 
               className="h-9 w-32 text-xs bg-gray-50/50 border-gray-200"
               value={dateFilter.end}
               onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
            />
            {(dateFilter.start || dateFilter.end) && (
              <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50" onClick={() => setDateFilter({ start: '', end: '' })}>
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
         </div>
      </div>

      {/* 4. PROJECTS TABLE */}
      <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] font-semibold text-gray-500 uppercase bg-gray-50/40 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 min-w-[200px]">Project Name</th>
                <th className="px-6 py-3 min-w-[150px]">Client</th>
                <th className="px-6 py-3 min-w-[180px]">Timeline</th>
                <th className="px-6 py-3 text-right min-w-[150px]">Financials (Paid / Total)</th>
                <th className="px-6 py-3 text-center min-w-[100px]">Status</th>
                <th className="px-6 py-3 text-right min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : paginatedProjects.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No projects found in this view.</td></tr>
              ) : (
                paginatedProjects.map((project) => {
                  const received = (project as any).receivedAmount || 0;
                  const remaining = project.budget - received;
                  const displayClient = project.clientName || (project as any).client || 'No Client';
                  const finalEndDate = project.completionDate || (project as any).endDate;
                  
                  // Date Display Logic
                  const endDateDisplay = finalEndDate ? new Date(finalEndDate).toLocaleDateString() : (project.status === 'completed' ? 'Completed' : 'Ongoing');

                  return (
                    <tr key={project.id} className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{project.name}</td>
                      <td className="px-6 py-4 text-gray-600">{displayClient}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 opacity-50"/> {new Date(project.startDate).toLocaleDateString()}</div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-gray-400"><Clock className="w-3 h-3 opacity-50"/> {endDateDisplay}</div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="font-medium text-gray-900">{formatCurrency(project.budget)}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                           <span className="text-emerald-600 font-medium">{formatCurrency(received)}</span> paid
                        </div>
                        {remaining > 0 && (
                          <div className="text-[10px] text-rose-500 font-medium">
                            {formatCurrency(remaining)} due
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 text-center">{getStatusBadge(project.status)}</td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => setSelectedProjectForFinance(project)}>
                            <Wallet className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/projects/edit/${project.id}`)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(project.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
               })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredProjects.length > ITEMS_PER_PAGE && (
           <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
             <span className="text-xs text-gray-500">
               Page {currentPage} of {totalPages}
             </span>
             <div className="flex gap-2">
               <Button 
                 variant="outline" size="sm" 
                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                 disabled={currentPage === 1}
                 className="h-8 text-xs"
               >
                 <ArrowLeft className="w-3 h-3 mr-1" /> Prev
               </Button>
               <Button 
                 variant="outline" size="sm" 
                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                 disabled={currentPage === totalPages}
                 className="h-8 text-xs"
               >
                 Next <ArrowRight className="w-3 h-3 ml-1" />
               </Button>
             </div>
           </div>
        )}
      </Card>

      {/* Financials Modal */}
      {selectedProjectForFinance && (
        <ProjectFinancials 
          project={selectedProjectForFinance} 
          isOpen={!!selectedProjectForFinance} 
          onClose={() => setSelectedProjectForFinance(null)}
          onUpdate={fetchProjects}
        />
      )}
    </div>
  );
};

export default Projects;