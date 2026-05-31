import type { Platform, SavedStore, ScanResult } from '@/types';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function extractStoreName(url: string): string {
  const domain = extractDomain(url);
  return domain.split('.').slice(0, -1).join('.')
    .split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function getPlatformColor(platform: Platform): string {
  const colors: Record<Platform, string> = {
    shopify: '#96BF48', tiendanube: '#50E3C2', woocommerce: '#7F54B3',
    magento: '#F26322', prestashop: '#25B9D7', vtex: '#F71963',
    bigcommerce: '#34313F', unknown: '#6B7280',
  };
  return colors[platform] ?? colors.unknown;
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    shopify: 'Shopify', tiendanube: 'Tiendanube', woocommerce: 'WooCommerce',
    magento: 'Magento', prestashop: 'PrestaShop', vtex: 'VTEX',
    bigcommerce: 'BigCommerce', unknown: 'Unknown',
  };
  return labels[platform] ?? 'Unknown';
}

export function createStoreFromScan(result: ScanResult, existingId?: string): SavedStore {
  const now = new Date().toISOString();
  return {
    id: existingId ?? generateId(),
    url: result.url,
    domain: extractDomain(result.url),
    name: extractStoreName(result.url),
    platform: result.platform,
    techStack: result.techStack,
    blueprint: result.blueprint,
    products: result.product ? [result.product] : [],
    tags: [], notes: '', savedAt: now, updatedAt: now, analysisCount: 1,
  };
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '…';
}

export function scoreToGrade(score: number): { grade: string; color: string } {
  if (score >= 80) return { grade: 'A', color: 'text-accent-emerald' };
  if (score >= 60) return { grade: 'B', color: 'text-accent-blue' };
  if (score >= 40) return { grade: 'C', color: 'text-accent-amber' };
  if (score >= 20) return { grade: 'D', color: 'text-orange-400' };
  return { grade: 'F', color: 'text-accent-rose' };
}
