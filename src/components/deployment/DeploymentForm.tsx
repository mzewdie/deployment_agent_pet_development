import React, { useState } from 'react';
import { GitBranch, GitCommit, Layers, Play, Plus, Trash2, AlertCircle } from 'lucide-react';
import { DeploymentConfig } from '../../types';

interface DeploymentFormProps {
  config: DeploymentConfig;
  onChange: (config: DeploymentConfig) => void;
  onDeploy: () => void;
  isDeploying: boolean;
}

export const DeploymentForm: React.FC<DeploymentFormProps> = ({
  config,
  onChange,
  onDeploy,
  isDeploying,
}) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const addEnvVar = () => {
    if (!newKey.trim()) return;
    onChange({
      ...config,
      envVars: [...config.envVars, { key: newKey.trim(), value: newValue.trim() }],
    });
    setNewKey('');
    setNewValue('');
  };

  const removeEnvVar = (idx: number) => {
    onChange({
      ...config,
      envVars: config.envVars.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-semibold text-white font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Coordinator Delivery Intake
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Provide the delivery repository and deployment coordinates.
          </p>
        </div>
        <span className={`text-[11px] font-mono px-2.5 py-1 rounded border ${
          config.repoUrl
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        }`}>
          {config.repoUrl ? 'Delivery Received & Configured' : 'Awaiting Coordinator Input'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
            <span>Application GitHub Repository URL *</span>
            <span className="text-[10px] text-slate-400">e.g. https://github.com/org/pet-app.git</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.repoUrl}
              onChange={(e) => onChange({ ...config, repoUrl: e.target.value })}
              placeholder="https://github.com/organization/application-repo.git"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          {!config.repoUrl && (
            <p className="text-[11px] text-amber-400/90 flex items-center gap-1 mt-1 font-mono">
              <AlertCircle className="w-3 h-3 shrink-0" />
              Repository is required from the human coordinator before starting Docker deployment.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            Branch / Tag / Commit Reference
          </label>
          <input
            type="text"
            value={config.ref}
            onChange={(e) => onChange({ ...config, ref: e.target.value })}
            placeholder="main / v1.0.0 / commit SHA"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5 text-slate-400" />
            Docker Image Tag
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={config.imageName}
              onChange={(e) => onChange({ ...config, imageName: e.target.value })}
              placeholder="image name"
              className="w-2/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="self-center text-slate-500 font-mono">:</span>
            <input
              type="text"
              value={config.imageTag}
              onChange={(e) => onChange({ ...config, imageTag: e.target.value })}
              placeholder="tag"
              className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-slate-300">
            Container Port (Exposed)
          </label>
          <input
            type="number"
            value={config.port}
            onChange={(e) => onChange({ ...config, port: parseInt(e.target.value) || 3000 })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-slate-300">
            Health Check Endpoint
          </label>
          <input
            type="text"
            value={config.healthEndpoint}
            onChange={(e) => onChange({ ...config, healthEndpoint: e.target.value })}
            placeholder="/ or /api/health"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
          <span>Environment Variables (Never include real secrets)</span>
          <span className="text-[10px] text-slate-400">Public/mock test parameters</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="KEY (e.g. NODE_ENV)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            placeholder="VALUE (e.g. production)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={addEnvVar}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {config.envVars.length > 0 && (
          <div className="space-y-1.5 mt-2">
            {config.envVars.map((env, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-xs font-mono"
              >
                <span className="text-emerald-400">{env.key}</span>
                <span className="text-slate-400">=</span>
                <span className="text-slate-300 truncate max-w-xs">{env.value}</span>
                <button
                  type="button"
                  onClick={() => removeEnvVar(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <p className="text-xs text-slate-400 font-mono">
          Ready to run reproduction pipeline once delivery is specified.
        </p>
        <button
          type="button"
          onClick={onDeploy}
          disabled={isDeploying || !config.repoUrl.trim()}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            config.repoUrl.trim()
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg shadow-emerald-950'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          {isDeploying ? 'Executing Deployment...' : 'Execute Deployment Run'}
        </button>
      </div>
    </div>
  );
};
