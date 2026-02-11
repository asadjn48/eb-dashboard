// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Save, Mail, Phone, User, Briefcase, DollarSign, Calendar } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// const departments = [
//   'Graphic Designer',
//   'Web Developer',
//   'App Developer',
//   'Instructor',
//   'AI Engineer',
// ];

// const AddEmployee: React.FC = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     designation: '',
//     department: '',
//     type: 'on-site',
//     status: 'active',
//     salary: '',
//     joinDate: ''
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       console.log('Employee Added:', formData);
//       setIsLoading(false);
//       navigate('/team'); // Redirect back to team list
//     }, 1000);
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
      
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-6">
//         <Button 
//           variant="ghost" 
//           size="sm" 
//           onClick={() => navigate('/team')}
//           className="text-gray-500 hover:text-gray-900"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Team
//         </Button>
//         <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Employee Details</CardTitle>
//           <p className="text-sm text-gray-500">Enter personal and professional information.</p>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               {/* Full Name */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Full Name</label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <Input 
//                     className="pl-10"
//                     placeholder="e.g. Asad Ullah" 
//                     required
//                     value={formData.name}
//                     onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Email Address</label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <Input 
//                     type="email"
//                     className="pl-10"
//                     placeholder="name@company.com" 
//                     required 
//                     value={formData.email}
//                     onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   />
//                 </div>
//               </div>

//               {/* Designation */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Designation / Role</label>
//                 <div className="relative">
//                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <Input 
//                     className="pl-10"
//                     placeholder="e.g. Senior React Developer" 
//                     required 
//                     value={formData.designation}
//                     onChange={(e) => setFormData({...formData, designation: e.target.value})}
//                   />
//                 </div>
//               </div>

//               {/* Department */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Department</label>
//                 <Select 
//                   value={formData.department} 
//                   onValueChange={(val) => setFormData({...formData, department: val})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Department" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {departments.map((dept) => (
//                       <SelectItem key={dept} value={dept}>{dept}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Work Type */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Work Type</label>
//                 <Select 
//                   value={formData.type} 
//                   onValueChange={(val) => setFormData({...formData, type: val})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="on-site">On-site</SelectItem>
//                     <SelectItem value="remote">Remote</SelectItem>
//                     <SelectItem value="alumni">Alumni</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Status */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Status</label>
//                 <Select 
//                   value={formData.status} 
//                   onValueChange={(val) => setFormData({...formData, status: val})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="inactive">Inactive</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Salary */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Salary</label>
//                 <div className="relative">
//                   <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <Input 
//                     type="number" 
//                     className="pl-10" 
//                     placeholder="0.00" 
//                     required 
//                     value={formData.salary}
//                     onChange={(e) => setFormData({...formData, salary: e.target.value})}
//                   />
//                 </div>
//               </div>

//               {/* Join Date */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Joining Date</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <Input 
//                     type="date"
//                     className="pl-10"
//                     value={formData.joinDate}
//                     onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
//                   />
//                 </div>
//               </div>

//               {/* Phone (Optional) */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Phone Number (Optional)</label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <Input 
//                     type="tel"
//                     className="pl-10"
//                     placeholder="+92..." 
//                     value={formData.phone}
//                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                   />
//                 </div>
//               </div>

//             </div>

//             <div className="flex justify-end gap-4 pt-4 border-t">
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => navigate('/team')}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="submit" 
//                 className="bg-[#5d88c6] hover:bg-[#4a6fa5]"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   'Saving...'
//                 ) : (
//                   <>
//                     <Save className="w-4 h-4 mr-2" />
//                     Save Employee
//                   </>
//                 )}
//               </Button>
//             </div>

//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AddEmployee;




























import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Mail, Phone, User, Briefcase, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { teamAPI } from '@/services/teamService';
import type { Department, EmployeeType } from '@/types';

const departments: Department[] = [
  'Graphic Designer', 'Web Developer', 'App Developer', 'Instructor', 'AI Engineer',
];

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: '' as Department,
    type: 'on-site' as EmployeeType,
    status: 'active' as 'active' | 'inactive',
    salary: '',
    joinDate: new Date().toISOString().split('T')[0],
    avatar: '' // Optional avatar URL
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await teamAPI.add({
        ...formData,
        salary: Number(formData.salary),
        // Add a default avatar if none provided
        avatar: formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=random`
      });
      navigate('/team');
    } catch (error) {
      console.error("Failed to add employee", error);
      alert("Failed to save employee. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/team')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input className="pl-9" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Asad Ullah" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input type="email" className="pl-9" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@company.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input className="pl-9" required value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} placeholder="e.g. Senior Dev" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={formData.department} onValueChange={(val) => setFormData({...formData, department: val as Department})}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Work Type</label>
                <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val as EmployeeType})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Salary (PKR)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input type="number" className="pl-9" required value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Joining Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input type="date" className="pl-9" required value={formData.joinDate} onChange={(e) => setFormData({...formData, joinDate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input className="pl-9" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+92..." />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/team')}>Cancel</Button>
              <Button type="submit" className="bg-slate-900" disabled={isLoading}>
                {isLoading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Employee</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEmployee;