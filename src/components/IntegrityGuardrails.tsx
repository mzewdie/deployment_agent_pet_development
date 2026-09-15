import React from 'react';
import { AlertOctagon, CheckSquare } from 'lucide-react';

export const IntegrityGuardrails: React.FC = () => {
  const rules = [
    "NEVER modify application source code to solve deployment problems.",
    "NEVER change application behavior, business rules, or validation logic.",
    "NEVER remove or weaken application functionality or add hard-coded responses.",
    "NEVER modify tests to obtain a successful deployment.",
    "NEVER perform functional acceptance testing (reserved strictly for Test Agent).",
    "NEVER invent repositories, credentials, agents, tools, or infrastructure."
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertOctagon className="w-5 h-5 text-rose-400" />
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
          Strict Deployment Integrity Guardrails
        </h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        The application delivery is authoritative. If deployment is impossible without modifying the application code, the agent MUST stop and report the problem.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 text-xs bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-lg text-slate-300 font-mono"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
