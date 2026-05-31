import React from 'react';

export function Card({ children, className = '', elevated, onClick, padding = 'md' }: { children: React.ReactNode; className?: string; elevated?: boolean; onClick?: () => void; padding?: 'sm' | 'md' | 'lg' | 'none' }) {
  const paddings = { sm: 'p-3', md: 'p-4', lg: 'p-5', none: '' };
  return (
    <div onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 ${elevated ? 'bg-bg-elevated border-border-default shadow-card' : 'bg-bg-glass border-border-subtle'} ${onClick ? 'cursor-pointer hover:border-border-strong hover:bg-bg-elevated' : ''} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
