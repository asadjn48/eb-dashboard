import { useState } from 'react';
import { Search, Briefcase } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import type { Project } from '@/types';

export const ProjectProfitCard = ({ projects }: { projects: Project[] }) => {
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card className="border border-slate-200/60 shadow-sm rounded-2xl flex flex-col h-[380px] bg-white">
      <CardHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
        <div className="flex justify-between items-center gap-4">
          <CardTitle className="text-sm font-bold text-slate-800">Profit Per Project</CardTitle>
          <div className="relative w-[160px] sm:w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input placeholder="Search project..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-xs bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-emerald-500" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto flex-1 no-scrollbar">
        <div className="divide-y divide-slate-50">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-slate-400 text-xs py-10 font-medium">No projects found.</p>
          ) : (
            filteredProjects.map(p => {
              // Dynamic Calculation: Budget minus Expenses
              const profit = (p.budget || 0) - (p.expenses || 0);
              return (
                <div key={p.id} className="flex justify-between items-center p-4 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg shadow-sm"><Briefcase className="w-4 h-4" /></div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{p.name}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Budget: {formatCurrency(p.budget || 0)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Net Profit</p>
                      <p className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{formatCurrency(profit)}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};