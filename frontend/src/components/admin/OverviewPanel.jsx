import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  School, 
  UserCheck, 
  CheckCircle, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  LayoutGrid, 
  Plus, 
  Upload, 
  Search, 
  Trash2, 
  Edit3, 
  FileSpreadsheet, 
  X, 
  ChevronDown, 
  ShieldAlert, 
  RefreshCw, 
  Cpu, 
  Info
} from 'lucide-react';

// =========================================================================
// SUB-COMPONENT: OVERVIEW PANEL
// =========================================================================
const OverviewPanel = ({ stats, loading, error, onRefresh, setActiveTab }) => {
  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      description: 'Registered student database',
      icon: Users,
      textColor: 'text-blue-400',
      tab: 'students'
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      description: 'Available exam invigilators',
      icon: ShieldCheck,
      textColor: 'text-emerald-400',
      tab: 'teachers'
    },
    {
      title: 'Total Classrooms',
      value: stats.totalClassrooms,
      description: 'Configured examination halls',
      icon: School,
      textColor: 'text-purple-400',
      tab: 'classrooms'
    },
    {
      title: 'Total Seat Capacity',
      value: stats.totalCapacity,
      description: 'Total available seat pool',
      icon: LayoutGrid,
      textColor: 'text-amber-400',
      tab: 'classrooms'
    },
    {
      title: 'Allocated Seats',
      value: stats.allocatedSeats,
      description: 'Seats assigned for current exam',
      icon: UserCheck,
      textColor: 'text-indigo-400',
      tab: 'view-allocations'
    },
    {
      title: 'Available Seats',
      value: stats.availableSeats,
      description: 'Unused seat capacity',
      icon: CheckCircle,
      textColor: 'text-cyan-400',
      tab: 'classrooms'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-650/35 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm animate-pulse">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-6 rounded-2xl flex items-center gap-3">
        <AlertCircle className="text-red-400 shrink-0" size={24} />
        <div>
          <h4 className="font-bold">Error Loading Dashboard</h4>
          <p className="text-sm text-red-400/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Quick metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div 
              key={i} 
              onClick={() => setActiveTab(card.tab)}
              className="glass glow-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 cursor-pointer shadow-md shadow-slate-950/20 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</span>
                <div className={`p-2.5 rounded-xl bg-slate-950/80 border border-slate-850/80 ${card.textColor}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-white tracking-tight">{card.value}</span>
                <span className="text-xs text-slate-400 mt-2 font-medium">{card.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capacity Progress */}
        <div className="glass rounded-2xl p-6 border border-slate-800/60 lg:col-span-2 space-y-6 shadow-md">
          <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest border-b border-slate-850 pb-3">Seating Capacity Utilization</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                <span>SEATING RATIO</span>
                <span>{stats.totalCapacity > 0 ? Math.round((stats.allocatedSeats / stats.totalCapacity) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3.5 border border-slate-850 overflow-hidden">
                <div 
                  className="bg-indigo-650 h-full rounded-full shadow-lg shadow-indigo-650/40 transition-all duration-1000"
                  style={{ width: `${stats.totalCapacity > 0 ? (stats.allocatedSeats / stats.totalCapacity) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-2">
              <div className="p-3.5 bg-slate-950/30 border border-slate-850/80 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Allocated</span>
                <span className="text-base font-bold text-indigo-400">{stats.allocatedSeats}</span>
              </div>
              <div className="p-3.5 bg-slate-950/30 border border-slate-850/80 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Available</span>
                <span className="text-base font-bold text-emerald-400">{stats.availableSeats}</span>
              </div>
              <div className="p-3.5 bg-slate-950/30 border border-slate-850/80 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Capacity</span>
                <span className="text-base font-bold text-slate-300">{stats.totalCapacity}</span>
              </div>
              <div className="p-3.5 bg-slate-950/30 border border-slate-850/80 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Halls</span>
                <span className="text-base font-bold text-purple-400">{stats.totalClassrooms}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="glass rounded-2xl p-6 border border-slate-800/60 space-y-4 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest border-b border-slate-850 pb-3 mb-3">Quick Actions</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">Initialize seat placements using our interleaving generator system, or view schedules.</p>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('allocate')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors text-xs font-semibold"
              >
                <span>Seat Allocation Wizard</span>
                <ChevronRight size={14} className="text-indigo-400" />
              </button>
              <button 
                onClick={() => setActiveTab('view-allocations')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors text-xs font-semibold"
              >
                <span>Invigilator Schedules</span>
                <ChevronRight size={14} className="text-indigo-400" />
              </button>
            </div>
          </div>
          <button 
            onClick={onRefresh} 
            className="w-full mt-4 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-705 border border-slate-705 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <RefreshCw size={12} />
            <span>Reload Statistics</span>
          </button>
        </div>
      </div>
    </div>
  );
};


export default OverviewPanel;
