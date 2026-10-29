import React from 'react';

interface DataPoint {
  label: string;
  score: number;
}

interface TrendChartProps {
  data?: DataPoint[];
  height?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data = [
    { label: 'Day 1', score: 72 },
    { label: 'Day 5', score: 78 },
    { label: 'Day 10', score: 81 },
    { label: 'Day 15', score: 83 },
    { label: 'Day 20', score: 77 },
    { label: 'Day 24', score: 68 },
    { label: 'Day 27', score: 76 },
    { label: 'Day 30', score: 85 },
  ],
  height = 180,
}) => {
  const width = 500;
  const padding = 35;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const minScore = 50;
  const maxScore = 100;

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * graphWidth;
    const y =
      padding +
      graphHeight -
      ((d.score - minScore) / (maxScore - minScore)) * graphHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, index) => {
    return `${acc} ${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }, '');

  // Area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${
    height - padding
  } L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full glass-panel rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            30-Day Security Health Trend
          </h4>
          <p className="text-xs text-slate-400">
            Historical posture progression and regression tracking
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
          Net Delta: +13 pts
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[50, 75, 100].map((score) => {
            const y =
              padding +
              graphHeight -
              ((score - minScore) / (maxScore - minScore)) * graphHeight;
            return (
              <g key={score}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 8}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="9"
                  textAnchor="end"
                  className="font-mono"
                >
                  {score}
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          <path d={areaD} fill="url(#trendGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {points.map((p, i) => (
            <g key={i} className="group">
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                className="fill-emerald-400 stroke-slate-950 stroke-2 transition-all hover:r-6 cursor-pointer"
              />
              <text
                x={p.x}
                y={p.y - 10}
                fill="#f1f5f9"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                className="opacity-0 group-hover:opacity-100 transition-opacity font-mono"
              >
                {p.score}
              </text>
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - padding + 15}
              fill="#64748b"
              fontSize="9"
              textAnchor="middle"
              className="font-mono"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
