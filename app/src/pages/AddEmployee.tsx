/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Save, Trash2, Eye, 
  User, Briefcase, CreditCard, MapPin, Home 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { teamAPI } from '@/services/teamService';
import type { Employee } from '@/types';

// Static Departments
const staticDepartments = ['Graphic Designer', 'Web Developer', 'App Developer', 'Instructor', 'AI Engineer', 'HR', 'Marketing'];

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  
  // Custom Department State
  const [isCustomDept, setIsCustomDept] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchEmp = async () => {
      if (!id) return;
      try {
        const data = await teamAPI.getById(id);
        if (data) {
          setEmployee(data);
          // Check if dept is custom
          if (data.department && !staticDepartments.includes(data.department)) {
             setIsCustomDept(true);
          }
        } else {
          alert("Employee not found");
          navigate('/team');
        }
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
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
    if (confirm("Are you sure you want to deactivate this employee? They will be moved to archives.")) {
        await teamAPI.update(id, { status: 'inactive', exitDate: new Date().toISOString() });
        navigate('/team');
    }
  }

  const handleDeptChange = (val: string) => {
    if (!employee) return;
    if (val === 'other') {
      setIsCustomDept(true);
      setEmployee({ ...employee, department: '' });
    } else {
      setIsCustomDept(false);
      setEmployee({ ...employee, department: val });
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading details...</div>;
  if (!employee) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate('/team')} className="h-9 w-9 rounded-full">
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Edit Employee</h1>
                <p className="text-sm text-gray-500">Update profile information.</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/team/profile/${id}`)}>
                <Eye className="w-4 h-4 mr-2" /> View Profile
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeactivate}>
                <Trash2 className="w-4 h-4 mr-2"/> Deactivate
            </Button>
            <Button className="bg-slate-900 text-white" size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info */}
          <Card>
            <CardHeader className="pb-3 border-b border-gray-100">
               <CardTitle className="text-base font-semibold flex items-center gap-2">
                 <User className="w-4 h-4 text-slate-500" /> Personal Information
               </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-xs">Full Name</Label>
                  <Input value={employee.name} onChange={e => setEmployee({...employee, name: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="space-y-1.5">
                  <Label className="text-xs">Email</Label>
                  <Input value={employee.email} onChange={e => setEmployee({...employee, email: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="space-y-1.5">
                  <Label className="text-xs">Phone</Label>
                  <Input value={employee.phone || ''} onChange={e => setEmployee({...employee, phone: e.target.value})} className="bg-slate-50/50" />
              </div>
            </CardContent>
          </Card>
          
          {/* Professional Details */}
          <Card>
            <CardHeader className="pb-3 border-b border-gray-100">
               <CardTitle className="text-base font-semibold flex items-center gap-2">
                 <Briefcase className="w-4 h-4 text-slate-500" /> Professional Details
               </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                  <Label className="text-xs">Designation</Label>
                  <Input value={employee.designation} onChange={e => setEmployee({...employee, designation: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="space-y-1.5">
                  <Label className="text-xs">Department</Label>
                  {!isCustomDept ? (
                    <Select value={staticDepartments.includes(employee.department) ? employee.department : 'other'} onValueChange={handleDeptChange}>
                      <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {staticDepartments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        <SelectItem value="other" className="text-blue-600 font-medium">Other (Custom)</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex gap-2">
                      <Input value={employee.department} onChange={e => setEmployee({...employee, department: e.target.value})} className="bg-blue-50 border-blue-200" placeholder="Type department..." />
                      <Button variant="ghost" size="icon" onClick={() => setIsCustomDept(false)}><ChevronLeft className="w-4 h-4" /></Button>
                    </div>
                  )}
              </div>
              <div className="space-y-1.5">
                  <Label className="text-xs">Salary (PKR)</Label>
                  <Input type="number" value={employee.salary} onChange={e => setEmployee({...employee, salary: Number(e.target.value)})} className="bg-slate-50/50" />
              </div>
              <div className="space-y-1.5">
                  <Label className="text-xs">Joining Date</Label>
                  <Input type="date" value={employee.joinDate} onChange={e => setEmployee({...employee, joinDate: e.target.value})} className="bg-slate-50/50" />
              </div>
            </CardContent>
          </Card>

          {/* Address Details */}
          <Card>
            <CardHeader className="pb-3 border-b border-gray-100">
               <CardTitle className="text-base font-semibold flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-slate-500" /> Address Details
               </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1"><Home className="w-3 h-3"/> Current Address</Label>
                  <Input value={employee.currentAddress || ''} onChange={e => setEmployee({...employee, currentAddress: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="space-y-1.5">
                  <Label className="text-xs">Permanent Address</Label>
                  <Input value={employee.homeAddress || ''} onChange={e => setEmployee({...employee, homeAddress: e.target.value})} className="bg-slate-50/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Status & Bank */}
        <div className="space-y-6">
          
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-gray-100">
               <CardTitle className="text-base font-semibold">Status & Type</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                  <Label className="text-xs">Current Status</Label>
                  <Select value={employee.status} onValueChange={(v: any) => setEmployee({...employee, status: v})}>
                      <SelectTrigger className="bg-slate-50/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-1.5">
                  <Label className="text-xs">Work Type</Label>
                  <Select value={employee.type} onValueChange={(v: any) => setEmployee({...employee, type: v})}>
                      <SelectTrigger className="bg-slate-50/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="on-site">On-Site</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="alumni">Alumni</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
            </CardContent>
          </Card>

          {/* Bank Info */}
          <Card className="border-blue-100 bg-blue-50/30">
            <CardHeader className="pb-3 border-b border-blue-100">
               <CardTitle className="text-base font-semibold flex items-center gap-2 text-blue-900">
                 <CreditCard className="w-4 h-4" /> Bank Information
               </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                  <Label className="text-xs text-blue-900/70">Bank Name</Label>
                  <Input value={employee.bankName || ''} onChange={e => setEmployee({...employee, bankName: e.target.value})} className="bg-white border-blue-200" />
              </div>
              <div className="space-y-1.5">
                  <Label className="text-xs text-blue-900/70">Account Number</Label>
                  <Input value={employee.accountNumber || ''} onChange={e => setEmployee({...employee, accountNumber: e.target.value})} className="bg-white border-blue-200 font-mono" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default EditEmployee;