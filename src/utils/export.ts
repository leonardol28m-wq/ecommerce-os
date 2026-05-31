import type { SavedStore, ProductInfo, ExportOptions } from '@/types';

export function exportToJSON(data: { stores?: SavedStore[]; products?: (ProductInfo & { storeId: string })[] }): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `ecommerce-os-export-${datestamp()}.json`);
}

export function exportStoresToCSV(stores: SavedStore[]): void {
  const headers = ['ID', 'Name', 'Domain', 'URL', 'Platform', 'Platform Confidence', 'Category', 'Tags', 'Notes', 'Products Count', 'Blueprint Score', 'Technologies Detected', 'Saved At', 'Updated At'];
  const rows = stores.map((s) => [
    s.id, s.name, s.domain, s.url, s.platform.platform, `${s.platform.confidence}%`,
    s.category ?? '', s.tags.join('; '), s.notes, s.products.length,
    s.blueprint?.overallScore ?? '', s.techStack.items.filter((t) => t.detected).map((t) => t.name).join('; '),
    s.savedAt, s.updatedAt,
  ]);
  downloadCSV([headers, ...rows], `ecommerce-os-stores-${datestamp()}.csv`);
}

export function exportProductsToCSV(products: ProductInfo[]): void {
  const headers = ['Name', 'Price', 'Original Price', 'Currency', 'Discount', 'Brand', 'Category', 'SKU', 'Availability', 'Variants', 'Images Count', 'Review Rating', 'Review Count', 'URL', 'Extracted At'];
  const rows = products.map((p) => [
    p.name, p.price, p.originalPrice ?? '', p.currency ?? '', p.discount ?? '',
    p.brand ?? '', p.category ?? '', p.sku ?? '', p.availability ?? '',
    p.variants.map((v) => `${v.name}: ${v.values.join(',')}`).join('; '),
    p.images.length, p.reviewsSummary?.rating ?? '', p.reviewsSummary?.count ?? '',
    p.url, p.extractedAt,
  ]);
  downloadCSV([headers, ...rows], `ecommerce-os-products-${datestamp()}.csv`);
}

export function handleExport(options: ExportOptions, stores: SavedStore[], products: (ProductInfo & { storeId: string })[]): void {
  const filteredStores = options.storesToExport ? stores.filter((s) => options.storesToExport!.includes(s.id)) : stores;
  const filteredProducts = products.filter((p) => filteredStores.some((s) => s.id === p.storeId));
  if (options.format === 'json') {
    const exportData: Record<string, unknown> = {};
    if (options.includeStores) exportData.stores = filteredStores;
    if (options.includeProducts) exportData.products = filteredProducts;
    exportToJSON(exportData as any);
  } else {
    if (options.includeStores) exportStoresToCSV(filteredStores);
    if (options.includeProducts) exportProductsToCSV(filteredProducts);
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(rows: unknown[][], filename: string): void {
  const csv = rows.map((row) => row.map((cell) => {
    const str = String(cell ?? '').replace(/"/g, '""');
    return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
  }).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, filename);
}

function datestamp(): string {
  return new Date().toISOString().split('T')[0];
}
