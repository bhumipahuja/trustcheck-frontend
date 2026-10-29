import React from 'react';
import { Severity } from '../types';

interface SeverityBadgeProps {
  severity: Severity;
  count?: number;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, count }) => {
  const styles: Record<Severity, { bg: string; text: string; border: string; label: string }> = {
    CRITICAL: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/30',
      label: 'Critical',
    },
    HIGH: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      label: 'High',
    },
    MEDIUM: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      label: 'Medium',
    },
    LOW: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      label: 'Low',
    },
    INFORMATIONAL: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      border: 'border-slate-500/30',
      label: 'Info',
    },
  };

  const style = styles[severity] || styles.INFORMATIONAL;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{style.label}</span>
      {typeof count === 'number' && (
        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-bold">
          {count}
        </span>
      )}
    </span>
  );
};
