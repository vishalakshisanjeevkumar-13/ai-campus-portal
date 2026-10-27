import React from "react";

export const RadarChart = ({ data = [], size = 320 }) => {
  if (!data || data.length === 0) return null;

  const totalPoints = data.length;
  const radius = size * 0.38;
  const center = size / 2;
  const angleStep = (Math.PI * 2) / totalPoints;

  // Grid concentric polygon levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (angle, valRatio) => {
    const r = radius * valRatio;
    const x = center + r * Math.sin(angle);
    const y = center - r * Math.cos(angle);
    return { x, y };
  };

  // Data polygon points
  const dataPoints = data.map((d, i) => {
    const angle = i * angleStep;
    const ratio = (d.score || 0) / (d.max || 100);
    return getCoordinates(angle, ratio);
  });

  const dataPathString = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") + " Z";

  return (
    <div className="radar-chart-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Level Polygons */}
        {levels.map((lvl, lvlIdx) => {
          const points = data.map((_, i) => {
            const p = getCoordinates(i * angleStep, lvl);
            return `${p.x},${p.y}`;
          }).join(" ");

          return (
            <polygon
              key={`level-${lvlIdx}`}
              points={points}
              fill={lvlIdx === levels.length - 1 ? "rgba(99, 102, 241, 0.04)" : "transparent"}
              stroke="var(--surface-border)"
              strokeWidth="1"
              strokeDasharray={lvlIdx < levels.length - 1 ? "3 3" : "none"}
            />
          );
        })}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const p = getCoordinates(i * angleStep, 1.0);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="var(--surface-border)"
              strokeWidth="1"
            />
          );
        })}

        {/* Value Polygon Area */}
        <polygon
          points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(99, 102, 241, 0.35)"
          stroke="var(--primary)"
          strokeWidth="2.5"
          className="animate-fade-in"
        />

        {/* Data Point Dots & Labels */}
        {data.map((d, i) => {
          const angle = i * angleStep;
          const p = dataPoints[i];
          const labelCoord = getCoordinates(angle, 1.22);
          
          let textAnchor = "middle";
          if (labelCoord.x > center + 10) textAnchor = "start";
          if (labelCoord.x < center - 10) textAnchor = "end";

          return (
            <g key={`point-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="var(--primary)"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={labelCoord.x}
                y={labelCoord.y}
                fill="var(--text-secondary)"
                fontSize="11"
                fontWeight="600"
                textAnchor={textAnchor}
                dominantBaseline="central"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {d.name} ({d.score}%)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
