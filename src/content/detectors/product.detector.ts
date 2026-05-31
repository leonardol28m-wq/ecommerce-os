import type { ProductInfo, ProductVariant, ProductReview } from '@/types';

function extractStructuredData(): Partial<ProductInfo> {
  try {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      const data = JSON.parse(script.textContent ?? '{}');
      const product = data['@type'] === 'Product' ? data :
        (Array.isArray(data['@graph']) ? data['@graph'].find((g: any) => g['@type'] === 'Product') : null);
      if (product) {
        const offers = Array.isArray(product.offers) ? product.offers[0] : product.offers;
        const reviews = product.aggregateRating;
        return {
          name: product.name,
          description: product.description?.replace(/<[^>]*>/g, '').trim() ?? '',
          brand: product.brand?.name ?? product.brand,
          price: offers?.price?.toString() ?? '',
          currency: offers?.priceCurrency,
          availability: offers?.availability?.split('/').pop(),
          sku: product.sku ?? offers?.sku,
          images: [product.image].flat().filter(Boolean).map((img: any) => typeof img === 'string' ? img : img?.url ?? '').filter((url: string) => url.startsWith('http')),
          reviewsSummary: reviews ? { rating: parseFloat(reviews.ratingValue), count: parseInt(reviews.reviewCount ?? reviews.ratingCount ?? 0) } : undefined,
        };
      }
    }
  } catch (_) {}
  return {};
}

function extractShopifyProduct(): Partial<ProductInfo> {
  try {
    const meta = (window as any).ShopifyAnalytics?.meta?.product;
    if (meta) return { name: meta.title, price: meta.price ? `${(meta.price / 100).toFixed(2)}` : '', currency: meta.currency, sku: meta.sku, availability: meta.available ? 'In Stock' : 'Out of Stock', brand: meta.vendor, category: meta.type };
  } catch (_) {}
  return {};
}

function extractDOMProduct(): Partial<ProductInfo> {
  const result: Partial<ProductInfo> = {};
  const trySelectors = (selectors: string[], fn: (el: Element) => string | undefined): string | undefined => {
    for (const sel of selectors) { try { const el = document.querySelector(sel); if (el) { const v = fn(el); if (v) return v; } } catch (_) {} }
  };
  result.name = trySelectors(['h1.product-title', 'h1.product__title', 'h1[class*="product"]', '.product-name h1', '[itemprop="name"]', 'h1'], (el) => el.textContent?.trim());
  result.price = trySelectors(['[class*="price"]:not([class*="compare"]):not([class*="old"])', '.product__price', '[itemprop="price"]', '.price .amount'], (el) => { const p = el.getAttribute('content') ?? el.textContent?.trim() ?? ''; return /[\d.,]+/.test(p) ? p.replace(/\s+/g, ' ').trim() : undefined; });
  result.originalPrice = trySelectors(['.price--compare', '.compare-at-price', '.price-old', '.was-price', 's.price'], (el) => el.textContent?.trim());
  result.description = trySelectors(['.product-description', '.product__description', '[itemprop="description"]', '#product-description'], (el) => el.textContent?.trim()?.substring(0, 1000));
  const images: string[] = [];
  document.querySelectorAll('.product-gallery img, .product__media img, .product-images img, [data-product-image], [class*="product-image"] img').forEach((img) => {
    const src = (img as HTMLImageElement).src || img.getAttribute('data-src') || '';
    if (src?.startsWith('http') && !images.includes(src)) images.push(src);
  });
  if (images.length > 0) result.images = images.slice(0, 8);
  const variants: ProductVariant[] = [];
  document.querySelectorAll('select[name*="option"], select[id*="option"]').forEach((select) => {
    const label = document.querySelector(`label[for="${select.id}"]`)?.textContent?.trim() ?? select.id;
    const values: string[] = [];
    select.querySelectorAll('option:not([disabled])').forEach((opt) => { const text = opt.textContent?.trim() ?? ''; if (text && text !== 'Default Title') values.push(text); });
    if (values.length > 0 && label) variants.push({ name: label, values });
  });
  if (variants.length > 0) result.variants = variants;
  return result;
}

export function detectProduct(): ProductInfo {
  const structured = extractStructuredData();
  const shopify = extractShopifyProduct();
  const dom = extractDOMProduct();
  const merged = { ...dom, ...shopify, ...structured };
  return {
    name: merged.name ?? document.title ?? 'Unknown Product',
    price: merged.price ?? '', originalPrice: merged.originalPrice,
    currency: merged.currency, discount: merged.discount,
    variants: merged.variants ?? [], images: merged.images ?? [],
    description: merged.description ?? '',
    reviewsSummary: merged.reviewsSummary,
    sku: merged.sku, availability: merged.availability,
    brand: merged.brand, category: merged.category,
    url: window.location.href, extractedAt: new Date().toISOString(),
  };
}
