import React from 'react';
import { Search, Layout, Package, Database, Download } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import type { TabId } from '@/types';

const navItems = [
  { id: 'scanner' as TabId, label: 'Scanner', Icon: Search },
  { id: 'blueprint' as TabId, label: 'Blueprint', Icon: Layout },
  { id: 'product' as TabId, label: 'Product', Icon: Package },
  { id: 'database' as TabId, label: 'Database', Icon: Database },
  { id: 'export' as TabId, label: 'Export', Icon: Download },
];

export function Navigation() {
  const { activeTab, setActiveTab } = useAppStore();
  return (
    <nav className="flex items-center justify-around px-2 py-1.5 border-t border-border-subtle bg-bg-secondary shrink-0">
      {navItems.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button key={id} onClick={() => setActiveTab(id)} className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer select-none ${isActive ? 'text-accent-blue' : 'text-text-muted hover:text-text-secondary'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${isActive ? 'bg-accent-blue/15' : ''}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-accent-blue' : ''}`}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
