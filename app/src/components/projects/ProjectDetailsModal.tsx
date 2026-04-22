/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatCurrency } from '@/utils/formatters';
import type { Project, Employee } from '@/types';
import { 
  Calendar, Clock, DollarSign, Building2, 
  Briefcase, FileText, Users, PieChart, 
  TrendingUp, Activity, X, Eye, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  employees: Employee[];
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ isOpen, onClose, project, employees }) => {
  
  if (!project) return null;

  // --- Data Calculations ---
  const assignees = employees.filter(e => (project.assignedTo || []).includes(e.id));
  const investors = (project as any).investors || [];
  
  const budget = project.budget || 0;
  const received = (project as any).receivedAmount || 0;
  const pending = budget - received;
  const expenses = project.expenses || 0;
  const netProfit = budget - expenses;
  const progress = project.progress || 0;

  // Status visual mapping
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': return { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'on-hold': return { label: 'On Hold', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default: return { label: 'Active / Ongoing', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
  };
  const statusConfig = getStatusConfig(project.status || 'active');

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl rounded-2xl no-scrollbar">
        
        {/* --- HEADER --- */}
        <DialogHeader className="px-6 py-4 bg-slate-900 border-b flex flex-row items-center justify-between sticky top-0 z-10">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white truncate pr-4">
             <Eye className="w-5 h-5 text-[#5d88c6]" /> 
             {project.name}
          </DialogTitle>
          <div className="flex items-center gap-3">
             <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 border-0", statusConfig.color)}>
                {statusConfig.label}
             </Badge>
             <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 rounded-full shrink-0">
               <X className="w-4 h-4" />
             </Button>
          </div>
        </DialogHeader>
        
        <div className="p-6 space-y-6 bg-white">
           
           {/* --- TOP BANNER: FINANCIAL SUMMARY --- */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-sm">
              <div className="space-y-1">
                 <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5"/> Total Budget</p>
                 <p className="font-extrabold text-xl text-slate-900">{formatCurrency(budget)}</p>
              </div>
              <div className="sm:border-l sm:border-slate-200 sm:pl-4 space-y-1">
                 <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600/70 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5"/> Received</p>
                 <p className="font-extrabold text-xl text-emerald-600">{formatCurrency(received)}</p>
              </div>
              <div className="sm:border-l sm:border-slate-200 sm:pl-4 space-y-1">
                 <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Pending Due</p>
                 <p className={cn("font-extrabold text-xl", pending > 0 ? "text-rose-600" : pending < 0 ? "text-purple-600" : "text-slate-400")}>
                   {pending < 0 ? `+${formatCurrency(Math.abs(pending))} (Over)` : formatCurrency(pending)}
                 </p>
              </div>
              <div className="sm:border-l sm:border-slate-200 sm:pl-4 space-y-1">
                 <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600/70 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> Est. Profit</p>
                 <p className={cn("font-extrabold text-xl", netProfit >= 0 ? "text-blue-600" : "text-rose-600")}>{formatCurrency(netProfit)}</p>
              </div>
           </div>

           {/* --- MIDDLE GRID: DETAILS & PROGRESS --- */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Left Column: Specs */}
              <div className="space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Client / Organization</label>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl">
                       <Building2 className="w-4 h-4 text-[#5d88c6]"/> {project.clientName || 'Internal Project'}
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Category & Type</label>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl">
                       <Briefcase className="w-4 h-4 text-[#5d88c6]"/> 
                       {project.subType || 'General'} 
                       <span className="text-slate-300 font-normal">|</span> 
                       <span className="capitalize text-slate-600">{project.type}</span>
                    </div>
                 </div>
              </div>

              {/* Right Column: Timeline & Progress */}
              <div className="space-y-5">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Start Date</label>
                       <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl">
                          <Calendar className="w-4 h-4 text-slate-400"/> {new Date(project.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Deadline</label>
                       <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl">
                          <Clock className="w-4 h-4 text-rose-400"/> 
                          {project.endDate ? new Date(project.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'}) : 'No Deadline'}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Project Progress</label>
                       <span className="text-xs font-bold text-slate-700">{progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                 </div>
              </div>

           </div>

           {/* --- BOTTOM SECTION: SCOPE & INVESTORS --- */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              
              {/* Description */}
              <div className="space-y-2">
                 <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Notes & Scope</label>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[120px]">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                       {project.description || <span className="italic text-slate-400">No detailed description provided.</span>}
                    </p>
                 </div>
              </div>

              {/* Team & Investors */}
              <div className="space-y-6">
                 
                 {/* Team */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Assigned Team ({assignees.length})</label>
                    {assignees.length === 0 ? (
                       <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
                          <p className="text-xs text-slate-400 font-medium">No team members assigned.</p>
                       </div>
                    ) : (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {assignees.map(emp => (
                             <div key={emp.id} className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <Avatar className="h-8 w-8 border border-slate-200">
                                   <AvatarImage src={emp.avatar} />
                                   <AvatarFallback className="bg-[#5d88c6] text-white font-bold text-[10px]">{getInitials(emp.name)}</AvatarFallback>
                                </Avatar>
                                <div className="overflow-hidden">
                                   <div className="text-xs font-bold text-slate-800 truncate">{emp.name}</div>
                                   <div className="text-[9px] text-slate-500 font-medium truncate uppercase tracking-wider">{emp.designation}</div>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>

                 {/* Investors (Only shows if they exist) */}
                 {investors.length > 0 && (
                    <div className="space-y-2">
                       <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><PieChart className="w-3.5 h-3.5"/> Shareholders & Investments</label>
                       <div className="flex flex-col gap-2">
                          {investors.map((inv: any, idx: number) => (
                             <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl border border-purple-100 bg-purple-50/30">
                                <span className="text-xs font-bold text-slate-800">{inv.name}</span>
                                <div className="flex items-center gap-3 text-xs">
                                   <span className="font-mono font-semibold text-emerald-600">{formatCurrency(inv.investment)}</span>
                                   <span className="font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">{inv.equity}% Eq.</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

              </div>
           </div>

        </div>

        <DialogFooter className="px-6 py-4 bg-slate-50 border-t sticky bottom-0 z-10">
           <div className="flex w-full justify-end">
             <Button variant="outline" className="rounded-full font-bold px-8 h-10 bg-white shadow-sm border-slate-200 hover:bg-slate-100" onClick={onClose}>Close Details</Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};