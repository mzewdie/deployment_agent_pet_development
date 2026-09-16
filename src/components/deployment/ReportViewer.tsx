import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, Terminal, Activity } from 'lucide-react';
import { DeploymentConfig, DeploymentStatus, VerificationCheck, DeploymentLog } from '../../types';

interface ReportViewerProps {
  status: DeploymentStatus;
  config: DeploymentConfig;
  checks: VerificationCheck[];
  logs: DeploymentLog[];
  problems: string[];
  manualActions: string[];
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  status,
  config,
  checks,
  logs,
  problems,
  manualActions,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-semibold text-white font-mono">
            Deployment Report & Verification
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Result:</span>
          <span
            className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider ${
              status === 'SUCCESS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : status === 'FAILED'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delivery Details */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 space-y-2 text-xs font-mono">
          <h4 className="text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
            Delivery Under Test
          </h4>
          <div className="space-y-1 text-slate-300">
            <p className="truncate">
              <span className="text-slate-500">Repository: </span>
              {config.repoUrl || "(None provided yet by coordinator)"}
            </p>
            <p>
              <span className="text-slate-500">Target Ref: </span>
              {config.ref || "(None provided)"}
            </p>
            <p>
              <span className="text-slate-500">Image Tag: </span>
              {config.imageName}:{config.imageTag}
            </p>
            <p>
              <span className="text-slate-500">Port Mapping: </span>
              {config.port}:{config.port}
            </p>
            <p>
              <span className="text-slate-500">Execution Env: </span>
              Local Docker Runtime (Linux container sandbox)
            </p>
          </div>
        </div>

        {/* Verification Checks */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 space-y-2.5">
          <h4 className="text-slate-400 uppercase text-[10px] tracking-wider font-semibold font-mono">
            Deployment Health Verification Criteria
          </h4>
          <div className="space-y-2">
            {checks.map((check) => (
              <div key={check.id} className="flex items-start gap-2 text-xs font-mono">
                {check.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : check.status === 'failed' ? (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-700 bg-slate-800 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-slate-200 font-medium">{check.label}</span>
                  <p className="text-[10px] text-slate-500 leading-tight">{check.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problems & Manual Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 space-y-2 text-xs font-mono">
          <h4 className="text-amber-400 uppercase text-[10px] tracking-wider font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Problems / Blockers Encountered
          </h4>
          {problems.length === 0 ? (
            <p className="text-slate-500 italic text-[11px]">No active blockers recorded.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-amber-200/90 text-[11px]">
              {problems.map((prob, i) => (
                <li key={i}>{prob}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 space-y-2 text-xs font-mono">
          <h4 className="text-blue-400 uppercase text-[10px] tracking-wider font-semibold flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Manual Actions Required
          </h4>
          {manualActions.length === 0 ? (
            <p className="text-slate-500 italic text-[11px]">No manual actions required at this stage.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              {manualActions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Real-time Agent Execution Log */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
            Agent Execution Activity Log
          </h4>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs max-h-48 overflow-y-auto space-y-1.5 select-text">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-[11px]">
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className="text-slate-500 shrink-0 uppercase text-[9px] px-1 py-0.2 rounded bg-slate-900 border border-slate-800">
                {log.stage}
              </span>
              <span
                className={
                  log.type === 'error'
                    ? 'text-rose-400'
                    : log.type === 'warn'
                    ? 'text-amber-400'
                    : log.type === 'success'
                    ? 'text-emerald-400'
                    : 'text-slate-300'
                }
              >
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
