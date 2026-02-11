/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { TriangleAlert, Calendar, FileText } from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { exitDate: string; exitType: string; exitReason: string }) => void;
  employeeName?: string;
}

export const DeactivateModal: React.FC<DeactivateModalProps> = ({ 
  isOpen, onClose, onConfirm, employeeName 
}) => {
  // Auto-fetch current date
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    exitDate: today,
    exitType: 'Resigned',
    exitReason: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        exitDate: new Date().toISOString().split('T')[0],
        exitType: 'Resigned',
        exitReason: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!formData.exitReason.trim()) {
      alert("Please provide a reason for deactivation.");
      return;
    }
    onConfirm(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <TriangleAlert className="w-5 h-5" /> Deactivate Employee
          </DialogTitle>
          <DialogDescription>
            You are removing <strong>{employeeName}</strong> from the active team. 
            They will be moved to the Alumni Archives.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Date Input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500"/> Exit Date</Label>
            <Input 
              type="date" 
              value={formData.exitDate} 
              onChange={(e) => setFormData({...formData, exitDate: e.target.value})} 
            />
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Exit Type</Label>
            <Select 
              value={formData.exitType} 
              onValueChange={(v) => setFormData({...formData, exitType: v})}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Resigned">Resigned</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
                <SelectItem value="Contract Ended">Contract Ended</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason Textarea */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-500"/> Reason / Notes</Label>
            <Textarea 
              placeholder="e.g. Found a better opportunity..." 
              value={formData.exitReason}
              onChange={(e) => setFormData({...formData, exitReason: e.target.value})}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit}>Confirm Deactivation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};