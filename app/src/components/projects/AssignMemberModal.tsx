import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { getInitials } from '@/utils/formatters';
import { projectAPI } from '@/services/projectService';
import type { Project, Employee } from '@/types';

interface AssignMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  employees: Employee[];
  onUpdate: () => void;
}

export const AssignMemberModal: React.FC<AssignMemberModalProps> = ({ isOpen, onClose, project, employees, onUpdate }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(project.assignedTo || []);
  const [isSaving, setIsSaving] = useState(false);

  const toggleMember = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        await projectAPI.update(project.id, { assignedTo: selectedIds });
        onUpdate();
        onClose();
    } catch(e) { console.error(e); }
    finally { setIsSaving(false); }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Team Members</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-2 max-h-[300px] overflow-y-auto pr-2">
           {employees.map(emp => (
              <div key={emp.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer" onClick={() => toggleMember(emp.id)}>
                 <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={emp.avatar} />
                       <AvatarFallback className="text-xs">{getInitials(emp.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                       <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                       <div className="text-[10px] text-slate-500">{emp.designation}</div>
                    </div>
                 </div>
                 <Checkbox checked={selectedIds.includes(emp.id)} onCheckedChange={() => toggleMember(emp.id)} />
              </div>
           ))}
        </div>

        <DialogFooter>
           <Button variant="outline" onClick={onClose}>Cancel</Button>
           <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white">{isSaving ? 'Saving...' : 'Save Changes'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};