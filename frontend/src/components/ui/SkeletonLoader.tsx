export function SkeletonLoader({ className = "h-24" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-surfaceHover ${className}`} />;
}
