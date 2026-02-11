// /* eslint-disable react-hooks/immutability */
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Search, Briefcase, Calendar, UserX, RotateCcw, 
//   MoreVertical, Eye, Edit
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from '@/components/ui/badge';
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
//   DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
// } from '@/components/ui/dropdown-menu';
// import { teamAPI } from '@/services/teamService';
// import type { Employee } from '@/types';
// import { getInitials, formatCurrency } from '@/utils/formatters';

// const Alumni: React.FC = () => {
//   const navigate = useNavigate();
//   const [alumni, setAlumni] = useState<Employee[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // 1. Fetch Alumni (Only Inactive)
//   useEffect(() => {
//     fetchAlumni();
//   }, []);

//   const fetchAlumni = async () => {
//     setIsLoading(true);
//     // Note: teamAPI.getAll() by default filters, but we can do it client side here too for safety
//     const allData = await teamAPI.getAll(); 
//     const inactiveData = allData.filter(e => e.status === 'inactive');
//     setAlumni(inactiveData);
//     setIsLoading(false);
//   };

//   // 2. Reactivate Logic (Re-Hire)
//   const handleReactivate = async (emp: Employee) => {
//     if (confirm(`Are you sure you want to re-hire ${emp.name}?`)) {
//       try {
//         await teamAPI.update(emp.id, { 
//           status: 'active',
          
//           exitDate: '', 
//           exitReason: '' 
//         });
        
//         // Remove from list immediately
//         setAlumni(prev => prev.filter(a => a.id !== emp.id));
//       } catch (error) {
//         console.error("Reactivation failed", error);
//       }
//     }
//   };

//   const filteredAlumni = alumni.filter(emp => 
//     emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     emp.designation.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 pb-20">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Alumni Archives</h1>
//           <p className="text-gray-500">History of former employees and their exit details.</p>
//         </div>
//         <div className="relative w-full md:w-72">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <Input 
//             placeholder="Search alumni..." 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="text-center py-20 text-gray-500">Loading alumni...</div>
//       ) : filteredAlumni.length === 0 ? (
//         <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed text-gray-500">
//           No alumni records found.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredAlumni.map((emp) => (
//             <Card key={emp.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 bg-slate-50/50">
//               <CardContent className="p-0">
//                 {/* Header */}
//                 <div className="p-5 pb-0 flex justify-between items-start">
//                   <div className="flex items-center gap-3">
//                     <Avatar className="w-14 h-14 border-2 border-white shadow-sm grayscale group-hover:grayscale-0 transition-all">
//                       <AvatarImage src={emp.avatar} />
//                       <AvatarFallback>{getInitials(emp.name)}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h3 className="font-bold text-gray-900 text-lg">{emp.name}</h3>
//                       <p className="text-sm text-gray-500">{emp.designation}</p>
//                     </div>
//                   </div>
                  
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
//                         <MoreVertical className="w-4 h-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuLabel>Manage Alumni</DropdownMenuLabel>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem onClick={() => navigate(`/team/profile/${emp.id}`)}>
//                         <Eye className="w-4 h-4 mr-2" /> View Profile
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => navigate(`/team/edit/${emp.id}`)}>
//                         <Edit className="w-4 h-4 mr-2" /> Edit Record
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem onClick={() => handleReactivate(emp)} className="text-green-600 focus:text-green-700">
//                         <RotateCcw className="w-4 h-4 mr-2" /> Reactivate / Re-hire
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>

//                 {/* Exit Details */}
//                 <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-100 rounded-lg space-y-2">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-red-700 font-medium flex items-center gap-1.5">
//                       <Calendar className="w-3.5 h-3.5" /> Left On
//                     </span>
//                     <span className="font-bold text-gray-900">{emp.exitDate || 'Unknown'}</span>
//                   </div>
//                   <div className="flex justify-between items-start text-sm pt-1 border-t border-red-100/50">
//                     <span className="text-red-700 font-medium flex items-center gap-1.5 shrink-0 mt-0.5">
//                       <UserX className="w-3.5 h-3.5" /> Reason
//                     </span>
//                     <span className="text-right text-gray-700 text-xs leading-snug max-w-[150px]" title={emp.exitReason}>
//                       {emp.exitReason || 'No notes provided'}
//                     </span>
//                   </div>
//                   {emp.exitType && (
//                      <div className="flex justify-end">
//                         <Badge variant="outline" className="text-[10px] h-5 bg-white border-red-200 text-red-600">{emp.exitType}</Badge>
//                      </div>
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <div className="p-5 pt-4 space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500 flex items-center gap-2"><Briefcase className="w-4 h-4"/> Dept</span>
//                     <span className="font-medium">{emp.department}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Last Salary</span>
//                     <span className="font-mono text-gray-700">{formatCurrency(emp.salary)}</span>
//                   </div>
                  
//                   <Button 
//                     variant="outline" 
//                     className="w-full mt-2 border-slate-300 hover:bg-white hover:border-slate-400"
//                     onClick={() => navigate(`/team/profile/${emp.id}`)}
//                   >
//                     View Details
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Alumni;





































import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Briefcase, Calendar, UserX, RotateCcw, 
  MoreVertical, Eye, Edit, Trash2, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { teamAPI } from '@/services/teamService';
import type { Employee } from '@/types';
import { getInitials, formatCurrency, formatDate } from '@/utils/formatters';

const Alumni: React.FC = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Alumni (Only Inactive)
  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setIsLoading(true);
    try {
      const allData = await teamAPI.getAll(); 
      // Filter for inactive or terminated employees
      const inactiveData = allData.filter(e => e.status === 'inactive' || e.status === 'terminated');
      setAlumni(inactiveData);
    } catch (error) {
      console.error("Failed to load alumni", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Reactivate Logic (Re-Hire)
  const handleReactivate = async (emp: Employee) => {
    if (confirm(`Are you sure you want to re-hire ${emp.name}? This will move them back to the active Team list.`)) {
      try {
        await teamAPI.update(emp.id, { 
          status: 'active',
          exitDate: '', 
          exitReason: '',
          exitType: ''
        });
        
        // Remove from list immediately
        setAlumni(prev => prev.filter(a => a.id !== emp.id));
      } catch (error) {
        console.error("Reactivation failed", error);
        alert("Failed to re-activate employee.");
      }
    }
  };

  // 3. Permanent Delete
  const handleDelete = async (id: string) => {
    if (confirm("This will permanently delete this record from the database. This cannot be undone. Continue?")) {
      try {
        await teamAPI.delete(id);
        setAlumni(prev => prev.filter(a => a.id !== id));
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  }

  const filteredAlumni = alumni.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/team')} className="text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alumni Archives</h1>
            <p className="text-gray-500 text-sm">History of former employees and exit details.</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search alumni..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Loading archives...</div>
      ) : filteredAlumni.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed text-gray-500">
          No alumni records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((emp) => (
            <Card key={emp.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 bg-slate-50/30">
              <CardContent className="p-0">
                
                {/* Card Header */}
                <div className="p-5 pb-0 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-14 h-14 border-2 border-white shadow-sm grayscale group-hover:grayscale-0 transition-all">
                      <AvatarImage src={emp.avatar} className="object-cover" />
                      <AvatarFallback className="bg-slate-200 text-slate-500">{getInitials(emp.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{emp.name}</h3>
                      <p className="text-sm text-gray-500">{emp.designation}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Manage Record</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(`/team/profile/${emp.id}`)}>
                        <Eye className="w-4 h-4 mr-2 text-gray-500" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/team/edit/${emp.id}`)}>
                        <Edit className="w-4 h-4 mr-2 text-gray-500" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleReactivate(emp)} className="text-green-600 focus:text-green-700">
                        <RotateCcw className="w-4 h-4 mr-2" /> Re-hire / Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(emp.id)} className="text-red-600 focus:text-red-700">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Permanently
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Exit Info Section */}
                <div className="mx-5 mt-4 p-3 bg-red-50/50 border border-red-100 rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-700 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Left On
                    </span>
                    <span className="font-bold text-gray-900">{emp.exitDate ? formatDate(emp.exitDate) : 'Unknown'}</span>
                  </div>
                  
                  {emp.exitReason && (
                    <div className="flex justify-between items-start text-sm pt-2 border-t border-red-100/50">
                      <span className="text-red-700 font-medium flex items-center gap-1.5 shrink-0 mt-0.5">
                        <UserX className="w-3.5 h-3.5" /> Reason
                      </span>
                      <span className="text-right text-gray-600 text-xs leading-snug max-w-[150px] line-clamp-2" title={emp.exitReason}>
                        {emp.exitReason}
                      </span>
                    </div>
                  )}

                  {emp.exitType && (
                      <div className="flex justify-end pt-1">
                        <Badge variant="outline" className="text-[10px] h-5 bg-white border-red-200 text-red-600 capitalize">
                          {emp.exitType}
                        </Badge>
                      </div>
                  )}
                </div>

                {/* Footer Info */}
                <div className="p-5 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Briefcase className="w-4 h-4"/> Dept</span>
                    <span className="font-medium text-gray-700">{emp.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Salary</span>
                    <span className="font-mono text-gray-700 font-medium">{formatCurrency(emp.salary)}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-600"
                    onClick={() => navigate(`/team/profile/${emp.id}`)}
                  >
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alumni;