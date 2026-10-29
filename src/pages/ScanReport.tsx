import React, { useState } from 'react';
import { ScanResult, Severity, CheckCategory } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { SeverityBadge } from '../components/SeverityBadge';
import { FindingCard } from '../components/FindingCard';
import {
  Globe,
  Clock,
  Printer,
  RotateCw,
  Search,
  Filter,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';

interface ScanReportProps {
  scan: ScanResult | null;
  onRerunScan: (targetId: string) => void;
  isScanning: boolean;
}

export const ScanReport: React.FC<ScanReportProps> = ({
  scan,
  onRerunScan,
  isScanning,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<CheckCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!scan) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center max-w-lg mx-auto space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Active Scan Loaded</h2>
        <p className="text-sm text-slate-400">
          Select a target from the dashboard or initiate a new assessment to inspect security findings.
        </p>
      </div>
    );
  }

  // Filter findings
  const filteredFindings = scan.findings.filter((f) => {
    if (selectedSeverity !== 'ALL' && f.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'ALL' && f.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.evidence.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Score & Target Summary */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Score Gauge */}
        <div className="flex items-center gap-6">
          <ScoreGauge score={scan.healthScore} size={130} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{scan.hostname}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Port 443
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Assessment finished in{' '}
              <span className="font-mono text-slate-200">
                {scan.scanDurationMs || 480}ms
              </span>
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(scan.createdAt).toLocaleString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                SSRF Validated
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => onRerunScan(scan.targetId)}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Rerun Scan</span>
          </button>
        </div>
      </div>

      {/* Severity Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`p-3.5 rounded-xl border transition-all text-left ${
            selectedSeverity === 'CRITICAL'
              ? 'bg-red-500/20 border-red-500'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
            Critical
          </div>
          <div className="text-2xl font-black text-white mt-1">{scan.criticalCount}</div>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'HIGH' ? 'ALL' : 'HIGH')}
          className={`p-3.5 rounded-xl border transition-all text-left ${
            selectedSeverity === 'HIGH'
              ? 'bg-orange-500/20 border-orange-500'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
            High
          </div>
          <div className="text-2xl font-black text-white mt-1">{scan.highCount}</div>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
          className={`p-3.5 rounded-xl border transition-all text-left ${
            selectedSeverity === 'MEDIUM'
              ? 'bg-yellow-500/20 border-yellow-500'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-semibold text-yellow-400 uppercase tracking-wider">
            Medium
          </div>
          <div className="text-2xl font-black text-white mt-1">{scan.mediumCount}</div>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'LOW' ? 'ALL' : 'LOW')}
          className={`p-3.5 rounded-xl border transition-all text-left ${
            selectedSeverity === 'LOW'
              ? 'bg-blue-500/20 border-blue-500'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
            Low
          </div>
          <div className="text-2xl font-black text-white mt-1">{scan.lowCount}</div>
        </button>

        <button
          onClick={() =>
            setSelectedSeverity(selectedSeverity === 'INFORMATIONAL' ? 'ALL' : 'INFORMATIONAL')
          }
          className={`p-3.5 rounded-xl border transition-all text-left ${
            selectedSeverity === 'INFORMATIONAL'
              ? 'bg-slate-500/20 border-slate-500'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Info
          </div>
          <div className="text-2xl font-black text-white mt-1">{scan.infoCount}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search findings or evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {(
            [
              ['ALL', 'All Modules'],
              ['SSL_TLS', 'SSL/TLS'],
              ['SECURITY_HEADERS', 'Headers'],
              ['COOKIES', 'Cookies'],
              ['DNS_EMAIL', 'DNS & Email'],
              ['INFO_LEAK', 'Disclosure'],
            ] as const
          ).map(([catKey, label]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === catKey
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Detected Findings ({filteredFindings.length})
          </h3>
          {(selectedSeverity !== 'ALL' || selectedCategory !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSeverity('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredFindings.length === 0 ? (
          <div className="glass-panel p-8 rounded-xl text-center text-slate-400 text-sm">
            No security findings match your filter criteria.
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <FindingCard key={finding.id || finding.checkKey} finding={finding} />
          ))
        )}
      </div>
    </div>
  );
};
