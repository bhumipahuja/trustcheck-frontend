import React, { useState } from 'react';
import { Finding } from '../types';
import { SeverityBadge } from './SeverityBadge';
import { ChevronDown, ChevronUp, ShieldAlert, Terminal, Wrench } from 'lucide-react';

interface FindingCardProps {
  finding: Finding;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryNames: Record<string, string> = {
    SSL_TLS: 'SSL / TLS Security',
    SECURITY_HEADERS: 'HTTP Defense Headers',
    COOKIES: 'Cookie Protection',
    DNS_EMAIL: 'DNS & Email Spoofing',
    INFO_LEAK: 'Server Disclosure',
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-xl overflow-hidden transition-all duration-200">
      <div
        className="p-4 cursor-pointer flex items-start justify-between gap-4 select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 text-slate-400">
            <ShieldAlert className="w-5 h-5 text-amber-400/80" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <SeverityBadge severity={finding.severity} />
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                {categoryNames[finding.category] || finding.category}
              </span>
              {finding.penaltyPoints > 0 && (
                <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  -{finding.penaltyPoints} pts
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-slate-100 leading-snug">
              {finding.title}
            </h3>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">
              {finding.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle details"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-900/40 space-y-3">
          {/* Observed Evidence */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              Observed Technical Evidence
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-amber-200/90 break-all overflow-x-auto">
              {finding.evidence || 'No direct payload captured.'}
            </div>
          </div>

          {/* Actionable Remediation */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              Recommended Remediation
            </div>
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 font-mono text-xs text-emerald-300 leading-relaxed break-words whitespace-pre-wrap">
              {finding.remediation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
