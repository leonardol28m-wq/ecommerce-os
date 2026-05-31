import React from 'react';

export function Badge({ children, color, className = '', dot }: { children: React.ReactNode; color?: string; className?: string; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium ${className}`}
      style={color ? { backgroundColor: `${color}22`, color, borderColor: `${color}44`, border: '1px solid' } : undefined}>
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color ?? 'currentColor' }} />}
      {children}
    </span>
  );
}

export function ScoreBadge({ score, className = '' }: { score: number; className?: string }) {
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#3B82F6' : score >= 20 ? '#F59E0B' : '#F43F5E';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold ${className}`}
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}>
      {score}%
    </span>
  );
}
