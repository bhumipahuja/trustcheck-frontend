import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = '#22c55e'; // green-500
  let textColor = 'text-emerald-400';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let grade = 'A';

  if (score >= 95) {
    grade = 'A+';
    strokeColor = '#10b981'; // emerald-500
    textColor = 'text-emerald-400';
  } else if (score >= 80) {
    grade = 'A';
    strokeColor = '#22c55e'; // green-500
    textColor = 'text-green-400';
  } else if (score >= 65) {
    grade = 'B';
    strokeColor = '#eab308'; // yellow-500
    textColor = 'text-yellow-400';
    badgeColor = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
  } else if (score >= 50) {
    grade = 'C';
    strokeColor = '#f97316'; // orange-500
    textColor = 'text-orange-400';
    badgeColor = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
  } else {
    grade = 'F';
    strokeColor = '#ef4444'; // red-500
    textColor = 'text-red-400';
    badgeColor = 'bg-red-500/10 text-red-400 border-red-500/30';
  }

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-3xl font-extrabold tracking-tight ${textColor}`}>
          {score}
        </span>
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          / 100
        </span>
      </div>

      <div className={`mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
        Grade: {grade}
      </div>
    </div>
  );
};
