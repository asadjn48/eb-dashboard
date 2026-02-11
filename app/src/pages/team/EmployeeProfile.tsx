import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mail, Phone, Briefcase, Edit3, RotateCcw, 
  UserX, ShieldOff, Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitials, formatCurrency } from '@/utils/formatters';
import { teamAPI } from '@/services/teamService';
import { DeactivateModal } from '@/components/team/DeactivateModal';
import type { Employee } from '@/types';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  // 1. Load Data
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const data = await teamAPI.getById(id);
        setEmployee(data || null);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  // 2. Handle Reactivate (Re-Hire)
  const handleReactivate = async () => {
    if (!employee) return;
    const confirmed = window.confirm(`Are you sure you want to re-hire ${employee.name}?`);
    
    if (confirmed) {
      try {
        await teamAPI.update(employee.id, { 
          status: 'active',
          exitDate: undefined,
          exitType: undefined,
          exitReason: undefined
        });
        // Update local state to reflect change immediately
        setEmployee({ 
          ...employee, 
          status: 'active', 
          exitDate: undefined, 
          exitType: undefined, 
          exitReason: undefined 
        });
      } catch (error) {
        console.error("Reactivation failed", error);
      }
    }
  };

  // 3. Handle Deactivate (Open Modal)
  const handleDeactivateClick = () => {
    setIsDeactivateOpen(true);
  };

  // 4. Confirm Deactivation (From Modal)
  const handleDeactivateConfirm = async (data: { exitDate: string; exitType: string; exitReason: string }) => {
    if (!employee) return;
    try {
      await teamAPI.update(employee.id, {
        status: 'inactive',
        ...data
      });
      // Update local state
      setEmployee({ 
        ...employee, 
        status: 'inactive', 
        ...data 
      });
    } catch (error) {
      console.error("Deactivation failed", error);
    }
    setIsDeactivateOpen(false);
  };

  if (isLoading) return <div className="p-10 text-center">Loading profile...</div>;
  if (!employee) return <div className="p-10 text-center">Employee not found.</div>;

  const isAlumni = employee.status === 'inactive';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* --- HEADER CARD --- */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
        <Avatar className={`w-24 h-24 border-4 border-white shadow-md ${isAlumni ? 'grayscale' : ''}`}>
          <AvatarImage src={employee.avatar} />
          <AvatarFallback className="text-2xl bg-slate-900 text-white">{getInitials(employee.name)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
              <p className="text-gray-500 font-medium">{employee.designation} • {employee.department}</p>
            </div>
            
            {/* ACTION BUTTONS */}
            <div className="flex gap-2">
              {isAlumni ? (
                
                <Button onClick={handleReactivate} className="bg-green-600 hover:bg-green-700 shadow-sm">
                  <RotateCcw className="w-4 h-4 mr-2" /> Re-hire / Reactivate
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate(`/team/edit/${id}`)}>
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" onClick={handleDeactivateClick}>
                    <ShieldOff className="w-4 h-4 mr-2" /> Deactivate
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400"/> {employee.email}</span>
            {employee.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400"/> {employee.phone}</span>}
          </div>

          <div className="flex gap-2 mt-4">
            <Badge className={!isAlumni ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>
                {isAlumni ? 'Alumni / Inactive' : 'Active Employee'}
            </Badge>
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 capitalize">{employee.type}</Badge>
          </div>
        </div>
      </div>

      {/* --- ALUMNI ALERT BANNER --- */}
      {isAlumni && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row gap-6 animate-in slide-in-from-top-2">
          <div className="flex-1">
            <h3 className="text-red-800 font-bold flex items-center gap-2 mb-2">
              <UserX className="w-5 h-5"/> Employment Ended ({employee.exitType || 'Left'})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/60 p-2 rounded border border-red-100">
                <span className="text-red-600 font-medium flex items-center gap-1"><Calendar className="w-3 h-3"/> Left On:</span>
                <span className="text-gray-800 font-medium">{employee.exitDate || 'N/A'}</span>
              </div>
              <div className="bg-white/60 p-2 rounded border border-red-100">
                <span className="text-red-600 font-medium block">Reason:</span>
                <span className="text-gray-800 italic">"{employee.exitReason || 'No reason provided'}"</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TABS --- */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent rounded-none p-0 space-x-6">
          <TabsTrigger value="overview" className="tab-trigger">Overview</TabsTrigger>
          {/* Removed Settings Tab as actions are now in Header */}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader><CardTitle>Financial Info</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Base Salary</span>
                        <span className="font-mono font-medium text-lg">{formatCurrency(employee.salary)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Joined</span>
                        <span className="font-medium">{employee.joinDate}</span>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Role Overview</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-gray-400"/>
                        <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">{employee.department}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* --- MODAL --- */}
      <DeactivateModal
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={handleDeactivateConfirm}
        employeeName={employee.name}
      />
    </div>
  );
};

export default EmployeeProfile;