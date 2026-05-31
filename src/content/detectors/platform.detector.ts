import type { Platform, PlatformInfo } from '@/types';

interface PlatformSignature {
  platform: Platform;
  checks: (() => boolean)[];
  weight: number;
}

const signatures: PlatformSignature[] = [
  {
    platform: 'shopify', weight: 1,
    checks: [
      () => typeof (window as any).Shopify !== 'undefined',
      () => !!document.querySelector('meta[name="shopify-checkout-api-token"]'),
      () => !!document.querySelector('[data-shopify]'),
      () => document.documentElement.innerHTML.includes('cdn.shopify.com'),
      () => !!document.querySelector('script[src*="shopify"]'),
      () => !!document.querySelector('link[href*="shopify"]'),
    ],
  },
  {
    platform: 'tiendanube', weight: 1,
    checks: [
      () => typeof (window as any).LS !== 'undefined',
      () => document.documentElement.innerHTML.includes('tiendanube.com'),
      () => document.documentElement.innerHTML.includes('nuvemshop.com'),
      () => !!document.querySelector('[data-store]'),
      () => document.documentElement.innerHTML.includes('d26lpennugtm8c.cloudfront.net'),
      () => !!document.querySelector('meta[content*="Tiendanube"]'),
    ],
  },
  {
    platform: 'woocommerce', weight: 1,
    checks: [
      () => typeof (window as any).wc_add_to_cart_params !== 'undefined',
      () => typeof (window as any).woocommerce_params !== 'undefined',
      () => !!document.querySelector('.woocommerce'),
      () => document.documentElement.innerHTML.includes('woocommerce'),
      () => !!document.querySelector('[data-product_id]'),
      () => !!document.querySelector('link[href*="woocommerce"]'),
    ],
  },
  {
    platform: 'magento', weight: 1,
    checks: [
      () => typeof (window as any).Magento !== 'undefined',
      () => typeof (window as any).require !== 'undefined' && document.documentElement.innerHTML.includes('mage/'),
      () => !!document.querySelector('body[class*="catalog-"]'),
      () => document.documentElement.innerHTML.includes('Mage.Cookies'),
      () => document.documentElement.innerHTML.includes('/media/wysiwyg/'),
      () => !!document.querySelector('[data-mage-init]'),
    ],
  },
  {
    platform: 'prestashop', weight: 1,
    checks: [
      () => typeof (window as any).prestashop !== 'undefined',
      () => !!document.querySelector('#_desktop_top_menu'),
      () => document.documentElement.innerHTML.includes('prestashop'),
      () => !!document.querySelector('.product-miniature'),
      () => document.documentElement.innerHTML.includes('blockcart'),
      () => !!document.querySelector('link[href*="themes/classic"]'),
    ],
  },
  {
    platform: 'vtex', weight: 1,
    checks: [
      () => typeof (window as any).__RUNTIME__ !== 'undefined',
      () => typeof (window as any).vtex !== 'undefined',
      () => document.documentElement.innerHTML.includes('vtex.com'),
      () => document.documentElement.innerHTML.includes('io.vtex'),
      () => !!document.querySelector('[data-src*="vtex"]'),
      () => document.documentElement.innerHTML.includes('vteximg.com'),
    ],
  },
  {
    platform: 'bigcommerce', weight: 1,
    checks: [
      () => typeof (window as any).BCData !== 'undefined',
      () => document.documentElement.innerHTML.includes('bigcommerce.com'),
      () => !!document.querySelector('[data-cart-quantity]'),
      () => !!document.querySelector('.bc-cart'),
    ],
  },
];

export function detectPlatform(): PlatformInfo {
  const results: { platform: Platform; hits: number; total: number; indicators: string[] }[] = [];
  for (const sig of signatures) {
    const indicators: string[] = [];
    let hits = 0;
    for (const check of sig.checks) {
      try { if (check()) { hits++; indicators.push(`Signal ${hits} confirmed`); } } catch (_) {}
    }
    if (hits > 0) results.push({ platform: sig.platform, hits, total: sig.checks.length, indicators });
  }
  if (results.length === 0) return { platform: 'unknown', confidence: 0, indicators: [] };
  results.sort((a, b) => b.hits - a.hits);
  const best = results[0];
  return { platform: best.platform, confidence: Math.round((best.hits / best.total) * 100), indicators: best.indicators };
}
