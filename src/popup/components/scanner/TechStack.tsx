import React from 'react';
import type { TechStack as TechStackType, TechItem, TechCategory } from '@/types';
import { BarChart2, Tag, Eye, Settings, MessageCircle } from 'lucide-react';

const categoryConfig: Record<TechCategory, { label: string; color: string; Icon: React.ComponentType<{ className?: string }> }> = {
  analytics: { label: 'Analytics', color: '#3B82F6', Icon: BarChart2 },
  marketing: { label: 'Marketing', color: '#8B5CF6', Icon: Tag },
  heatmap: { label: 'Heatmap', color: '#F59E0B', Icon: Eye },
  tagmanager: { label: 'Tag Manager', color: '#10B981', Icon: Settings },
  chat: { label: 'Live Chat', color: '#F43F5E', Icon: MessageCircle },
  review: { label: 'Reviews', color: '#06B6D4', Icon: BarChart2 },
  payment: { label: 'Payment', color: '#84CC16', Icon: Tag },
};

function TechItemRow({ item }: { item: TechItem }) {
  const { color, Icon } = categoryConfig[item.category];
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: item.detected ? `${color}20` : 'rgba(255,255,255,0.04)' }}>
        <Icon className="w-3 h-3" style={{ color: item.detected ? color : '#5A5A7A' }} />
      </div>
      <span className={`text-xs flex-1 font-medium ${item.detected ? 'text-text-primary' : 'text-text-muted line-through'}`}>{item.name}</span>
      {item.detected && <span className="text-[10px] font-semibold" style={{ color }}>✓</span>}
    </div>
  );
}

export function TechStackPanel({ techStack }: { techStack: TechStackType }) {
  const detected = techStack.items.filter((i) => i.detected);
  const byCategory = detected.reduce<Record<TechCategory, TechItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<TechCategory, TechItem[]>);
  const categories = Object.keys(byCategory) as TechCategory[];

  if (detected.length === 0) return <div className="text-center py-4"><p className="text-xs text-text-muted">No tracking technologies detected</p></div>;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {detected.map((item) => { const { color } = categoryConfig[item.category]; return (
          <span key={item.id} className="text-[10px] font-medium px-2 py-0.5 rounded-lg border" style={{ color, backgroundColor: `${color}18`, borderColor: `${color}30` }}>{item.name}</span>
        ); })}
      </div>
      {categories.map((cat) => { const { label, color, Icon } = categoryConfig[cat]; return (
        <div key={cat}>
          <div className="flex items-center gap-1.5 mb-1.5"><Icon className="w-3 h-3" style={{ color }} /><span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</span></div>
          {byCategory[cat].map((item) => <TechItemRow key={item.id} item={item} />)}
        </div>
      ); })}
    </div>
  );
}
