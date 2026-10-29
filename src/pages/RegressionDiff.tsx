import React from 'react';
import { ScanDiff, Finding } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  GitCompare,
} from 'lucide-react';

interface RegressionDiffProps {
  diff: ScanDiff | null;
  targetHostname: string;
}

export const RegressionDiff: React.FC<RegressionDiffProps> = ({
  diff,
  targetHostname,
}) => {
  if (!diff) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center max-w-lg mx-auto space-y-4">
        <GitCompare className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Historical Comparison Available</h2>
        <p className="text-sm text-slate-400">
          Run at least two consecutive scans on <span className="text-white font-mono">{targetHostname}</span> to analyze regression trends, newly introduced defects, and resolved findings.
        </p>
      </div>
    );
  }

  const isPositive = diff.scoreDelta >= 0;

  return (
    <div className="space-y-6">
      {/* Diff Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Regression Analytics
            </span>
            <span className="text-xs text-slate-400">
              Compared with previous assessment
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">{targetHostname}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Historical delta tracking against baseline scan records
          </p>
        </div>

        {/* Score Delta Badge */}
        <div
          className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${
            isPositive
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-8 h-8" />
          ) : (
            <TrendingDown className="w-8 h-8" />
          )}
          <div>
            <div className="text-2xl font-black font-mono">
              {diff.scoreDelta >= 0 ? `+${diff.scoreDelta}` : diff.scoreDelta} pts
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wider">
              {isPositive ? 'Security Posture Improved' : 'Regression Detected'}
            </div>
          </div>
        </div>
      </div>

      {/* Regression Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. New Findings */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-900/30 bg-rose-950/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              New Regressions
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-white">{diff.newFindings.length}</div>
          <p className="text-xs text-slate-400 mt-1">
            Issues not present in the earlier assessment
          </p>
        </div>

        {/* 2. Resolved Findings */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-900/30 bg-emerald-950/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Resolved Issues
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {diff.resolvedFindings.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Vulnerabilities successfully remediated
          </p>
        </div>

        {/* 3. Persistent Findings */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Persistent Issues
            </span>
            <MinusCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {diff.persistentFindings.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ongoing issues requiring remediation
          </p>
        </div>
      </div>

      {/* Detailed Lists */}
      <div className="space-y-4">
        {/* New Regressions List */}
        {diff.newFindings.length > 0 && (
          <div className="glass-panel rounded-2xl border border-rose-900/30 overflow-hidden">
            <div className="p-4 bg-rose-950/20 border-b border-rose-900/30 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-rose-300">
                Newly Introduced Vulnerabilities ({diff.newFindings.length})
              </h3>
            </div>
            <div className="p-4 divide-y divide-slate-800">
              {diff.newFindings.map((f, i) => (
                <div key={i} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge severity={f.severity} />
                    <span className="text-sm font-semibold text-white">{f.title}</span>
                  </div>
                  <p className="text-xs text-slate-400">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolved Issues List */}
        {diff.resolvedFindings.length > 0 && (
          <div className="glass-panel rounded-2xl border border-emerald-900/30 overflow-hidden">
            <div className="p-4 bg-emerald-950/20 border-b border-emerald-900/30 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-emerald-300">
                Remediated Vulnerabilities ({diff.resolvedFindings.length})
              </h3>
            </div>
            <div className="p-4 divide-y divide-slate-800">
              {diff.resolvedFindings.map((f, i) => (
                <div key={i} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge severity={f.severity} />
                    <span className="text-sm font-semibold text-slate-200 line-through">
                      {f.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Fixed since previous assessment.</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
