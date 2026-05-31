import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-accent-blue hover:bg-blue-500 text-white',
    secondary: 'bg-bg-elevated hover:bg-bg-tertiary border border-border-default text-text-primary',
    ghost: 'hover:bg-bg-elevated text-text-secondary hover:text-text-primary',
    danger: 'bg-accent-rose/15 hover:bg-accent-rose/25 text-accent-rose border border-accent-rose/30',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs gap-1.5', md: 'px-4 py-2.5 text-sm gap-2', lg: 'px-5 py-3 text-base gap-2' };
  return (
    <button {...props} disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-95 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}>
      {loading && (
        <svg className="animate-spin w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
