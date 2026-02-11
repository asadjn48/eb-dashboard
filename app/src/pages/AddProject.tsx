/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, DollarSign, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { projectAPI } from '@/services/projectService';
import { type ProjectType } from '@/types';

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Custom Input States
  const [isCustomClient, setIsCustomClient] = useState(false);
  const [isCustomSubType, setIsCustomSubType] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    client: '',
    type: 'commercial' as ProjectType,
    subType: '',
    budget: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await projectAPI.add({
        ...formData,
        budget: Number(formData.budget),
        expenses: 0,
        profit: Number(formData.budget),
        progress: 0,
        status: 'active',
        subType: formData.subType || 'General'
      });
      navigate('/projects');
    } catch (error) {
      console.error("Failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
      </div>

      <Card className="shadow-sm border-t-4 border-t-[var(--primary)]">
        <CardHeader className="pb-4">
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Top Row: Name & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input placeholder="e.g. AI Dashboard" required className="pl-9"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project Type</label>
                <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                  <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">Commercial (Client)</SelectItem>
                    <SelectItem value="funded">Funded (NGO/Gov)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row: Client & SubType (With Custom Logic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Hybrid Client Input */}
              <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="text-sm font-medium">Client</label>
                    <button type="button" onClick={() => setIsCustomClient(!isCustomClient)} className="text-xs text-[var(--primary)] hover:underline">
                        {isCustomClient ? "Select Existing" : "+ Enter New"}
                    </button>
                </div>
                {isCustomClient ? (
                    <Input placeholder="Enter Client Name" autoFocus value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                ) : (
                    <Select onValueChange={(v) => v === 'other' ? setIsCustomClient(true) : setFormData({...formData, client: v})}>
                        <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select Client" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TechCorp">TechCorp</SelectItem>
                            <SelectItem value="MediCare">MediCare</SelectItem>
                            <SelectItem value="other" className="text-[var(--primary)] font-medium">+ Add New Client</SelectItem>
                        </SelectContent>
                    </Select>
                )}
              </div>

              {/* Hybrid SubType Input */}
              <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="text-sm font-medium">Category</label>
                    <button type="button" onClick={() => setIsCustomSubType(!isCustomSubType)} className="text-xs text-[var(--primary)] hover:underline">
                        {isCustomSubType ? "Select List" : "+ Custom"}
                    </button>
                </div>
                {isCustomSubType ? (
                    <Input placeholder="e.g. Machine Learning" value={formData.subType} onChange={e => setFormData({...formData, subType: e.target.value})} />
                ) : (
                    <Select onValueChange={(v) => v === 'other' ? setIsCustomSubType(true) : setFormData({...formData, subType: v})}>
                        <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select Category" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Mobile App">Mobile App</SelectItem>
                            <SelectItem value="GIZ">GIZ</SelectItem>
                            <SelectItem value="NAVTTC">NAVTTC</SelectItem>
                            <SelectItem value="other" className="text-[var(--primary)] font-medium">+ Other</SelectItem>
                        </SelectContent>
                    </Select>
                )}
              </div>
            </div>

            {/* Third Row: Financials & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Budget</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <Input type="number" placeholder="0.00" className="pl-9" required
                            value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <Input type="date" className="pl-9" required
                            value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Deadline</label>
                    <Input type="date"
                        value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea placeholder="Project details..." className="min-h-[100px] bg-slate-50"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate('/projects')}>Cancel</Button>
              <Button type="submit" className="bg-[var(--primary)] text-white hover:opacity-90" disabled={isLoading}>
                {isLoading ? 'Creating...' : <><Save className="w-4 h-4 mr-2" /> Create Project</>}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProject;