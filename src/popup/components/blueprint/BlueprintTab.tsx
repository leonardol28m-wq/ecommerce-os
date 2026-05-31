import React from 'react';
import { Layout, CheckCircle, XCircle, TrendingUp, Lightbulb, Navigation, Image, Award, Star, HelpCircle, Mail, ShoppingCart, Clock, MessageSquare, Layers } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/LoadingSpinner';
import { ScoreBadge } from '../ui/Badge';
import type { BlueprintSectionType } from '@/types';

const sectionIcons: Record<BlueprintSectionType, React.ComponentType<{ className?: string }>> = {
  header: Navigation, hero: Image, benefits: Award, reviews: Star, faq: HelpCircle,
  footer: Layers, trust_badges: CheckCircle, newsletter: Mail, upsells: ShoppingCart,
  product_gallery: Image, countdown_timer: Clock, popup: MessageSquare, sticky_bar: Layers,
};

export function BlueprintTab() {
  const { scanResult } = useAppStore();
  const blueprint = scanResult?.blueprint;
  if (!blueprint) return <div className="h-full flex items-center justify-center"><EmptyState icon={<Layout className="w-5 h-5" />} title="No blueprint yet" description="Scan a store first to generate its page blueprint" /></div>;
  const detected = blueprint.sections.filter((s) => s.detected);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto scroll-area px-4 py-4 space-y-4">
        <Card elevated>
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Store Blueprint</p><p className="text-xs text-text-muted mt-0.5">{detected.length}/{blueprint.sections.length} sections detected</p></div>
            <div className="text-right"><div className="text-3xl font-black text-gradient leading-none">{blueprint.overallScore}</div><div className="text-xs text-text-muted mt-0.5">/ 100</div></div>
          </div>
          <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-emerald transition-all duration-1000" style={{ width: `${blueprint.overallScore}%` }} />
          </div>
        </Card>
        <div>
          <p className="section-header">Page Structure</p>
          <div className="grid grid-cols-2 gap-2">
            {blueprint.sections.map((section) => {
              const Icon = sectionIcons[section.type] ?? Layers;
              return (
                <div key={section.type} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${section.detected ? 'bg-bg-elevated border-border-default' : 'bg-bg-tertiary/50 border-border-subtle opacity-50'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${section.detected ? 'bg-accent-blue/15' : 'bg-bg-glass'}`}>
                    <Icon className={`w-3.5 h-3.5 ${section.detected ? 'text-accent-blue' : 'text-text-disabled'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-semibold leading-tight truncate ${section.detected ? 'text-text-primary' : 'text-text-disabled'}`}>{section.label}</p>
                    {section.detected && <ScoreBadge score={section.score} className="mt-0.5" />}
                  </div>
                  {section.detected ? <CheckCircle className="w-3.5 h-3.5 text-accent-emerald shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-text-disabled shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
        {blueprint.strengths.length > 0 && (
          <div>
            <p className="section-header flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-accent-emerald" />Strengths</p>
            <div className="space-y-1.5">{blueprint.strengths.map((s, i) => <div key={i} className="flex items-start gap-2 p-2.5 bg-accent-emerald/5 border border-accent-emerald/15 rounded-xl"><CheckCircle className="w-3.5 h-3.5 text-accent-emerald shrink-0 mt-0.5" /><span className="text-xs text-text-primary">{s}</span></div>)}</div>
          </div>
        )}
        {blueprint.opportunities.length > 0 && (
          <div>
            <p className="section-header flex items-center gap-1.5"><Lightbulb className="w-3 h-3 text-accent-amber" />Opportunities</p>
            <div className="space-y-1.5">{blueprint.opportunities.map((o, i) => <div key={i} className="flex items-start gap-2 p-2.5 bg-accent-amber/5 border border-accent-amber/15 rounded-xl"><Lightbulb className="w-3.5 h-3.5 text-accent-amber shrink-0 mt-0.5" /><span className="text-xs text-text-primary">{o}</span></div>)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
