import React from 'react';
import { Zap } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { extractDomain, truncate } from '@/utils/helpers';

export function Header() {
  const { currentUrl, scanResult } = useAppStore();
  const domain = currentUrl ? extractDomain(currentUrl) : null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center" style={{boxShadow:'0 0 16px rgba(59,130,246,0.3)'}}>
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-text-primary tracking-tight">Ecommerce</span>
          <span className="text-sm font-bold text-gradient tracking-tight"> OS</span>
        </div>
      </div>
      {domain && (
        <div className="flex items-center gap-1.5 bg-bg-elevated border border-border-subtle rounded-lg px-2.5 py-1">
          {scanResult && <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse-soft shrink-0" />}
          <span className="text-xs text-text-secondary font-medium truncate max-w-[140px]">{truncate(domain, 22)}</span>
        </div>
      )}
    </div>
  );
}
