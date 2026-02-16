/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mail, Phone, Briefcase, Edit3, RotateCcw, 
  UserX, ShieldOff, Calendar, CreditCard, 
  MapPin, Building2, ChevronLeft, Home, DollarSign, Wallet, UserCheck, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/formatters';
import { teamAPI } from '@/services/teamService';
import { DeactivateModal } from '@/components/team/DeactivateModal';
import type { Employee } from '@/types';
import { cn } from '@/lib/utils';

// Helper for Info Rows (Compact)
const InfoRow = ({ icon: Icon, label, value, className, valueClass }: any) => (
  <div className={cn("space-y-0.5", className)}>
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-400">
      <Icon className="w-3 h-3" /> {label}
    </div>
    <div className={cn("font-medium text-gray-900 text-sm truncate", valueClass)} title={value}>
      {value || <span className="text-gray-300 italic text-xs">Not provided</span>}
    </div>
  </div>
);

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const data = await teamAPI.getById(id);
        setEmployee(data || null);
      } catch (error) { console.error(error); } 
      finally { setIsLoading(false); }
    };
    loadData();
  }, [id]);

  const handleReactivate = async () => {
    if (!employee || !confirm(`Re-hire ${employee.name}?`)) return;
    try {
      await teamAPI.update(employee.id, { 
        status: 'active', exitDate: undefined, exitType: undefined, exitReason: undefined 
      });
      setEmployee(prev => prev ? ({ ...prev, status: 'active', exitDate: undefined }) : null);
    } catch (e) { console.error(e); }
  };

  const handleDeactivateConfirm = async (data: any) => {
    if (!employee) return;
    try {
      await teamAPI.update(employee.id, { status: 'inactive', ...data });
      setEmployee(prev => prev ? ({ ...prev, status: 'inactive', ...data }) : null);
    } catch (e) { console.error(e); }
    setIsDeactivateOpen(false);
  };

  if (isLoading) return <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading profile...</div>;
  if (!employee) return <div className="h-full flex items-center justify-center text-gray-400 text-sm">Employee not found.</div>;

  const isAlumni = employee.status === 'inactive';

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-300">
      
      {/* --- HEADER (Preserved) --- */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/team')} className="text-gray-500 hover:text-gray-900 -ml-2 h-8">
             <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="h-4 w-px bg-gray-200 mx-1" />
          <span className="text-sm font-semibold text-gray-700">Employee Details</span>
        </div>
        
        <div className="flex gap-2">
          {isAlumni ? (
            <Button size="sm" onClick={handleReactivate} className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs">
              <RotateCcw className="w-3 h-3 mr-1.5" /> Re-hire
            </Button>
          ) : (
            <>
              <Button size="sm" variant="outline" className="h-8 text-xs bg-white shadow-sm" onClick={() => navigate(`/team/edit/${id}`)}>
                <Edit3 className="w-3 h-3 mr-1.5" /> Edit
              </Button>
              <Button size="sm" variant="destructive" className="h-8 text-xs shadow-sm" onClick={() => setIsDeactivateOpen(true)}>
                <ShieldOff className="w-3 h-3 mr-1.5" /> Remove
              </Button>
            </>
          )}
        </div>
      </div>

      {/* --- MAIN DASHBOARD LAYOUT --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        
        {/* LEFT COLUMN: Identity & Contact (3 Cols) */}
        <Card className="lg:col-span-3 flex flex-col p-5 border-gray-200 shadow-sm bg-white h-full overflow-y-auto">
          
          {/* Identity Section */}
          <div className="mb-6">
             {/* --- CLICKABLE NAME REDIRECTS TO PAYROLL --- */}
             <div 
               className="group flex items-center gap-2 cursor-pointer w-fit" 
               onClick={() => navigate('/payroll')}
               title="Go to Payroll Ledger"
             >
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                  {employee.name}
                </h1>
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all mt-1" />
             </div>

             <p className="text-sm text-gray-500 font-medium mt-1 flex items-center gap-2">
                {employee.designation}
             </p>
             
             <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className={cn("text-[10px] px-2 py-0.5", isAlumni ? "bg-gray-100 text-gray-600" : "bg-emerald-50 text-emerald-700 border-emerald-100")}>
                  {isAlumni ? 'Alumni' : 'Active'}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 capitalize text-blue-600 bg-blue-50 border-blue-100">
                  {employee.type}
                </Badge>
             </div>
          </div>

          <Separator className="mb-6" />

          {/* Contact Details */}
          <div className="space-y-5">
             <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Email Address</label>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                   <Mail className="w-3.5 h-3.5 text-gray-400" />
                   <span className="truncate">{employee.email}</span>
                </div>
             </div>
             
             <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Phone Number</label>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                   <Phone className="w-3.5 h-3.5 text-gray-400" />
                   <span>{employee.phone || 'N/A'}</span>
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Current Status</label>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                   <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                   <span className="capitalize">{employee.status}</span>
                </div>
             </div>
          </div>
        </Card>

        {/* RIGHT COLUMN: Details Grid (9 Cols) */}
        <div className="lg:col-span-9 flex flex-col gap-4 h-full overflow-y-auto">
          
          {/* Top Row: Professional & Financial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
             
             {/* Employment Details */}
             <Card className="p-5 border-gray-200 shadow-sm bg-white">
                <div className="flex items-center gap-2 mb-4">
                   <div className="p-1.5 bg-blue-50 rounded text-blue-600"><Briefcase className="w-4 h-4" /></div>
                   <h3 className="font-bold text-gray-900 text-sm">Employment Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                   <InfoRow icon={Building2} label="Department" value={employee.department} valueClass="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs inline-block" />
                   <InfoRow icon={Calendar} label="Joining Date" value={new Date(employee.joinDate).toLocaleDateString(undefined, { dateStyle: 'medium' })} />
                   <InfoRow icon={Briefcase} label="Designation" value={employee.designation} />
                   <InfoRow icon={CreditCard} label="Work Type" value={employee.type} className="capitalize" />
                </div>
             </Card>

             {/* Financial Information */}
             <Card className="p-5 border-gray-200 shadow-sm bg-white">
                <div className="flex items-center gap-2 mb-4">
                   <div className="p-1.5 bg-emerald-50 rounded text-emerald-600"><Wallet className="w-4 h-4" /></div>
                   <h3 className="font-bold text-gray-900 text-sm">Financial Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                   <div className="col-span-2 mb-1">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">
                         <DollarSign className="w-3 h-3" /> Monthly Salary
                      </div>
                      <div className="text-2xl font-bold text-gray-900 bg-emerald-50/50 inline-block px-2 rounded -ml-2">
                        {formatCurrency(employee.salary)}
                      </div>
                   </div>
                   <InfoRow icon={Building2} label="Bank Name" value={employee.bankName} />
                   <InfoRow icon={CreditCard} label="Account / IBAN" value={employee.accountNumber} valueClass="font-mono text-xs text-slate-600" />
                </div>
             </Card>
          </div>

          {/* Bottom Row: Address & Exit (if applicable) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
             
             {/* Address Details */}
             <Card className={cn("p-5 border-gray-200 shadow-sm bg-white", isAlumni ? "md:col-span-1" : "md:col-span-2")}>
                <div className="flex items-center gap-2 mb-4">
                   <div className="p-1.5 bg-purple-50 rounded text-purple-600"><MapPin className="w-4 h-4" /></div>
                   <h3 className="font-bold text-gray-900 text-sm">Address Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <InfoRow icon={MapPin} label="Current Address" value={employee.currentAddress} />
                   <InfoRow icon={Home} label="Permanent Address" value={employee.homeAddress} />
                </div>
             </Card>

             {/* Exit Details (Alumni Only) */}
             {isAlumni && (
               <Card className="p-5 border-red-100 shadow-sm bg-red-50/30">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="p-1.5 bg-red-100 rounded text-red-600"><UserX className="w-4 h-4" /></div>
                     <h3 className="font-bold text-red-900 text-sm">Separation Details</h3>
                  </div>
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <InfoRow icon={Calendar} label="Exit Date" value={new Date(employee.exitDate || '').toLocaleDateString()} valueClass="text-red-900" />
                        <InfoRow icon={UserX} label="Exit Type" value={employee.exitType} valueClass="capitalize text-red-900" />
                     </div>
                     <div className="bg-white/60 p-2.5 rounded border border-red-100">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Reason</span>
                        <p className="text-xs text-red-900 italic">"{employee.exitReason || 'No reason recorded'}"</p>
                     </div>
                  </div>
               </Card>
             )}
          </div>

        </div>
      </div>

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