/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { teamAPI } from '@/services/teamService';
import type { Employee } from '@/types';

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);

  // Fetch Data
  useEffect(() => {
    const fetchEmp = async () => {
      if (!id) return;
      const data = await teamAPI.getById(id);
      if (data) {
        setEmployee(data);
      } else {
        alert("Employee not found");
        navigate('/team');
      }
      setIsLoading(false);
    };
    fetchEmp();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!employee || !id) return;
    setIsSaving(true);
    try {
      await teamAPI.update(id, employee);
      navigate('/team');
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!employee || !id) return;
    if (confirm("Are you sure you want to deactivate this employee?")) {
        await teamAPI.update(id, { status: 'inactive' });
        navigate('/team');
    }
  }

  if (isLoading) return <div className="p-10 text-center">Loading details...</div>;
  if (!employee) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ChevronLeft className="w-5 h-5" /></Button>
            <div><h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1><p className="text-gray-500">Update personal and role details.</p></div>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDeactivate}><Trash2 className="w-4 h-4 mr-2"/> Deactivate</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={employee.name} onChange={e => setEmployee({...employee, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={employee.email} onChange={e => setEmployee({...employee, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={employee.phone || ''} onChange={e => setEmployee({...employee, phone: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Professional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input value={employee.designation} onChange={e => setEmployee({...employee, designation: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Salary (PKR)</Label>
                    <Input type="number" value={employee.salary} onChange={e => setEmployee({...employee, salary: Number(e.target.value)})} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Status & Type</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Current Status</Label>
                    <Select value={employee.status} onValueChange={(v: any) => setEmployee({...employee, status: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Work Type</Label>
                    <Select value={employee.type} onValueChange={(v: any) => setEmployee({...employee, type: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="on-site">On-Site</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="alumni">Alumni</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full bg-slate-900" size="lg" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;