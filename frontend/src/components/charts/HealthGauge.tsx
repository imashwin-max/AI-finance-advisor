interface HealthGaugeProps {
  score: number;
  level: string;
}

export function HealthGauge({ score, level }: HealthGaugeProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const color = score >= 80 ? "#34d399" : score >= 60 ? "#22d3ee" : score >= 40 ? "#facc15" : "#f87171";

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="rgb(var(--color-border))" strokeWidth="14" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        <text x="100" y="95" textAnchor="middle" fontSize="36" fontWeight="700" fill="rgb(var(--color-foreground))">{score}</text>
        <text x="100" y="120" textAnchor="middle" fontSize="13" fill="rgb(var(--color-muted))">/ 100</text>
      </svg>
      <span className="mt-2 text-sm font-medium" style={{ color }}>{level}</span>
    </div>
  );
}
