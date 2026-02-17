
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Receipt, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { projectAPI } from '@/services/projectService';
import { formatCurrency } from '@/utils/formatters';
import type { Project } from '@/types';

const EditProject: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      const data = await projectAPI.getById(id);
      if (data) setProject(data);
      setIsLoading(false);
    };
    fetchProject();
  }, [id]);

  const handleSave = async () => {
    if (!project || !id) return;
    setIsSaving(true);
    try {
      // Recalculate profit before saving
      const profit = project.budget - (project.expenses || 0);
      await projectAPI.update(id, { ...project, profit });
      navigate('/projects');
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Delete this project permanently?")) {
        if(id) await projectAPI.delete(id);
        navigate('/projects');
    }
  }

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!project) return <div className="p-10 text-center">Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-2"/> Delete</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-t-4 border-t-[var(--primary)]">
                <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input value={project.name} onChange={e => setProject({...project, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Client</label>
                            <Input value={project.client} onChange={e => setProject({...project, client: e.target.value})} />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Progress ({project.progress}%)</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="range" 
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]" 
                                min="0" max="100" 
                                value={project.progress} 
                                onChange={e => setProject({...project, progress: Number(e.target.value)})}
                            />
                            <span className="text-sm font-bold w-10">{project.progress}%</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea value={project.description} onChange={e => setProject({...project, description: e.target.value})} className="min-h-[100px]" />
                    </div>
                </CardContent>
            </Card>

            {/* EXPENSES SECTION */}
            <Card className="shadow-sm border-l-4 border-l-orange-400">
                <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5 text-orange-500"/> Financials</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600">Total Budget</label>
                            <Input type="number" value={project.budget} onChange={e => setProject({...project, budget: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600">Total Expenses</label>
                            <Input type="number" value={project.expenses} onChange={e => setProject({...project, expenses: Number(e.target.value)})} />
                        </div>
                    </div>
                    
                    {/* Live Profit Calculation */}
                    <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-200">
                        <span className="font-medium text-gray-600 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Net Profit</span>
                        <span className={`text-xl font-bold ${(project.budget - (project.expenses || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(project.budget - (project.expenses || 0))}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* RIGHT COLUMN: Meta */}
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select value={project.status} onValueChange={(v: any) => setProject({...project, status: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="on-hold">On Hold</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select value={project.type} onValueChange={(v: any) => setProject({...project, type: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="funded">Funded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sub-Category</label>
                        <Input value={project.subType} onChange={e => setProject({...project, subType: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <Input type="date" value={project.startDate} onChange={e => setProject({...project, startDate: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Deadline</label>
                        <Input type="date" value={project.endDate} onChange={e => setProject({...project, endDate: e.target.value})} />
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full bg-primary hover:opacity-90 text-white shadow-lg" size="lg" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2"/> Save Changes</>}
            </Button>
        </div>

      </div>
    </div>
  );
};

export default EditProject;