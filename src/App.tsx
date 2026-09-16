import React, { useState, useEffect } from 'react';
import { PetApp } from './components/pet/PetApp';
import { DeploymentDashboard } from './components/deployment/DeploymentDashboard';
import { Layers, Activity } from 'lucide-react';

export default function App() {
  // Determine initial view based on port or query parameters
  const [activeView, setActiveView] = useState<'pet' | 'deployment'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'deployment' || viewParam === 'dashboard') return 'deployment';
      if (viewParam === 'pet' || viewParam === 'app') return 'pet';

      // Port 3002 is dedicated to the Deployment Dashboard
      if (window.location.port === '3002') return 'deployment';
      // Port 3003 is the Docker containerized Personal Expense Tracker
      if (window.location.port === '3003') return 'pet';
    }
    // Default to the Personal Expense Tracker application
    return 'pet';
  });

  const toggleView = (view: 'pet' | 'deployment') => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Application Switcher Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400 font-mono hidden sm:inline">Active View:</span>
          <span className="font-semibold text-slate-200">
            {activeView === 'pet' ? 'Personal Expense Tracker (Port 3003)' : 'Master Deployment Dashboard (Port 3002)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => toggleView('pet')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'pet'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Expense Tracker</span>
            <span className="text-[10px] px-1 py-0.2 bg-black/20 rounded font-mono">3003</span>
          </button>

          <button
            type="button"
            onClick={() => toggleView('deployment')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'deployment'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Deployment Dashboard</span>
            <span className="text-[10px] px-1 py-0.2 bg-black/20 rounded font-mono">3002</span>
          </button>
        </div>
      </header>

      {/* Render Selected View */}
      <div className="flex-1">
        {activeView === 'pet' ? <PetApp /> : <DeploymentDashboard />}
      </div>
    </div>
  );
}
