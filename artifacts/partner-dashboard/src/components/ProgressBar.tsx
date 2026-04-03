interface ProgressBarProps {
  value: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export default function ProgressBar({ value, color = "bg-blue-500", height = "h-2", showLabel = false, animated = true }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-white/10 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-700 ease-out ${animated ? "animate-in" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground mt-1">{pct}%</span>
      )}
    </div>
  );
}
