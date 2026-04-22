/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Users, PieChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

import { DistributionModal, NotesModal } from '@/components/net-profit/DistributionModal';
import { DistributionTable } from '@/components/net-profit/DistributionTable'; 
import { ProjectProfitCard } from '@/components/net-profit/ProjectProfitCard';
import { BankBalanceCard } from '@/components/net-profit/BankBalanceCard';

// Import all APIs
import { projectAPI } from '@/services/projectService';
import { bankAPI, distributionAPI } from '@/services/netProfitService';
import type { Project } from '@/types';

const NetProfit: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [distributions, setDistributions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [defaultTab, setDefaultTab] = useState('debt');

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [activeNoteRecord, setActiveNoteRecord] = useState<any>(null);

  // --- FETCH DATA FROM FIRESTORE ---
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [projData, bankData, distData] = await Promise.all([
          projectAPI.getAll(),
          bankAPI.getAll(),
          distributionAPI.getAll()
        ]);
        setProjects(projData);
        setBanks(bankData);
        
        // Sort distributions newest to oldest
        setDistributions(distData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error("Failed to load net profit data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // --- KPIs ---
  const kpis = useMemo(() => {
    const totalNetProfit = projects.reduce((sum, p) => sum + ((p.budget || 0) - (p.expenses || 0)), 0);
    
    const investmentRecords = distributions.filter(d => d.type === 'investment');
    const uniqueShareholders = new Set(investmentRecords.map(d => d.name)).size;
    const shareIncomeDistributed = investmentRecords.reduce((sum, d) => sum + d.amount, 0);

    return { totalNetProfit, uniqueShareholders, shareIncomeDistributed };
  }, [projects, distributions]);

  // --- DATABASE HANDLERS: DISTRIBUTIONS ---
  const handleSaveRecord = async (data: any) => {
    if (editingRecord) {
      await distributionAPI.update(editingRecord.id, data);
      setDistributions(prev => prev.map(d => d.id === editingRecord.id ? { ...d, ...data } : d));
    } else {
      const newRecord = await distributionAPI.add({ ...data, createdAt: new Date().toISOString() });
      setDistributions(prev => [newRecord, ...prev]);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm("Permanently delete this record?")) {
      await distributionAPI.delete(id);
      setDistributions(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleToggleRefund = async (id: string) => {
    const record = distributions.find(d => d.id === id);
    if (record) {
      const updatedStatus = !record.refunded;
      await distributionAPI.update(id, { refunded: updatedStatus });
      setDistributions(prev => prev.map(d => d.id === id ? { ...d, refunded: updatedStatus } : d));
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    await distributionAPI.update(id, { notes });
    setDistributions(prev => prev.map(d => d.id === id ? { ...d, notes } : d));
  };

  // --- DATABASE HANDLERS: BANKS ---
  const handleAddBank = async (bankData: any) => {
    const newBank = await bankAPI.add(bankData);
    setBanks(prev => [newBank, ...prev]);
  };

  const handleEditBank = async (id: string, bankData: any) => {
    await bankAPI.update(id, bankData);
    setBanks(prev => prev.map(b => b.id === id ? { ...b, ...bankData } : b));
  };

  const handleDeleteBank = async (id: string) => {
    await bankAPI.delete(id);
    setBanks(prev => prev.filter(b => b.id !== id));
  };

  if (isLoading) {
    return <div className="flex h-[60vh] flex-col items-center justify-center text-slate-400 gap-4"><div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" /><p className="font-medium animate-pulse">Loading financial data...</p></div>;
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 pt-2 w-full">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-500" /> Net Profit & Distributions
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Monitor overall profitability, bank balances, and shareholder payouts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white border border-slate-200/60 shadow-sm p-6 rounded-2xl">
            <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5"/> Total Net Profit</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{formatCurrency(kpis.totalNetProfit)}</p>
         </div>
         <div className="bg-white border border-slate-200/60 shadow-sm p-6 rounded-2xl">
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Active Shareholders</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1">{kpis.uniqueShareholders}</p>
         </div>
         <div className="bg-white border border-slate-200/60 shadow-sm p-6 rounded-2xl">
            <p className="text-[10px] font-extrabold text-purple-600 uppercase tracking-widest flex items-center gap-1.5"><PieChart className="w-3.5 h-3.5"/> Total Share Income Paid</p>
            <p className="text-3xl font-extrabold text-purple-700 mt-1">{formatCurrency(kpis.shareIncomeDistributed)}</p>
         </div>
      </div>

      {/* Middle Section: Projects & Banks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProjectProfitCard projects={projects} />
        <BankBalanceCard banks={banks} onAddBank={handleAddBank} onEditBank={handleEditBank} onDeleteBank={handleDeleteBank} />
      </div>

      {/* Bottom Section: Distribution Table */}
      <Card className="border border-slate-200/60 shadow-sm overflow-hidden bg-white rounded-2xl flex flex-col min-h-[450px]">
        <DistributionTable 
          data={distributions} 
          onAdd={(tab: string) => { setDefaultTab(tab); setEditingRecord(null); setIsRecordModalOpen(true); }}
          onEdit={(record: any) => { setEditingRecord(record); setIsRecordModalOpen(true); }}
          onDelete={handleDeleteRecord}
          onNote={(record: any) => { setActiveNoteRecord(record); setIsNotesModalOpen(true); }}
          onToggleRefund={handleToggleRefund}
        />
      </Card>

      {/* Modals */}
      <DistributionModal 
        isOpen={isRecordModalOpen} 
        onClose={() => setIsRecordModalOpen(false)} 
        onSave={handleSaveRecord} 
        initialData={editingRecord}
        defaultType={defaultTab}
      />

      <NotesModal 
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        record={activeNoteRecord}
        onSave={handleSaveNotes}
      />

    </div>
  );
};

export default NetProfit;