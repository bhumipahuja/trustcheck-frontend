import React from 'react';
import { Target, ScanResult } from '../types';
import { TrendChart } from '../components/TrendChart';
import {
  Globe,
  ShieldAlert,
  CheckCircle2,
  Play,
  Trash2,
  ExternalLink,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

interface DashboardProps {
  targets: Target[];
  onSelectTarget: (target: Target) => void;
  onTriggerScan: (targetId: string) => void;
  onDeleteTarget: (targetId: string) => void;
  onOpenNewScan: () => void;
  isScanning: boolean;
  activeScan: ScanResult | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  targets,
  onSelectTarget,
  onTriggerScan,
  onDeleteTarget,
  onOpenNewScan,
  isScanning,
  activeScan,
}) => {
  // Aggregate statistics
  const totalTargets = targets.length;
  const scannedTargets = targets.filter((t) => t.lastScan);
  const avgScore =
    scannedTargets.length > 0
      ? Math.round(
          scannedTargets.reduce((acc, t) => acc + (t.lastScan?.score || 0), 0) /
            scannedTargets.length
        )
      : activeScan
      ? activeScan.healthScore
      : 84;

  const totalFindings = scannedTargets.reduce(
    (acc, t) => acc + (t.lastScan?.totalFindings || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-emerald-950/20">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Security Posture Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Non-intrusive security health inspection across your authorized domains.
            Automated evaluation of SSL/TLS chains, defense headers, and email authentication records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewScan}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            + Add Domain Target
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Targets */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Monitored Domains
            </span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalTargets}</span>
            <span className="text-xs text-emerald-400 font-medium">Active</span>
          </div>
        </div>

        {/* Stat 2: Avg Health Score */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Average Health
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{avgScore}</span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
        </div>

        {/* Stat 3: Total Issues */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Recorded Findings
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalFindings}</span>
            <span className="text-xs text-amber-400 font-medium">To Remediate</span>
          </div>
        </div>

        {/* Stat 4: Scan Engine Mode */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Protection Mode
            </span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">Passive & Safe</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Non-destructive OWASP rules</p>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <TrendChart />

      {/* Monitored Targets Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Authorized Targets</h2>
            <p className="text-xs text-slate-400">
              Websites enrolled for automated security verification
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {targets.length} Target(s) Configured
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {targets.map((target) => {
            const score = target.lastScan?.score;
            let scoreBadgeColor = 'bg-slate-800 text-slate-400';
            if (typeof score === 'number') {
              if (score >= 80) scoreBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              else if (score >= 60) scoreBadgeColor = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
              else scoreBadgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            }

            return (
              <div
                key={target.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mt-0.5">
                    <Globe className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-base">
                        {target.displayName || target.hostname}
                      </span>
                      <a
                        href={`https://${target.hostname}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="font-mono text-slate-300">{target.hostname}</span>
                      <span>•</span>
                      <span>Port {target.port}</span>
                      {target.lastScan && (
                        <>
                          <span>•</span>
                          <span>
                            Last scan: {new Date(target.lastScan.scannedAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score & Actions */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {typeof score === 'number' ? (
                    <div
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${scoreBadgeColor}`}
                    >
                      Score: {score} / 100
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">No scan yet</span>
                  )}

                  <button
                    onClick={() => onSelectTarget(target)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title="View Detailed Report"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onTriggerScan(target.id)}
                    disabled={isScanning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Scan</span>
                  </button>

                  <button
                    onClick={() => onDeleteTarget(target.id)}
                    className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete Target"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
