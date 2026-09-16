import React from 'react';
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { DeploymentStatus } from '../../types';

interface WorkflowTrackerProps {
  currentStep: number;
  status: DeploymentStatus;
}

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ currentStep, status }) => {
  const steps = [
    { num: 1, title: "Clone Delivery", desc: "Acquire repository from GitHub" },
    { num: 2, title: "Identify Version", desc: "Check commit SHA and tag" },
    { num: 3, title: "Inspect Specs", desc: "Read README & configs" },
    { num: 4, title: "Determine Build", desc: "Detect build & run scripts" },
    { num: 5, title: "Prepare Docker", desc: "Configure Dockerfile & compose" },
    { num: 6, title: "Build Image", desc: "Execute local Docker build" },
    { num: 7, title: "Run Container", desc: "Start local test container" },
    { num: 8, title: "Verify Health", desc: "Test port & HTTP responses" },
    { num: 9, title: "Document", desc: "Write DEPLOYMENT.md" },
    { num: 10, title: "Report", desc: "Deliver status with evidence" },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <span>Standard Operating Lifecycle</span>
          <span className="text-slate-500 font-normal">
            (UNDERSTAND → PREPARE → BUILD → RUN → VERIFY → DOCUMENT → REPORT)
          </span>
        </h3>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Current Phase:</span>
          <span className={`px-2 py-0.5 rounded font-bold ${
            status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
            status === 'FAILED' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
            status === 'AWAITING_INPUT' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
            'bg-blue-950 text-blue-400 border border-blue-800 animate-pulse'
          }`}>
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {steps.map((s) => {
          const isDone = currentStep > s.num || status === 'SUCCESS';
          const isCurrent = currentStep === s.num && status !== 'SUCCESS';

          return (
            <div
              key={s.num}
              className={`p-2.5 rounded-lg border flex flex-col justify-between transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                  : isCurrent
                  ? 'bg-blue-950/30 border-blue-500 text-blue-200 shadow-sm shadow-blue-900/40'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold opacity-75">
                  0{s.num}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-medium font-mono leading-tight">{s.title}</p>
                <p className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
