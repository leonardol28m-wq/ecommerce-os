import React, { useState } from 'react';
import { Search, Save, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { useScanner } from '../../hooks/useScanner';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ScanAnimation, EmptyState } from '../ui/LoadingSpinner';
import { PlatformBadge } from './PlatformBadge';
import { TechStackPanel } from './TechStack';
import { formatDate } from '@/utils/helpers';

export function StoreScannerTab() {
  const { scanResult } = useAppStore();
  const { isScanning, scanCurrentTab, saveCurrentScan } = useScanner();
  const [showTech, setShowTech] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => { if (!scanResult) return; setSaving(true); await saveCurrentScan(scanResult); setSaving(false); };
  const detectedTech = scanResult?.techStack.items.filter((i) => i.detected) ?? [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-4 pb-3 shrink-0">
        <Button variant="primary" onClick={scanCurrentTab} loading={isScanning} disabled={isScanning} className="w-full justify-center py-3 text-sm font-semibold">
          {!isScanning && <Search className="w-4 h-4" />}
          {isScanning ? 'Scanning...' : 'Scan Current Store'}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto scroll-area px-4 pb-4 space-y-3">
        {isScanning && <ScanAnimation />}
        {!isScanning && !scanResult && <EmptyState icon={<Search className="w-5 h-5" />} title="No scan yet" description="Navigate to any e-commerce store and click Scan to start analyzing" />}
        {!isScanning && scanResult && (
          <>
            <Card elevated>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Platform</span>
                <a href={scanResult.url} target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent-blue transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
              </div>
              <PlatformBadge platform={scanResult.platform.platform} confidence={scanResult.platform.confidence} large />
              {scanResult.platform.indicators.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {scanResult.platform.indicators.slice(0, 3).map((ind, i) => <span key={i} className="text-[10px] text-text-muted bg-bg-tertiary px-2 py-0.5 rounded-lg border border-border-subtle">{ind}</span>)}
                </div>
              )}
            </Card>
            <Card elevated>
              <button onClick={() => setShowTech(!showTech)} className="w-full flex items-center justify-between mb-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Tech Stack</span>
                  {detectedTech.length > 0 && <span className="text-[10px] font-bold text-accent-blue bg-accent-blue/15 px-1.5 py-0.5 rounded-md">{detectedTech.length}</span>}
                </div>
                {showTech ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
              </button>
              {showTech && <div className="mt-2 animate-fade-in"><TechStackPanel techStack={scanResult.techStack} /></div>}
            </Card>
            {scanResult.blueprint && (
              <Card elevated>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Blueprint Score</span>
                  <span className="text-lg font-black text-gradient">{scanResult.blueprint.overallScore}%</span>
                </div>
                <div className="mt-2 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-1000" style={{ width: `${scanResult.blueprint.overallScore}%` }} />
                </div>
                <p className="text-xs text-text-muted mt-2">{scanResult.blueprint.sections.filter((s) => s.detected).length} / {scanResult.blueprint.sections.length} sections detected</p>
              </Card>
            )}
            <div className="flex gap-2 pt-1">
              <Button variant="secondary" onClick={handleSave} loading={saving} className="flex-1 justify-center"><Save className="w-3.5 h-3.5" />Save Store</Button>
            </div>
            <p className="text-[10px] text-text-disabled text-center">Scanned · {formatDate(scanResult.techStack.detectedAt)}</p>
          </>
        )}
      </div>
    </div>
  );
}
