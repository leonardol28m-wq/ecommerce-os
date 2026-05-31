import React, { useState } from 'react';
import { Package, Star, Tag, Image, ChevronDown, ChevronUp, ExternalLink, Save } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { useScanner } from '../../hooks/useScanner';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/LoadingSpinner';
import { truncate, formatDate } from '@/utils/helpers';

export function ProductAnalyzerTab() {
  const { scanResult } = useAppStore();
  const { saveCurrentScan } = useScanner();
  const [showImages, setShowImages] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [saving, setSaving] = useState(false);
  const product = scanResult?.product;
  const handleSaveProduct = async () => { if (!scanResult) return; setSaving(true); await saveCurrentScan(scanResult); setSaving(false); };

  if (!product) return <div className="h-full flex items-center justify-center"><EmptyState icon={<Package className="w-5 h-5" />} title="No product data" description="Scan a product page to extract name, price, variants, images and reviews" /></div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto scroll-area px-4 py-4 space-y-3">
        <Card elevated>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <p className="text-sm font-bold text-text-primary leading-snug">{product.name}</p>
              {product.brand && <p className="text-xs text-text-muted mt-0.5">{product.brand}</p>}
            </div>
            <a href={product.url} target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent-blue shrink-0"><ExternalLink className="w-3.5 h-3.5" /></a>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-xl font-black text-text-primary">{product.price}</span>
            {product.originalPrice && <span className="text-sm text-text-muted line-through">{product.originalPrice}</span>}
            {product.discount && <Badge color="#10B981" className="text-[10px]">{product.discount}</Badge>}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {product.availability && <Badge color={product.availability.toLowerCase().includes('stock') ? '#10B981' : '#F43F5E'} dot>{product.availability}</Badge>}
            {product.sku && <span className="text-[10px] text-text-muted bg-bg-tertiary border border-border-subtle px-2 py-0.5 rounded-lg">SKU: {product.sku}</span>}
            {product.currency && <span className="text-[10px] text-text-muted bg-bg-tertiary border border-border-subtle px-2 py-0.5 rounded-lg">{product.currency}</span>}
          </div>
        </Card>
        {product.reviewsSummary && (
          <Card elevated>
            <p className="section-header flex items-center gap-1.5"><Star className="w-3 h-3 text-accent-amber" />Reviews</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">{[1,2,3,4,5].map((star) => (<svg key={star} className="w-4 h-4" viewBox="0 0 20 20" fill={star <= Math.round(product.reviewsSummary!.rating) ? '#F59E0B' : '#3A3A5A'}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div>
              <span className="text-sm font-bold text-text-primary">{product.reviewsSummary.rating.toFixed(1)}</span>
              <span className="text-xs text-text-muted">({product.reviewsSummary.count.toLocaleString()} reviews)</span>
            </div>
          </Card>
        )}
        {product.variants.length > 0 && (
          <Card elevated>
            <p className="section-header flex items-center gap-1.5"><Tag className="w-3 h-3 text-accent-purple" />Variants</p>
            <div className="space-y-2">{product.variants.map((variant, i) => (
              <div key={i}>
                <p className="text-xs font-semibold text-text-secondary mb-1.5">{variant.name}</p>
                <div className="flex flex-wrap gap-1">
                  {variant.values.slice(0, 12).map((val, j) => <span key={j} className="text-[10px] text-text-primary bg-bg-tertiary border border-border-default rounded-lg px-2 py-0.5 font-medium">{val}</span>)}
                  {variant.values.length > 12 && <span className="text-[10px] text-text-muted px-2 py-0.5">+{variant.values.length - 12} more</span>}
                </div>
              </div>
            ))}</div>
          </Card>
        )}
        {product.images.length > 0 && (
          <Card elevated>
            <button className="w-full flex items-center justify-between cursor-pointer" onClick={() => setShowImages(!showImages)}>
              <p className="section-header flex items-center gap-1.5 mb-0"><Image className="w-3 h-3 text-accent-blue" />Images ({product.images.length})</p>
              {showImages ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
            </button>
            {showImages && (
              <div className="mt-3 grid grid-cols-3 gap-2 animate-fade-in">
                {product.images.slice(0, 6).map((img, i) => (
                  <a key={i} href={img} target="_blank" rel="noreferrer">
                    <img src={img} alt={`Product ${i + 1}`} className="w-full aspect-square object-cover rounded-xl border border-border-subtle hover:border-accent-blue/50 transition-colors" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </a>
                ))}
              </div>
            )}
          </Card>
        )}
        {product.description && (
          <Card elevated>
            <button className="w-full flex items-center justify-between cursor-pointer" onClick={() => setShowDesc(!showDesc)}>
              <p className="section-header mb-0">Description</p>
              {showDesc ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
            </button>
            {showDesc ? <p className="mt-2 text-xs text-text-secondary leading-relaxed animate-fade-in">{product.description}</p> : <p className="mt-1 text-xs text-text-muted">{truncate(product.description, 80)}</p>}
          </Card>
        )}
        <Button variant="secondary" onClick={handleSaveProduct} loading={saving} className="w-full justify-center"><Save className="w-3.5 h-3.5" />Save Product Data</Button>
        <p className="text-[10px] text-text-disabled text-center">Extracted · {formatDate(product.extractedAt)}</p>
      </div>
    </div>
  );
}
