import React from 'react';

export function LoadingSpinner({ size = 'md', color = '#3B82F6', className = '' }: { size?: 'sm' | 'md' | 'lg'; color?: string; className?: string }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <svg className={`animate-spin ${sizes[size]} ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke={color} strokeWidth="3" />
      <path className="opacity-90" fill={color} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function ScanAnimation({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-4 py-8 ${className}`}>
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
        <div className="absolute -inset-2 rounded-3xl border border-accent-blue/20 animate-ping opacity-30" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-text-primary">Scanning store...</p>
        <p className="text-xs text-text-muted mt-1">Analyzing platform, tech stack & blueprint</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-text-secondary">{title}</p>
        <p className="text-xs text-text-muted mt-1">{description}</p>
      </div>
      {action}
    </div>
  );
}
