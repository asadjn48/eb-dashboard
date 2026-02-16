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
import type { Employee, EmployeeStatus, EmployeeType } from '@/types';

// Static Departments
const staticDepartments = ['Graphic Designer', 'Web Developer', 'App Developer', 'Instructor', 'AI Engineer', 'HR', 'Marketing'];

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isCustomDept, setIsCustomDept] = useState(false);

  useEffect(() => {
    const fetchEmp = async () => {
      if (!id) return;
      try {
        const data = await teamAPI.getById(id);
        if (data) {
          setEmployee(data);
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
    } catch (error) { console.error(error); } 
    finally { setIsSaving(false); }
  };

  const handleDeactivate = async () => {
    if (!employee || !id) return;
    if (confirm("Deactivate this employee? They will be moved to archives.")) {
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

  // Helper to safely update state
  const updateField = (field: keyof Employee, value: any) => {
    if (employee) setEmployee({ ...employee, [field]: value });
  };

  if (isLoading) return <div className="p-10 text-center text-sm text-gray-500">Loading details...</div>;
  if (!employee) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20 animate-in fade-in duration-300">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate('/team')} className="h-8 w-8 rounded-full">
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none">Edit Employee</h1>
                <p className="text-xs text-gray-500 mt-0.5">Update profile information.</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/team/profile/${id}`)} className="h-8 text-xs">
                <Eye className="w-3.5 h-3.5 mr-1.5" /> View Profile
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeactivate} className="h-8 text-xs">
                <Trash2 className="w-3.5 h-3.5 mr-1.5"/> Deactivate
            </Button>
            <Button className="bg-slate-900 text-white h-8 text-xs" size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : <><Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes</>}
            </Button>
        </div>
      </div>

      {/* --- TOP ROW: Personal, Status, Bank --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Personal Info */}
        <Card className="h-full">
          <CardHeader className="py-3 px-4 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-500" /> Personal Information
              </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Full Name</Label>
                <Input value={employee.name} onChange={e => updateField('name', e.target.value)} className="h-8 bg-slate-50/50" />
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Email</Label>
                <Input value={employee.email} onChange={e => updateField('email', e.target.value)} className="h-8 bg-slate-50/50" />
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Phone</Label>
                <Input value={employee.phone || ''} onChange={e => updateField('phone', e.target.value)} className="h-8 bg-slate-50/50" />
            </div>
          </CardContent>
        </Card>

        {/* 2. Status & Type */}
        <Card className="h-full">
          <CardHeader className="py-3 px-4 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-500" /> Status & Type
              </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Current Status</Label>
                <Select value={employee.status} onValueChange={(v: EmployeeStatus) => updateField('status', v)}>
                    <SelectTrigger className="h-8 bg-slate-50/50 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Work Type</Label>
                <Select value={employee.type} onValueChange={(v: EmployeeType) => updateField('type', v)}>
                    <SelectTrigger className="h-8 bg-slate-50/50 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="on-site">On-Site</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
        </Card>

        {/* 3. Bank Info */}
        <Card className="h-full border-blue-100 bg-blue-50/30">
          <CardHeader className="py-3 px-4 border-b border-blue-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-900">
                <CreditCard className="w-3.5 h-3.5" /> Bank Information
              </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-blue-900/60 font-semibold tracking-wider">Bank Name</Label>
                <Input value={employee.bankName || ''} onChange={e => updateField('bankName', e.target.value)} className="h-8 bg-white border-blue-200" />
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-blue-900/60 font-semibold tracking-wider">Account Number</Label>
                <Input value={employee.accountNumber || ''} onChange={e => updateField('accountNumber', e.target.value)} className="h-8 bg-white border-blue-200 font-mono text-xs" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* --- BOTTOM ROW: Professional & Address --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 4. Professional Details */}
        <Card>
          <CardHeader className="py-3 px-4 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Professional Details
              </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Designation</Label>
                <Input value={employee.designation} onChange={e => updateField('designation', e.target.value)} className="h-8 bg-slate-50/50" />
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Department</Label>
                {!isCustomDept ? (
                  <Select value={staticDepartments.includes(employee.department) ? employee.department : 'other'} onValueChange={handleDeptChange}>
                    <SelectTrigger className="h-8 bg-slate-50/50 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {staticDepartments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      <SelectItem value="other" className="text-blue-600 font-medium">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex gap-2">
                    <Input value={employee.department} onChange={e => updateField('department', e.target.value)} className="h-8 bg-blue-50 border-blue-200" placeholder="Type department..." />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsCustomDept(false)}><ChevronLeft className="w-4 h-4" /></Button>
                  </div>
                )}
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Salary (PKR)</Label>
                <Input type="number" value={employee.salary} onChange={e => updateField('salary', Number(e.target.value))} className="h-8 bg-slate-50/50" />
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Joining Date</Label>
                <Input type="date" value={employee.joinDate} onChange={e => updateField('joinDate', e.target.value)} className="h-8 bg-slate-50/50" />
            </div>
          </CardContent>
        </Card>

        {/* 5. Address Details */}
        <Card>
          <CardHeader className="py-3 px-4 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> Address Details
              </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider flex items-center gap-1"><Home className="w-3 h-3"/> Current Address</Label>
                <Input value={employee.currentAddress || ''} onChange={e => updateField('currentAddress', e.target.value)} className="h-8 bg-slate-50/50" />
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Permanent Address</Label>
                <Input value={employee.homeAddress || ''} onChange={e => updateField('homeAddress', e.target.value)} className="h-8 bg-slate-50/50" />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default EditEmployee;