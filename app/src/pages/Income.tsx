// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, Plus, Filter, LayoutDashboard } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card } from '@/components/ui/card';
// import { formatCurrency } from '@/utils/formatters';

// import { IncomeTable } from '@/components/income/IncomeTable';
// import { ProjectModal } from '@/components/projects/ProjectModal';
// import { ProjectHistoryModal } from '@/components/income/ProjectHistoryModal';
// import { ProjectPaymentModal } from '@/components/income/ProjectPaymentModal'; 

// import { projectAPI } from '@/services/projectService'; 
// import type { Project } from '@/types';

// const Income: React.FC = () => {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // --- Modal States ---
//   const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
//   const [editingProject, setEditingProject] = useState<Project | null>(null);
  
//   const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
//   const [historyProject, setHistoryProject] = useState<Project | null>(null);

//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [paymentProject, setPaymentProject] = useState<Project | null>(null);

//   // --- Filters State ---
//   const [searchQuery, setSearchQuery] = useState('');
//   const [yearFilter, setYearFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // --- Fetch Data ---
//   useEffect(() => {
//     const loadIncomeData = async () => {
//       setIsLoading(true);
//       try {
//         const data = await projectAPI.getAll();
//         setProjects(data);
//       } catch (error) {
//         console.error("Failed to load income data", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadIncomeData();
//   }, []);

//   const availableYears = useMemo(() => {
//     const years = new Set<string>();
//     projects.forEach(p => {
//       if (p.startDate) years.add(p.startDate.substring(0, 4));
//     });
//     return Array.from(years).sort((a, b) => Number(b) - Number(a)); 
//   }, [projects]);

//   const filteredData = useMemo(() => {
//     return projects.filter(project => {
//       const searchLower = searchQuery.toLowerCase();
//       const matchSearch = 
//         (project.name || '').toLowerCase().includes(searchLower) || 
//         ((project as any).clientName || '').toLowerCase().includes(searchLower);

//       const projectYear = project.startDate ? project.startDate.substring(0, 4) : '';
//       const matchYear = yearFilter === 'all' || projectYear === yearFilter;

//       const received = (project as any).receivedAmount || 0;
//       const budget = project.budget || 0;
//       let paymentStatus = 'pending';
//       if (received >= budget && budget > 0) paymentStatus = 'cleared';
//       else if (received > 0) paymentStatus = 'partial';
      
//       const matchStatus = statusFilter === 'all' || paymentStatus === statusFilter;

//       return matchSearch && matchYear && matchStatus;
//     }).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
//   }, [projects, searchQuery, yearFilter, statusFilter]);

//   const summary = useMemo(() => {
//     let totalIncome = 0;
//     let totalReceived = 0;
//     filteredData.forEach(p => {
//       totalIncome += (p.budget || 0);
//       totalReceived += ((p as any).receivedAmount || 0);
//     });
//     return {
//       totalIncome,
//       totalReceived,
//       totalPending: Math.max(0, totalIncome - totalReceived)
//     };
//   }, [filteredData]);

//   // --- Action Handlers ---
//   const handleView = (id: string) => navigate(`/projects/${id}`);
  
//   const handleEdit = (id: string) => {
//     const projectToEdit = projects.find(p => p.id === id);
//     if (projectToEdit) {
//       setEditingProject(projectToEdit);
//       setIsProjectModalOpen(true);
//     }
//   };

//   const handleHistory = (id: string) => {
//     const projectForHistory = projects.find(p => p.id === id);
//     if (projectForHistory) {
//       setHistoryProject(projectForHistory);
//       setIsHistoryModalOpen(true);
//     }
//   };

//   const handlePayment = (id: string) => {
//     const proj = projects.find(p => p.id === id);
//     if (proj) { 
//       setPaymentProject(proj); 
//       setIsPaymentModalOpen(true); 
//     }
//   };

//   // FIXED: Now saves individual payment objects to a `payments` array
//   const handleSavePayment = async (projectId: string, amount: number, notes: string) => {
//     const project = projects.find(p => p.id === projectId);
//     if (project) {
//        const currentReceived = (project as any).receivedAmount || 0;
//        const currentPayments = (project as any).payments || []; // Fetch existing payment history

//        const newPaymentRecord = {
//          id: Date.now().toString(),
//          amount: amount,
//          notes: notes,
//          date: new Date().toISOString()
//        };

//        const updated = { 
//          receivedAmount: currentReceived + amount,
//          payments: [...currentPayments, newPaymentRecord] // Append new payment to history
//        };

//        await projectAPI.update(projectId, updated);
//        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updated } as Project : p));
       
//        // Force update the history modal if it happens to be open
//        setHistoryProject(prev => prev && prev.id === projectId ? { ...prev, ...updated } as Project : prev);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm("Are you sure you want to delete this project record?")) {
//       await projectAPI.delete(id);
//       setProjects(prev => prev.filter(p => p.id !== id));
//     }
//   };

//   const handleSaveProject = async (data: Partial<Project>) => {
//     if (editingProject) {
//       await projectAPI.update(editingProject.id, data);
//       setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...data } as Project : p));
//     } else {
//       const newProjPayload = {
//         ...data,
//         expenses: 0,
//         profit: data.budget || 0,
//         progress: 0,
//         status: 'active' as const,
//         payments: [], // Initialize with empty payments array
//         createdAt: new Date().toISOString()
//       };
      
//       const newId = await projectAPI.add(newProjPayload as unknown as Omit<Project, 'id'>);
      
//       const newProjectRecord: Project = {
//           ...newProjPayload,
//           id: typeof newId === 'string' ? newId : (newId as any).id || Date.now().toString()
//       } as unknown as Project;

//       setProjects(prev => [newProjectRecord, ...prev]);
//     }
//   };

//   return (
//     <div className="space-y-6 pb-20 animate-in fade-in duration-500 pt-2 w-full">
      
//       <div>
//         <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
//           <LayoutDashboard className="w-6 h-6 text-[#5d88c6]" /> Net Income
//         </h1>
//         <p className="text-sm font-medium text-slate-500 mt-1">Track project budgets, receivables, investments, and outstanding balances.</p>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//          <div className="bg-white border border-slate-200/60 shadow-sm p-5 rounded-2xl">
//             <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Project Income</p>
//             <p className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(summary.totalIncome)}</p>
//          </div>
//          <div className="bg-emerald-50 border border-emerald-100 shadow-sm p-5 rounded-2xl">
//             <p className="text-[10px] font-extrabold text-emerald-600/70 uppercase tracking-widest">Total Amount Received</p>
//             <p className="text-2xl font-extrabold text-emerald-700 mt-1">{formatCurrency(summary.totalReceived)}</p>
//          </div>
//          <div className="bg-rose-50 border border-rose-100 shadow-sm p-5 rounded-2xl">
//             <p className="text-[10px] font-extrabold text-rose-600/70 uppercase tracking-widest">Total Pending Amount</p>
//             <p className="text-2xl font-extrabold text-rose-700 mt-1">{formatCurrency(summary.totalPending)}</p>
//          </div>
//       </div>

//       {/* Main Table Card */}
//       <Card className="border border-slate-200/60 shadow-sm overflow-hidden bg-white rounded-2xl flex flex-col min-h-[500px]">
//         <div className="px-5 py-4 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between items-center bg-slate-50/50">
          
//           <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
//             <div className="relative w-full sm:w-[250px]">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <Input 
//                 placeholder="Search project or client..." 
//                 value={searchQuery} 
//                 onChange={e => setSearchQuery(e.target.value)} 
//                 className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-lg focus-visible:ring-[#5d88c6]" 
//               />
//             </div>

//             <Select value={yearFilter} onValueChange={setYearFilter}>
//               <SelectTrigger className="w-[110px] h-9 text-xs bg-white border-slate-200 rounded-lg font-medium shadow-none">
//                 <SelectValue placeholder="Year" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Years</SelectItem>
//                 {availableYears.map(yr => (
//                   <SelectItem key={yr} value={yr}>{yr}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-[140px] h-9 text-xs bg-white border-slate-200 rounded-lg font-medium shadow-none">
//                 <Filter className="w-3 h-3 mr-2 text-slate-400 inline" />
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Statuses</SelectItem>
//                 <SelectItem value="cleared">Paid / Cleared</SelectItem>
//                 <SelectItem value="partial">Partially Paid</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <Button 
//             onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }} 
//             className="w-full xl:w-auto bg-slate-900 hover:bg-slate-800 text-white h-9 text-xs font-bold rounded-lg px-5 shadow-sm shrink-0 transition-transform active:scale-95"
//           >
//             <Plus className="w-3.5 h-3.5 mr-1.5" /> Add project details
//           </Button>
//         </div>

//         <div className="flex-1 bg-white relative">
//           <IncomeTable 
//             data={filteredData} 
//             isLoading={isLoading} 
//             onView={handleView}
//             onEdit={handleEdit}
//             onHistory={handleHistory}
//             onPayment={handlePayment}
//             onDelete={handleDelete}
//           />
//         </div>
//       </Card>

//       {/* --- MODALS --- */}
      
//       {/* 1. Add/Edit Project Modal (Includes Investors) */}
//       <ProjectModal 
//         isOpen={isProjectModalOpen} 
//         onClose={() => setIsProjectModalOpen(false)} 
//         onSave={handleSaveProject} 
//         initialData={editingProject} 
//       />

//       {/* 2. Project Payment History Ledger */}
//       <ProjectHistoryModal 
//         isOpen={isHistoryModalOpen}
//         onClose={() => setIsHistoryModalOpen(false)}
//         project={historyProject}
//       />

//       {/* 3. Log New Payment Modal */}
//       <ProjectPaymentModal 
//         isOpen={isPaymentModalOpen}
//         onClose={() => setIsPaymentModalOpen(false)}
//         project={paymentProject}
//         onSave={handleSavePayment}
//       />

//     </div>
//   );
// };

// export default Income;










































/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, LayoutDashboard, Download, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

import { IncomeTable } from '@/components/income/IncomeTable';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { ProjectHistoryModal } from '@/components/income/ProjectHistoryModal';
import { ProjectPaymentModal } from '@/components/income/ProjectPaymentModal'; 

import { projectAPI } from '@/services/projectService'; 
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

const Income: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  // --- Modal States ---
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyProject, setHistoryProject] = useState<Project | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentProject, setPaymentProject] = useState<Project | null>(null);

  // --- Filters State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // --- Fetch Data ---
  const loadIncomeData = async () => {
    setIsLoading(true);
    try {
      const data = await projectAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load income data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadIncomeData(); }, []);

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    projects.forEach(p => {
      if (p.startDate) years.add(p.startDate.substring(0, 4));
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a)); 
  }, [projects]);

  const filteredData = useMemo(() => {
    return projects.filter(project => {
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = 
        (project.name || '').toLowerCase().includes(searchLower) || 
        ((project as any).clientName || '').toLowerCase().includes(searchLower);

      const projectYear = project.startDate ? project.startDate.substring(0, 4) : '';
      const matchYear = yearFilter === 'all' || projectYear === yearFilter;

      const received = (project as any).receivedAmount || 0;
      const budget = project.budget || 0;
      
      // FIXED: Ensure status logic matches the table exactly
      let paymentStatus = 'pending';
      if (received > budget && budget > 0) paymentStatus = 'overpaid';
      else if (received === budget && budget > 0) paymentStatus = 'cleared';
      else if (received > 0) paymentStatus = 'partial';
      
      const matchStatus = statusFilter === 'all' || paymentStatus === statusFilter;

      return matchSearch && matchYear && matchStatus;
    }).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [projects, searchQuery, yearFilter, statusFilter]);

  const summary = useMemo(() => {
    let totalIncome = 0;
    let totalReceived = 0;
    filteredData.forEach(p => {
      totalIncome += (p.budget || 0);
      totalReceived += ((p as any).receivedAmount || 0);
    });
    return {
      totalIncome,
      totalReceived,
      // FIXED: Allow negative pending on summary if overall is overpaid
      totalPending: totalIncome - totalReceived 
    };
  }, [filteredData]);

  // --- Action Handlers ---
  const handleView = (id: string) => navigate(`/projects/${id}`);
  
  const handleEdit = (id: string) => {
    const projectToEdit = projects.find(p => p.id === id);
    if (projectToEdit) {
      setEditingProject(projectToEdit);
      setIsProjectModalOpen(true);
    }
  };

  const handleHistory = (id: string) => {
    const projectForHistory = projects.find(p => p.id === id);
    if (projectForHistory) {
      setHistoryProject(projectForHistory);
      setIsHistoryModalOpen(true);
    }
  };

  const handlePayment = (id: string) => {
    const proj = projects.find(p => p.id === id);
    if (proj) { 
      setPaymentProject(proj); 
      setIsPaymentModalOpen(true); 
    }
  };

  const handleSavePayment = async (projectId: string, amount: number, notes: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
       const currentReceived = (project as any).receivedAmount || 0;
       const currentPayments = (project as any).payments || [];

       const newPaymentRecord = {
         id: Date.now().toString(),
         amount: amount,
         notes: notes,
         date: new Date().toISOString()
       };

       const updated = { 
         receivedAmount: currentReceived + amount,
         payments: [...currentPayments, newPaymentRecord] 
       };

       await projectAPI.update(projectId, updated);
       setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updated } as Project : p));
       setHistoryProject(prev => prev && prev.id === projectId ? { ...prev, ...updated } as Project : prev);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project record?")) {
      await projectAPI.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveProject = async (data: Partial<Project>) => {
    if (editingProject) {
      await projectAPI.update(editingProject.id, data);
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...data } as Project : p));
    } else {
      const newProjPayload = {
        ...data,
        expenses: 0,
        profit: data.budget || 0,
        progress: 0,
        status: 'active' as const,
        payments: [], 
        createdAt: new Date().toISOString()
      };
      
      const newId = await projectAPI.add(newProjPayload as unknown as Omit<Project, 'id'>);
      const newProjectRecord: Project = {
        ...newProjPayload,
        id: typeof newId === 'string' ? newId : (newId as any).id || Date.now().toString()
      } as unknown as Project;

      setProjects(prev => [newProjectRecord, ...prev]);
    }
  };

  // --- CSV Export ---
  const handleExportCSV = () => {
    const headers = ['Project Name', 'Client Name', 'Budget/Income', 'Amount Received', 'Status', 'Start Date', 'Total Investors'];
    const rows = filteredData.map((item: any) => {
      const received = item.receivedAmount || 0;
      const budget = item.budget || 0;
      let status = 'Pending';
      if (received > budget && budget > 0) status = 'Overpaid';
      else if (received === budget && budget > 0) status = 'Cleared';
      else if (received > 0) status = 'Partial';

      const numInvestors = (item.investors || []).length;

      return `"${item.name}","${item.clientName || ''}",${budget},${received},"${status}","${item.startDate}",${numInvestors}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Income_Projects_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CSV Import ---
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        // Basic CSV parsing (splitting by new lines, then splitting by commas assuming no complex nested quotes for simplicity in import)
        const lines = text.split('\n');
        if (lines.length <= 1) throw new Error("CSV is empty or invalid");

        let importCount = 0;
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Simple split, ignoring robust quote parsing for now to keep it lightweight
          // Format expected: ProjectName, ClientName, Budget, Received
          const cols = line.split(','); 
          if (cols.length >= 3) {
            const name = cols[0].replace(/"/g, '').trim();
            const clientName = cols[1].replace(/"/g, '').trim();
            const budget = parseFloat(cols[2].replace(/"/g, '')) || 0;
            const receivedAmount = cols[3] ? (parseFloat(cols[3].replace(/"/g, '')) || 0) : 0;

            if (name) {
               await projectAPI.add({
                 name,
                 clientName,
                 budget,
                 receivedAmount,
                 expenses: 0,
                 profit: budget,
                 progress: 0,
                 status: 'active',
                 type: 'commercial',
                 subType: 'General',
                 startDate: new Date().toISOString().split('T')[0],
                 payments: receivedAmount > 0 ? [{ id: Date.now().toString(), amount: receivedAmount, notes: 'Imported Balance', date: new Date().toISOString() }] : [],
                 createdAt: new Date().toISOString()
               } as unknown as Omit<Project, 'id'>);
               importCount++;
            }
          }
        }
        alert(`Successfully imported ${importCount} projects!`);
        loadIncomeData(); // Reload table
      } catch (error) {
        alert("Failed to parse CSV. Please ensure it follows the correct format.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 pt-2 w-full">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-[#5d88c6]" /> Net Income
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Track project budgets, receivables, investments, and outstanding balances.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white border border-slate-200/60 shadow-sm p-5 rounded-2xl">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Project Income</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(summary.totalIncome)}</p>
         </div>
         <div className="bg-emerald-50 border border-emerald-100 shadow-sm p-5 rounded-2xl">
            <p className="text-[10px] font-extrabold text-emerald-600/70 uppercase tracking-widest">Total Amount Received</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{formatCurrency(summary.totalReceived)}</p>
         </div>
         <div className="bg-rose-50 border border-rose-100 shadow-sm p-5 rounded-2xl">
            <p className="text-[10px] font-extrabold text-rose-600/70 uppercase tracking-widest">Total Pending Amount</p>
            <p className={cn("text-2xl font-extrabold mt-1", summary.totalPending < 0 ? "text-purple-700" : "text-rose-700")}>
               {summary.totalPending < 0 ? `+${formatCurrency(Math.abs(summary.totalPending))} (Over)` : formatCurrency(summary.totalPending)}
            </p>
         </div>
      </div>

      {/* Main Table Card */}
      <Card className="border border-slate-200/60 shadow-sm overflow-hidden bg-white rounded-2xl flex flex-col min-h-[500px]">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between items-center bg-slate-50/50">
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search project or client..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-lg focus-visible:ring-[#5d88c6]" 
              />
            </div>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[110px] h-9 text-xs bg-white border-slate-200 rounded-lg font-medium shadow-none">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map(yr => (
                  <SelectItem key={yr} value={yr}>{yr}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs bg-white border-slate-200 rounded-lg font-medium shadow-none">
                <Filter className="w-3 h-3 mr-2 text-slate-400 inline" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="cleared">Paid / Cleared</SelectItem>
                <SelectItem value="partial">Partially Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overpaid">Overpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 w-full xl:w-auto">
             {/* Hidden file input for CSV Import */}
             <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleImportCSV} />
             
             <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="flex-1 xl:flex-none h-9 text-xs bg-white shadow-sm font-bold rounded-lg px-4">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> {isImporting ? 'Importing...' : 'Import CSV'}
             </Button>
             <Button variant="outline" onClick={handleExportCSV} className="flex-1 xl:flex-none h-9 text-xs bg-white shadow-sm font-bold rounded-lg px-4">
                <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
             </Button>

             <Button 
               onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }} 
               className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white h-9 text-xs font-bold rounded-lg px-5 shadow-sm transition-transform active:scale-95"
             >
               <Plus className="w-3.5 h-3.5 mr-1.5" /> Add New
             </Button>
          </div>
        </div>

        <div className="flex-1 bg-white relative">
          <IncomeTable 
            data={filteredData} 
            isLoading={isLoading} 
            onView={handleView}
            onEdit={handleEdit}
            onHistory={handleHistory}
            onPayment={handlePayment} 
            onDelete={handleDelete}
          />
        </div>
      </Card>

      {/* --- MODALS --- */}
      
      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onSave={handleSaveProject} 
        initialData={editingProject} 
      />

      <ProjectHistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        project={historyProject}
      />

      <ProjectPaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        project={paymentProject}
        onSave={handleSavePayment}
      />

    </div>
  );
};

export default Income;