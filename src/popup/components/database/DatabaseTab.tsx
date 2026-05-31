import React, { useState, useMemo } from 'react';
import { Database, Search, Trash2, ExternalLink, ChevronDown, ChevronUp, Edit3, Check, X } from 'lucide-react';
import { useDatabase } from '../../hooks/useDatabase';
import { useAppStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/LoadingSpinner';
import { PlatformBadge } from '../scanner/PlatformBadge';
import type { SavedStore } from '@/types';
import { formatDate, getPlatformColor, getPlatformLabel } from '@/utils/helpers';

function StoreCard({ store, onDelete, onUpdateNotes, onUpdateTags, onUpdateCategory }: { store: SavedStore; onDelete: (id: string) => void; onUpdateNotes: (id: string, notes: string) => void; onUpdateTags: (id: string, tags: string[]) => void; onUpdateCategory: (id: string, category: string) => void; }) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(store.notes);
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryText, setCategoryText] = useState(store.category ?? '');
  const [tagInput, setTagInput] = useState('');
  const techDetected = store.techStack.items.filter((i) => i.detected);

  return (
    <Card elevated padding="none" className="overflow-hidden">
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {store.favicon && <img src={store.favicon} alt="" className="w-4 h-4 rounded-sm shrink-0 inline mr-1.5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
            <p className="text-sm font-bold text-text-primary truncate inline">{store.name}</p>
            <p className="text-xs text-text-muted mt-0.5 truncate">{store.domain}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <a href={store.url} target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent-blue p-1"><ExternalLink className="w-3 h-3" /></a>
            <button onClick={() => onDelete(store.id)} className="text-text-muted hover:text-accent-rose p-1"><Trash2 className="w-3 h-3" /></button>
            <button onClick={() => setExpanded(!expanded)} className="text-text-muted hover:text-text-secondary p-1">{expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <PlatformBadge platform={store.platform.platform} confidence={store.platform.confidence} />
          {store.blueprint && <span className="text-[10px] text-text-muted bg-bg-tertiary border border-border-subtle px-2 py-0.5 rounded-lg">Score: {store.blueprint.overallScore}%</span>}
          {store.products.length > 0 && <span className="text-[10px] text-text-muted bg-bg-tertiary border border-border-subtle px-2 py-0.5 rounded-lg">{store.products.length} product{store.products.length > 1 ? 's' : ''}</span>}
        </div>
      </div>
      {expanded && (
        <div className="border-t border-border-subtle px-3 py-3 space-y-3 animate-fade-in">
          <div>
            <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Category</span>{!editingCategory && <button onClick={() => setEditingCategory(true)} className="text-text-muted hover:text-text-secondary"><Edit3 className="w-3 h-3" /></button>}</div>
            {editingCategory ? (
              <div className="flex gap-1.5">
                <input value={categoryText} onChange={(e) => setCategoryText(e.target.value)} placeholder="Fashion, Electronics..." className="input-field text-xs flex-1 py-1.5" onKeyDown={(e) => e.key === 'Enter' && (onUpdateCategory(store.id, categoryText), setEditingCategory(false))} autoFocus />
                <button onClick={() => { onUpdateCategory(store.id, categoryText); setEditingCategory(false); }} className="text-accent-emerald"><Check className="w-3.5 h-3.5" /></button>
                <button onClick={() => setEditingCategory(false)} className="text-text-muted"><X className="w-3.5 h-3.5" /></button>
              </div>
            ) : <p className="text-xs text-text-secondary">{store.category || <span className="text-text-muted italic">No category</span>}</p>}
          </div>
          <div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Tags</span>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {store.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 text-[10px] bg-accent-purple/15 text-accent-purple border border-accent-purple/25 px-2 py-0.5 rounded-lg">{tag}<button onClick={() => onUpdateTags(store.id, store.tags.filter((t) => t !== tag))} className="hover:text-accent-rose"><X className="w-2.5 h-2.5" /></button></span>)}
            </div>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && tagInput.trim()) { onUpdateTags(store.id, [...store.tags, tagInput.trim().toLowerCase()]); setTagInput(''); } }} placeholder="Add tag (Enter)" className="input-field text-xs py-1.5" />
          </div>
          {techDetected.length > 0 && <div><span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Tech Stack</span><div className="flex flex-wrap gap-1">{techDetected.map((t) => <span key={t.id} className="text-[10px] bg-bg-tertiary text-text-secondary border border-border-subtle px-2 py-0.5 rounded-lg">{t.name}</span>)}</div></div>}
          <div>
            <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Notes</span>{!editingNotes && <button onClick={() => setEditingNotes(true)} className="text-text-muted hover:text-text-secondary"><Edit3 className="w-3 h-3" /></button>}</div>
            {editingNotes ? (
              <div className="space-y-1.5">
                <textarea value={notesText} onChange={(e) => setNotesText(e.target.value)} placeholder="Add notes..." className="input-field text-xs w-full resize-none" rows={3} autoFocus />
                <div className="flex gap-1.5">
                  <button onClick={() => { onUpdateNotes(store.id, notesText); setEditingNotes(false); }} className="text-xs text-accent-emerald flex items-center gap-1"><Check className="w-3 h-3" />Save</button>
                  <button onClick={() => setEditingNotes(false)} className="text-xs text-text-muted">Cancel</button>
                </div>
              </div>
            ) : <p className="text-xs text-text-secondary">{store.notes || <span className="text-text-muted italic">No notes</span>}</p>}
          </div>
          <p className="text-[10px] text-text-disabled">Saved: {formatDate(store.savedAt)}</p>
        </div>
      )}
    </Card>
  );
}

export function DatabaseTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const { stores, deleteStore, updateStoreNotes, updateStoreTags, updateStoreCategory } = useDatabase();
  const { setActiveTab } = useAppStore();

  const filtered = useMemo(() => stores.filter((s) => {
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.domain.toLowerCase().includes(searchQuery.toLowerCase()) || s.tags.some((t) => t.includes(searchQuery.toLowerCase()));
    const matchesPlatform = filterPlatform === 'all' || s.platform.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  }), [stores, searchQuery, filterPlatform]);

  const platforms = [...new Set(stores.map((s) => s.platform.platform))];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-4 pb-2 space-y-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search stores..." className="input-field pl-8" />
        </div>
        {platforms.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button onClick={() => setFilterPlatform('all')} className={`text-xs px-2.5 py-1 rounded-lg shrink-0 border transition-all ${filterPlatform === 'all' ? 'bg-accent-blue/15 text-accent-blue border-accent-blue/30' : 'text-text-muted border-border-subtle hover:text-text-secondary'}`}>All ({stores.length})</button>
            {platforms.map((p) => { const color = getPlatformColor(p); return (
              <button key={p} onClick={() => setFilterPlatform(p)} className={`text-xs px-2.5 py-1 rounded-lg shrink-0 border transition-all ${filterPlatform === p ? 'border-current' : 'text-text-muted border-border-subtle hover:text-text-secondary'}`}
                style={filterPlatform === p ? { color, backgroundColor: `${color}18`, borderColor: `${color}40` } : undefined}>
                {getPlatformLabel(p)} ({stores.filter((s) => s.platform.platform === p).length})
              </button>
            ); })}
          </div>
        )}
      </div>
      {stores.length > 0 && (
        <div className="px-4 pb-2 shrink-0">
          <div className="flex gap-2">
            {[{label: 'Stores', value: stores.length, color: 'text-accent-blue'}, {label: 'Products', value: stores.reduce((acc, s) => acc + s.products.length, 0), color: 'text-accent-purple'}, {label: 'Filtered', value: filtered.length, color: 'text-accent-emerald'}].map(({ label, value, color }) => (
              <div key={label} className="flex-1 bg-bg-elevated border border-border-subtle rounded-xl p-2 text-center">
                <p className={`text-base font-black ${color}`}>{value}</p>
                <p className="text-[10px] text-text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto scroll-area px-4 pb-4 space-y-2">
        {filtered.length === 0 && stores.length === 0 && <EmptyState icon={<Database className="w-5 h-5" />} title="No stores saved" description="Scan stores and save them to build your competitor database" action={<Button variant="primary" size="sm" onClick={() => setActiveTab('scanner')}><Search className="w-3.5 h-3.5" />Go to Scanner</Button>} />}
        {filtered.length === 0 && stores.length > 0 && <EmptyState icon={<Search className="w-5 h-5" />} title="No results" description={`No stores match "${searchQuery}"`} />}
        {filtered.map((store) => <StoreCard key={store.id} store={store} onDelete={deleteStore} onUpdateNotes={updateStoreNotes} onUpdateTags={updateStoreTags} onUpdateCategory={updateStoreCategory} />)}
      </div>
    </div>
  );
}
