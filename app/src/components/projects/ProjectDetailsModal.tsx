import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatCurrency } from '@/utils/formatters';
import type { Project, Employee } from '@/types';
import { Calendar, Clock, DollarSign, Building2 } from 'lucide-react';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  employees: Employee[];
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ isOpen, onClose, project, employees }) => {
  
  const assignees = employees.filter(e => (project.assignedTo || []).includes(e.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-start pr-6">
             <div>
                <DialogTitle className="text-xl font-bold">{project.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                   <Badge variant="secondary" className="capitalize">{project.status}</Badge>
                   <span className="text-xs text-gray-500">Created {new Date(project.startDate).toLocaleDateString()}</span>
                </div>
             </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-2">
           
           {/* Description */}
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-700 leading-relaxed">
                 {project.description || "No description provided."}
              </p>
           </div>

           {/* Grid Details */}
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-gray-400">Client</label>
                 <div className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="w-3.5 h-3.5 text-gray-400"/> {project.clientName || 'N/A'}
                 </div>
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-gray-400">Budget</label>
                 <div className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400"/> {formatCurrency(project.budget)}
                 </div>
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-gray-400">Start Date</label>
                 <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="w-3.5 h-3.5 text-gray-400"/> {new Date(project.startDate).toLocaleDateString()}
                 </div>
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-gray-400">Deadline</label>
                 <div className="flex items-center gap-2 text-sm font-medium text-rose-600">
                    <Clock className="w-3.5 h-3.5"/> {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'Ongoing'}
                 </div>
              </div>
           </div>

           <Separator />

           {/* Team Section */}
           <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">Assigned Team</h4>
              {assignees.length === 0 ? (
                 <p className="text-xs text-gray-400 italic">No members assigned.</p>
              ) : (
                 <div className="grid grid-cols-2 gap-2">
                    {assignees.map(emp => (
                       <div key={emp.id} className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-md shadow-sm">
                          <Avatar className="h-6 w-6">
                             <AvatarImage src={emp.avatar} />
                             <AvatarFallback className="text-[9px]">{getInitials(emp.name)}</AvatarFallback>
                          </Avatar>
                          <div className="overflow-hidden">
                             <div className="text-xs font-medium truncate">{emp.name}</div>
                             <div className="text-[9px] text-gray-500 truncate">{emp.designation}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};