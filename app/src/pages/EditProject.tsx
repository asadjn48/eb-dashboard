/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, Save, Trash2, Eye, 
  FileText, DollarSign, Calendar, Briefcase, Building2, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { projectAPI } from '@/services/projectService';
import { type Project } from '@/types';
import { cn } from '@/lib/utils';

// Shared static lists to keep UI consistent
const staticClients = ['TechCorp', 'MediCare'];
const staticCategories = ['Website', 'Mobile App', 'GIZ', 'NAVTTC'];

// Default empty project structure
const emptyProject: Partial<Project> = {
  name: '',
  clientName: '',
  type: 'commercial',
  subType: '',
  budget: 0,
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  description: '',
  status: 'active',
  progress: 0,
  expenses: 0,
  profit: 0
};

const EditProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // BULLETPROOF DETECTION: If there is no ID, the ID is 'new', OR the URL ends in '/new'
  const isNew = !id || id === 'new' || location.pathname.endsWith('/new');

  // If it's a new project, NEVER start in a loading state
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>(emptyProject);

  // Custom Input States
  const [isCustomClient, setIsCustomClient] = useState(false);
  const [isCustomSubType, setIsCustomSubType] = useState(false);

  // Fetch Data (Only if editing an existing project)
  useEffect(() => {
    // If it's a new project, immediately stop loading and don't fetch!
    if (isNew) {
      setIsLoading(false);
      return; 
    }

    const fetchProject = async () => {
      try {
        const data = await projectAPI.getById(id!);
        if (data) {
          setFormData(data);
          if (data.clientName && !staticClients.includes(data.clientName)) setIsCustomClient(true);
          if (data.subType && !staticCategories.includes(data.subType)) setIsCustomSubType(true);
        } else {
          alert("Project not found");
          navigate('/projects');
        }
      } catch (e) { 
        console.error(e); 
      } finally { 
        setIsLoading(false); 
      }
    };

    fetchProject();
  }, [id, isNew, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const payload = {
        ...formData,
        budget: Number(formData.budget) || 0,
        subType: formData.subType || 'General',
        clientName: formData.clientName || 'Internal',
      };

      if (isNew) {
        payload.expenses = 0;
        payload.profit = payload.budget;
        payload.progress = 0;
        payload.status = 'active';
        await projectAPI.add(payload as Omit<Project, 'id'>);
      } else {
        await projectAPI.update(id!, payload);
      }
      
      navigate(-1);
    } catch (error) {
      console.error("Failed to save project", error);
      alert("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew || !id) return;
    if (confirm("Are you sure you want to permanently delete this project? This will also remove associated financial tracking.")) {
        await projectAPI.delete(id);
        navigate('/projects');
    }
  };

  const updateField = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-slate-400 gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#5d88c6] rounded-full animate-spin" />
        <p className="font-medium animate-pulse">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500 pt-2">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-9 w-9 rounded-full shadow-sm hover:bg-slate-100 shrink-0">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
            </Button>
            <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {isNew ? 'Create New Project' : 'Edit Project Details'}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  {isNew ? 'Initialize a new workspace and financial ledger.' : 'Update project scope and tracking parameters.'}
                </p>
            </div>
        </div>
        <div className="flex gap-2">
            {!isNew && (
              <>
                <Button type="button" variant="outline" size="sm" onClick={() => navigate(`/projects/${id}`)} className="rounded-full font-bold px-4 h-9 shadow-sm bg-white">
                    <Eye className="w-3.5 h-3.5 mr-2" /> View Dashboard
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={handleDelete} className="rounded-full font-bold px-4 h-9 shadow-sm">
                    <Trash2 className="w-3.5 h-3.5 mr-2"/> Delete
                </Button>
              </>
            )}
            <Button type="button" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full font-bold px-6 h-9 shadow-md transition-transform active:scale-95" onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? 'Saving...' : <><Save className="w-3.5 h-3.5 mr-2" /> {isNew ? 'Create Project' : 'Save Changes'}</>}
            </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-white">
               <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                 <Briefcase className="w-4 h-4 text-[#5d88c6]" /> Project Identity
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 bg-white">
              
              <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Project Name *</Label>
                  <div className="relative">
                     <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <Input required value={formData.name || ''} onChange={e => updateField('name', e.target.value)} className="pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-[#5d88c6] text-base font-medium" placeholder="e.g. AI Dashboard Redesign" />
                  </div>
              </div>

              <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Client / Organization</Label>
                  {isCustomClient ? (
                     <div className="flex gap-2 animate-in fade-in">
                       <div className="relative flex-1">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input autoFocus placeholder="Enter Client Name" value={formData.clientName || ''} onChange={e => updateField('clientName', e.target.value)} className="pl-9 h-10 border-[#5d88c6]/30 bg-[#5d88c6]/5 focus-visible:ring-[#5d88c6] font-medium" />
                       </div>
                       <Button type="button" variant="ghost" size="icon" onClick={() => setIsCustomClient(false)} className="shrink-0 h-10 w-10 text-slate-400 hover:text-slate-700"><ChevronLeft className="w-4 h-4" /></Button>
                     </div>
                  ) : (
                     <Select value={formData.clientName || ''} onValueChange={(v) => v === 'other' ? setIsCustomClient(true) : updateField('clientName', v)}>
                        <SelectTrigger className="h-10 bg-slate-50 border-slate-200 focus:ring-[#5d88c6] font-medium text-slate-700">
                           <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> <SelectValue placeholder="Select Client" /></div>
                        </SelectTrigger>
                        <SelectContent>
                           {staticClients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                           <SelectItem value="other" className="text-[#5d88c6] font-bold">+ Add New Client</SelectItem>
                        </SelectContent>
                     </Select>
                  )}
              </div>

              <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Project Category</Label>
                  {isCustomSubType ? (
                     <div className="flex gap-2 animate-in fade-in">
                       <Input autoFocus placeholder="e.g. Machine Learning" value={formData.subType || ''} onChange={e => updateField('subType', e.target.value)} className="h-10 border-[#5d88c6]/30 bg-[#5d88c6]/5 focus-visible:ring-[#5d88c6] font-medium" />
                       <Button type="button" variant="ghost" size="icon" onClick={() => setIsCustomSubType(false)} className="shrink-0 h-10 w-10 text-slate-400 hover:text-slate-700"><ChevronLeft className="w-4 h-4" /></Button>
                     </div>
                  ) : (
                     <Select value={formData.subType || ''} onValueChange={(v) => v === 'other' ? setIsCustomSubType(true) : updateField('subType', v)}>
                        <SelectTrigger className="h-10 bg-slate-50 border-slate-200 focus:ring-[#5d88c6] font-medium text-slate-700"><SelectValue placeholder="Select Category" /></SelectTrigger>
                        <SelectContent>
                           {staticCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                           <SelectItem value="other" className="text-[#5d88c6] font-bold">+ Add Custom Category</SelectItem>
                        </SelectContent>
                     </Select>
                  )}
              </div>

            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-white">
               <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                 <FileText className="w-4 h-4 text-slate-400" /> Project Description & Notes
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
               <Textarea placeholder="Enter detailed project scope, requirements, or internal notes..." className="min-h-[120px] resize-none bg-slate-50 border-slate-200 focus-visible:ring-[#5d88c6] text-sm" value={formData.description || ''} onChange={e => updateField('description', e.target.value)} />
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: Financials, Dates & Status */}
        <div className="space-y-6">
          
          <Card className="border-emerald-200/60 bg-emerald-50/30 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-emerald-100 bg-white">
               <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-800">
                 <DollarSign className="w-4 h-4 text-emerald-500" /> Financial Parameters
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5 bg-white">
              <div className="space-y-1.5">
                  <Label className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Total Budget (PKR) *</Label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/50 font-bold">Rs</span>
                     <Input required type="number" placeholder="0.00" value={formData.budget || ''} onChange={e => updateField('budget', e.target.value)} className="pl-9 h-11 bg-emerald-50/30 border-emerald-100 focus-visible:ring-emerald-500 font-mono font-bold text-lg" />
                  </div>
              </div>
              <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Funding Model</Label>
                  <Select value={formData.type || 'commercial'} onValueChange={(v: any) => updateField('type', v)}>
                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200 font-medium text-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial (Client Paid)</SelectItem>
                      <SelectItem value="funded">Funded (NGO / Gov Grant)</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-white">
               <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                 <Calendar className="w-4 h-4 text-slate-400" /> Timeline & Status
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5 bg-white">
              <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Project Start Date *</Label>
                  <Input required type="date" value={formData.startDate || ''} onChange={e => updateField('startDate', e.target.value)} className="h-10 bg-slate-50 border-slate-200 focus-visible:ring-[#5d88c6] text-slate-700 font-medium" />
              </div>
              <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estimated Deadline</Label>
                  <Input type="date" value={formData.endDate || ''} onChange={e => updateField('endDate', e.target.value)} className="h-10 bg-slate-50 border-slate-200 focus-visible:ring-[#5d88c6] text-slate-700 font-medium" />
              </div>

              {!isNew && (
                <div className="space-y-1.5 pt-4 border-t border-slate-100">
                    <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Project Status</Label>
                    <Select value={formData.status || 'active'} onValueChange={(v: any) => updateField('status', v)}>
                      <SelectTrigger className={cn("h-10 font-bold border-slate-200 focus:ring-[#5d88c6]", formData.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-700')}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active" className="font-medium">Active / Ongoing</SelectItem>
                        <SelectItem value="completed" className="text-emerald-700 font-bold">Completed</SelectItem>
                        <SelectItem value="on-hold" className="text-amber-600 font-medium">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.status === 'completed' && <p className="text-[10px] text-emerald-600 flex items-center mt-1.5"><CheckCircle2 className="w-3 h-3 mr-1"/> Financial tracking locked for completed projects.</p>}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </form>
    </div>
  );
};

export default EditProject;