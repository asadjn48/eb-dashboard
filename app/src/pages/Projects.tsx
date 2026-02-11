/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {
  Search, MoreHorizontal, TrendingUp,
  DollarSign, Building2, Plus, Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { projectAPI } from '@/services/projectService';
import type { Project, ProjectType, ProjectStatus } from '@/types';
import { formatCurrency } from '@/utils/formatters';

const Projects: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [sortBy] = useState<'profit' | 'budget' | 'date'>('date');
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [typeFilter, statusFilter, sortBy]);

  useEffect(() => {
    filterProjects();
  }, [searchQuery, projects]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectAPI.getAll({
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        sortBy,
      });
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = () => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }
    const filtered = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
        try {
            await projectAPI.delete(id);
            const updated = projects.filter(p => p.id !== id);
            setProjects(updated);
            setFilteredProjects(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    }
  }

  // Stats Calculation
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalExpenses = projects.reduce((sum, p) => sum + (p.expenses || 0), 0);
  const totalProfit = projects.reduce((sum, p) => sum + (p.profit || 0), 0);
  const activeProjects = projects.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your funded and commercial projects</p>
        </div>
        
        {/* Fixed Button Hover State */}
        <Button 
          className="bg-[var(--primary)] text-white hover:opacity-90 hover:bg-[var(--primary)] shadow-md transition-all"
          onClick={() => navigate('/projects/new')} 
        >
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>

      {/* Stats Cards - Added Expenses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-l-4 border-l-[var(--primary)]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Budget</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-red-400">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Expenses</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-green-400">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Net Profit</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalProfit)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-blue-400">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Active</p>
              <p className="text-lg font-bold text-gray-900">{activeProjects}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
            <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="funded">Funded</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Project</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Budget</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Profit</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center">Loading...</td></tr>
              ) : filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{project.name}</p>
                    <p className="text-xs text-gray-500">{project.type} • {project.subType}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{project.client}</td>
                  <td className="px-6 py-4 text-right font-medium">{formatCurrency(project.budget)}</td>
                  <td className="px-6 py-4 text-right font-medium text-green-600">{formatCurrency(project.profit)}</td>
                  <td className="px-6 py-4">
                    <div className="w-24 mx-auto">
                      <div className="flex justify-between text-[10px] mb-1"><span>{project.progress}%</span></div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="outline" className="capitalize font-normal bg-white">
                      {project.status.replace('-', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4 text-gray-500" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/projects/edit/${project.id}`)}>Edit Project</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(project.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;