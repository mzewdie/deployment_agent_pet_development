import React from 'react';
import { Shield, Terminal, Server } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-slate-100 py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-lg font-bold tracking-tight text-white">
                MASTER DEPLOYMENT AGENT
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded">
                PET Development
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Protocol: UNDERSTAND → PREPARE → BUILD → RUN → VERIFY → DOCUMENT → REPORT
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Integrity Guardrails: ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Target: Local Docker</span>
          </div>
        </div>
      </div>
    </header>
  );
};
