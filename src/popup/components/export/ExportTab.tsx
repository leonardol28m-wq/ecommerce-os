import React, { useState } from 'react';
import { Download, FileJson, FileText, Store, Package, Layout, Check } from 'lucide-react';
import { useExport } from '../../hooks/useExport';
import { useAppStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { ExportFormat } from '@/types';

export function ExportTab() {
  const { stores } = useAppStore();
  const { exportData } = useExport();
  const [format, setFormat] = useState<ExportFormat>('json');
  const [includeStores, setIncludeStores] = useState(true);
  const [includeProducts, setIncludeProducts] = useState(true);
  const [includeBlueprints, setIncludeBlueprints] = useState(true);
  const [exporting, setExporting] = useState(false);
  const totalProducts = stores.reduce((acc, s) => acc + s.products.length, 0);
  const handleExport = async () => { setExporting(true); await exportData({ format, includeStores, includeProducts, includeBlueprints }); setExporting(false); };

  const ToggleRow = ({ icon: Icon, label, description, value, onChange, count }: { icon: React.ComponentType<{ className?: string }>; label: string; description: string; value: boolean; onChange: (v: boolean) => void; count?: number; }) => (
    <div className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${value ? 'bg-accent-blue/8 border-accent-blue/25' : 'bg-bg-tertiary/50 border-border-subtle'}`} onClick={() => onChange(!value)}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${value ? 'bg-accent-blue/20' : 'bg-bg-glass'}`}><Icon className={`w-4 h-4 ${value ? 'text-accent-blue' : 'text-text-muted'}`} /></div>
      <div className="flex-1">
        <div className="flex items-center gap-2"><p className="text-sm font-semibold text-text-primary">{label}</p>{count !== undefined && <span className="text-[10px] font-bold text-accent-blue bg-accent-blue/15 px-1.5 py-0.5 rounded-md">{count}</span>}</div>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${value ? 'bg-accent-blue border-accent-blue' : 'border-border-default'}`}>{value && <Check className="w-3 h-3 text-white" />}</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto scroll-area px-4 py-4 space-y-4">
        <div>
          <p className="section-header">Export Format</p>
          <div className="grid grid-cols-2 gap-2">
            {([{id: 'json' as ExportFormat, label: 'JSON', Icon: FileJson, desc: 'Full structured data'}, {id: 'csv' as ExportFormat, label: 'CSV', Icon: FileText, desc: 'Spreadsheet-ready'}]).map(({ id, label, Icon, desc }) => (
              <button key={id} onClick={() => setFormat(id)} className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all cursor-pointer ${format === id ? 'bg-accent-blue/10 border-accent-blue/40 text-accent-blue' : 'bg-bg-elevated border-border-default text-text-secondary hover:border-border-strong'}`}>
                <Icon className={`w-6 h-6 ${format === id ? 'text-accent-blue' : 'text-text-muted'}`} />
                <div><p className="text-sm font-bold">{label}</p><p className="text-[10px] text-text-muted">{desc}</p></div>
                {format === id && <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="section-header">Include Data</p>
          <div className="space-y-2">
            <ToggleRow icon={Store} label="Stores" description="Platform, tech stack, metadata" value={includeStores} onChange={setIncludeStores} count={stores.length} />
            <ToggleRow icon={Package} label="Products" description="Name, price, variants, reviews" value={includeProducts} onChange={setIncludeProducts} count={totalProducts} />
            <ToggleRow icon={Layout} label="Blueprints" description="Page structure analysis" value={includeBlueprints} onChange={setIncludeBlueprints} />
          </div>
        </div>
        <Card elevated>
          <p className="section-header">Export Summary</p>
          <div className="space-y-1.5">
            {[{label: 'Format', value: format.toUpperCase()},{label: 'Stores', value: includeStores ? stores.length : '—'},{label: 'Products', value: includeProducts ? totalProducts : '—'},{label: 'Blueprints', value: includeBlueprints ? stores.filter((s) => s.blueprint).length : '—'}].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center"><span className="text-xs text-text-muted">{label}</span><span className="text-xs font-semibold text-text-primary">{value}</span></div>
            ))}
          </div>
        </Card>
        <Button variant="primary" onClick={handleExport} loading={exporting} disabled={stores.length === 0 || (!includeStores && !includeProducts)} className="w-full justify-center py-3 font-semibold">
          {!exporting && <Download className="w-4 h-4" />}Export {format.toUpperCase()}
        </Button>
        {stores.length === 0 && <p className="text-xs text-text-muted text-center">No data to export. Save some stores first.</p>}
      </div>
    </div>
  );
}
