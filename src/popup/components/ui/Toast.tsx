import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import type { Toast } from '@/types';

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useAppStore();
  const configs = {
    success: { icon: CheckCircle, color: 'text-accent-emerald', bg: 'bg-accent-emerald/10 border-accent-emerald/20' },
    error: { icon: AlertCircle, color: 'text-accent-rose', bg: 'bg-accent-rose/10 border-accent-rose/20' },
    info: { icon: Info, color: 'text-accent-blue', bg: 'bg-accent-blue/10 border-accent-blue/20' },
    warning: { icon: AlertTriangle, color: 'text-accent-amber', bg: 'bg-accent-amber/10 border-accent-amber/20' },
  };
  const config = configs[toast.type];
  const Icon = config.icon;
  return (
    <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border text-xs animate-slide-up ${config.bg}`}>
      <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${config.color}`} />
      <span className="text-text-primary flex-1 leading-relaxed">{toast.message}</span>
      <button onClick={() => removeToast(toast.id)} className="text-text-muted hover:text-text-secondary shrink-0"><X className="w-3 h-3" /></button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useAppStore();
  if (toasts.length === 0) return null;
  return (
    <div className="absolute bottom-16 left-3 right-3 flex flex-col gap-1.5 z-50">
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
