/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Pencil, Trash2, Wallet, 
  ArrowLeft, ArrowRight, Briefcase, CheckCircle2, Clock, 
  TrendingDown, Banknote, Calendar, Users, Eye, AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { projectAPI } from '@/services/projectService';
import { teamAPI } from '@/services/teamService'; // Needed for assignees
import type { Project, ProjectStatus, Employee } from '@/types';
import { formatCurrency, getInitials } from '@/utils/formatters';
import { cn } from '@/lib/utils';

import ProjectFinancials from '@/components/projects/ProjectFinancials';
import { AssignMemberModal } from '@/components/projects/AssignMemberModal';
import { ProjectDetailsModal } from '@/components/projects/ProjectDetailsModal'; // New

const ITEMS_PER_PAGE = 15;

// --- Sub-Component: Stat Card ---
const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <Card className="border-none shadow-sm bg-white flex flex-col p-4 justify-between h-full">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={cn("p-2 rounded-lg bg-opacity-10", colorClass)}>
        <Icon className={cn("w-4 h-4", colorClass.replace("bg-", "text-"))} />
      </div>
    </div>
  </Card>
);

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]); // For assignee mapping
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'active' | 'completed' | 'all'>('active');

  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('all');

  // Modals
  const [selectedProjectFinance, setSelectedProjectFinance] = useState<Project | null>(null);
  const [selectedProjectAssign, setSelectedProjectAssign] = useState<Project | null>(null);
  const [selectedProjectView, setSelectedProjectView] = useState<Project | null>(null);

  // Stats
  const stats = useMemo(() => ({
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0),
    totalExpenses: projects.reduce((sum, p) => sum + (Number(p.expenses) || 0), 0),
    totalPending: projects.reduce((sum, p) => sum + (p.budget - ((p as any).receivedAmount || 0)), 0)
  }), [projects]);

  const clients = useMemo(() => Array.from(new Set(projects.map(p => p.clientName || (p as any).client))).filter(Boolean).sort(), [projects]);

  useEffect(() => { 
    const init = async () => {
        setIsLoading(true);
        await Promise.all([fetchProjects(), fetchTeam()]);
        setIsLoading(false);
    }
    init();
  }, []);

  useEffect(() => { filterProjects(); }, [searchQuery, clientFilter, viewMode, projects]);

  const fetchProjects = async () => {
    try {
      const data = await projectAPI.getAll();
      setProjects(data);
    } catch (e) { console.error(e); }
  };

  const fetchTeam = async () => {
    try {
        const data = await teamAPI.getAll();
        setEmployees(data);
    } catch(e) { console.error(e); }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete project?")) return;
    await projectAPI.delete(id);
    fetchProjects(); 
    toast({ title: "Deleted", description: "Project removed." });
  };

  const filterProjects = () => {
    let filtered = [...projects];
    if (viewMode === 'active') filtered = filtered.filter(p => p.status === 'active' || p.status === 'on-hold');
    if (viewMode === 'completed') filtered = filtered.filter(p => p.status === 'completed');
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name || '').toLowerCase().includes(q) || (p.clientName || '').toLowerCase().includes(q)
      );
    }
    if (clientFilter !== 'all') {
      filtered = filtered.filter(p => (p.clientName === clientFilter || (p as any).client === clientFilter));
    }
    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const paginatedProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const getStatusBadge = (status: ProjectStatus) => {
    const styles = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      completed: "bg-blue-50 text-blue-700 border-blue-200",
      'on-hold': "bg-amber-50 text-amber-700 border-amber-200",
    };
    return <Badge variant="outline" className={cn("font-medium capitalize px-2 py-0.5", styles[status])}>{status.replace('-', ' ')}</Badge>;
  };

  // Helper to get assignee objects
  const getAssignees = (ids?: string[]) => {
      if(!ids) return [];
      return employees.filter(e => ids.includes(e.id));
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-500">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
               <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">Projects</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Manage deliverables and financials.</p>
               </div>
               <Button onClick={() => navigate('/projects/new')} className="bg-slate-900 hover:bg-slate-800 text-white h-8 text-xs shadow-sm">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> New Project
               </Button>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
               <StatCard title="Total Value" value={formatCurrency(stats.totalBudget)} icon={Wallet} colorClass="bg-gray-100 text-gray-700" />
               <StatCard title="Pending" value={formatCurrency(stats.totalPending)} icon={Banknote} colorClass="bg-indigo-50 text-indigo-600" />
               <StatCard title="Expenses" value={formatCurrency(stats.totalExpenses)} icon={TrendingDown} colorClass="bg-rose-50 text-rose-600" />
               <StatCard title="Active" value={stats.active} icon={Briefcase} colorClass="bg-emerald-50 text-emerald-600" />
               <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} colorClass="bg-blue-50 text-blue-600" />
            </div>
         </div>
      </div>

      {/* Main Content Card */}
      <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden rounded-xl">
         {/* Filters Ribbon */}
         <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
            <div className="flex gap-2 p-1 bg-gray-50 rounded-lg">
               {['active', 'completed', 'all'].map((mode) => (
                  <button
                     key={mode}
                     onClick={() => setViewMode(mode as any)}
                     className={cn(
                        "px-3 py-1 text-xs font-medium rounded-md transition-all capitalize",
                        viewMode === mode ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                     )}
                  >
                     {mode}
                  </button>
               ))}
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
               <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="h-8 w-[140px] text-xs bg-white"><SelectValue placeholder="Client" /></SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Clients</SelectItem>
                     {clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
               </Select>
               <div className="relative flex-1 sm:w-[200px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input 
                     placeholder="Search projects..." 
                     value={searchQuery} 
                     onChange={e => setSearchQuery(e.target.value)} 
                     className="pl-8 h-8 text-xs bg-white"
                  />
               </div>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-[11px] font-semibold text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                     <th className="px-6 py-3 min-w-[200px]">Project</th>
                     <th className="px-6 py-3 min-w-[120px]">Team</th>
                     <th className="px-6 py-3">Timeline</th>
                     <th className="px-6 py-3 text-right">Financials</th>
                     <th className="px-6 py-3 text-center">Status</th>
                     <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                     <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-xs">Loading...</td></tr>
                  ) : paginatedProjects.length === 0 ? (
                     <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-xs">No projects found.</td></tr>
                  ) : (
                     paginatedProjects.map((p) => {
                        const received = (p as any).receivedAmount || 0;
                        const remaining = p.budget - received;
                        const assignees = getAssignees(p.assignedTo);
                        
                        // Date Logic
                        const end = p.completionDate ? new Date(p.completionDate) : null;
                        const isOverdue = end && end < new Date() && p.status !== 'completed';

                        return (
                           <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-3">
                                 <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                                 <div className="text-[10px] text-gray-500">{p.clientName || (p as any).client || '-'}</div>
                              </td>
                              
                              {/* Team Avatars */}
                              <td className="px-6 py-3">
                                 <div className="flex -space-x-2 overflow-hidden">
                                    {assignees.slice(0, 3).map((emp) => (
                                        <Avatar key={emp.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white" title={emp.name}>
                                            <AvatarImage src={emp.avatar} />
                                            <AvatarFallback className="bg-slate-100 text-[9px] text-slate-600">{getInitials(emp.name)}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {assignees.length > 3 && (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white bg-gray-100 text-[9px] font-medium text-gray-500">
                                            +{assignees.length - 3}
                                        </div>
                                    )}
                                    {assignees.length === 0 && <span className="text-[10px] text-gray-400 italic">Unassigned</span>}
                                 </div>
                              </td>

                              <td className="px-6 py-3 text-xs text-gray-500">
                                 <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 opacity-50"/> {new Date(p.startDate).toLocaleDateString()}</div>
                                 <div className={cn("flex items-center gap-1.5 mt-0.5", isOverdue ? "text-red-500 font-medium" : "text-gray-400")}>
                                    {isOverdue ? <AlertCircle className="w-3 h-3"/> : <Clock className="w-3 h-3 opacity-50"/>} 
                                    {end ? end.toLocaleDateString() : 'Ongoing'}
                                 </div>
                              </td>
                              
                              <td className="px-6 py-3 text-right">
                                 <div className="font-mono font-medium text-gray-900 text-xs">{formatCurrency(p.budget)}</div>
                                 <div className="text-[10px] text-gray-400 mt-0.5">
                                    <span className="text-emerald-600">{formatCurrency(received)}</span> paid
                                    {remaining > 0 && <span className="text-rose-500 ml-1">({formatCurrency(remaining)} due)</span>}
                                 </div>
                              </td>
                              
                              <td className="px-6 py-3 text-center">{getStatusBadge(p.status)}</td>
                              
                              <td className="px-4 py-3 text-right">
                                 <div className="flex items-center justify-end gap-1 y">
                                    
                                    {/* View Details */}
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-600" onClick={() => setSelectedProjectView(p)}>
                                             <Eye className="w-3.5 h-3.5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Details</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    {/* Assign Team */}
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-purple-600" onClick={() => setSelectedProjectAssign(p)}>
                                             <Users className="w-3.5 h-3.5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Assign Team</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    {/* Finance */}
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-emerald-600" onClick={() => setSelectedProjectFinance(p)}>
                                             <Wallet className="w-3.5 h-3.5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Finance</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    {/* Edit */}
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-slate-700" onClick={() => navigate(`/projects/edit/${p.id}`)}>
                                       <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                    
                                    {/* Delete */}
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-rose-600" onClick={() => handleDelete(p.id)}>
                                       <Trash2 className="w-3.5 h-3.5" />
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

         {/* Pagination */}
         {filteredProjects.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50/30">
               <span className="text-[10px] text-gray-500">Page {currentPage} of {totalPages}</span>
               <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-7 w-7" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                     <ArrowLeft className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-7 w-7" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                     <ArrowRight className="w-3 h-3" />
                  </Button>
               </div>
            </div>
         )}
      </Card>

      {/* --- MODALS --- */}
      
      {/* 1. Financials */}
      {selectedProjectFinance && (
        <ProjectFinancials 
          project={selectedProjectFinance} 
          isOpen={!!selectedProjectFinance} 
          onClose={() => setSelectedProjectFinance(null)}
          onUpdate={fetchProjects}
        />
      )}

      {/* 2. Assign Members (NEW) */}
      {selectedProjectAssign && (
        <AssignMemberModal
          isOpen={!!selectedProjectAssign}
          onClose={() => setSelectedProjectAssign(null)}
          project={selectedProjectAssign}
          employees={employees}
          onUpdate={fetchProjects}
        />
      )}

      {/* 3. View Details (NEW) */}
      {selectedProjectView && (
        <ProjectDetailsModal
          isOpen={!!selectedProjectView}
          onClose={() => setSelectedProjectView(null)}
          project={selectedProjectView}
          employees={employees} // To show names of assignees
        />
      )}

    </div>
  );
};

export default Projects;