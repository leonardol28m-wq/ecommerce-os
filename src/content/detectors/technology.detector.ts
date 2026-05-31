import type { TechItem, TechStack, TechCategory } from '@/types';

interface TechSignature {
  id: string;
  name: string;
  category: TechCategory;
  checks: (() => boolean)[];
}

const techSignatures: TechSignature[] = [
  {
    id: 'google-analytics-ua', name: 'Google Analytics (UA)', category: 'analytics',
    checks: [
      () => typeof (window as any).ga === 'function',
      () => typeof (window as any)._gaq !== 'undefined',
      () => !!document.querySelector('script[src*="google-analytics.com/analytics.js"]'),
      () => document.documentElement.innerHTML.includes("ga('create'"),
    ],
  },
  {
    id: 'google-analytics-4', name: 'Google Analytics 4', category: 'analytics',
    checks: [
      () => typeof (window as any).gtag === 'function',
      () => !!document.querySelector('script[src*="googletagmanager.com/gtag"]'),
      () => document.documentElement.innerHTML.includes("gtag('config', 'G-"),
      () => typeof (window as any).dataLayer !== 'undefined' && document.documentElement.innerHTML.includes('G-'),
    ],
  },
  {
    id: 'meta-pixel', name: 'Meta Pixel (Facebook)', category: 'marketing',
    checks: [
      () => typeof (window as any).fbq === 'function',
      () => !!document.querySelector('script[src*="connect.facebook.net"]'),
      () => document.documentElement.innerHTML.includes("fbq('init'"),
      () => typeof (window as any)._fbq !== 'undefined',
    ],
  },
  {
    id: 'tiktok-pixel', name: 'TikTok Pixel', category: 'marketing',
    checks: [
      () => typeof (window as any).ttq !== 'undefined',
      () => !!document.querySelector('script[src*="analytics.tiktok.com"]'),
      () => document.documentElement.innerHTML.includes('ttq.load('),
      () => document.documentElement.innerHTML.includes('tiktok-pixel'),
    ],
  },
  {
    id: 'google-tag-manager', name: 'Google Tag Manager', category: 'tagmanager',
    checks: [
      () => typeof (window as any).google_tag_manager !== 'undefined',
      () => !!document.querySelector('script[src*="googletagmanager.com/gtm.js"]'),
      () => document.documentElement.innerHTML.includes('GTM-'),
      () => !!document.querySelector('iframe[src*="googletagmanager.com/ns.html"]'),
    ],
  },
  {
    id: 'microsoft-clarity', name: 'Microsoft Clarity', category: 'heatmap',
    checks: [
      () => typeof (window as any).clarity === 'function',
      () => !!document.querySelector('script[src*="clarity.ms"]'),
      () => document.documentElement.innerHTML.includes("clarity('"),
    ],
  },
  {
    id: 'hotjar', name: 'Hotjar', category: 'heatmap',
    checks: [
      () => typeof (window as any).hj === 'function',
      () => !!document.querySelector('script[src*="static.hotjar.com"]'),
      () => document.documentElement.innerHTML.includes('hjid'),
      () => typeof (window as any)._hjSettings !== 'undefined',
    ],
  },
  {
    id: 'intercom', name: 'Intercom', category: 'chat',
    checks: [
      () => typeof (window as any).Intercom === 'function',
      () => !!document.querySelector('script[src*="widget.intercom.io"]'),
      () => document.documentElement.innerHTML.includes('intercomSettings'),
    ],
  },
  {
    id: 'crisp', name: 'Crisp Chat', category: 'chat',
    checks: [
      () => typeof (window as any).$crisp !== 'undefined',
      () => !!document.querySelector('script[src*="client.crisp.chat"]'),
      () => document.documentElement.innerHTML.includes('CRISP_WEBSITE_ID'),
    ],
  },
  {
    id: 'klaviyo', name: 'Klaviyo', category: 'marketing',
    checks: [
      () => typeof (window as any).klaviyo !== 'undefined',
      () => !!document.querySelector('script[src*="static.klaviyo.com"]'),
      () => document.documentElement.innerHTML.includes('klaviyo'),
    ],
  },
  {
    id: 'pinterest-tag', name: 'Pinterest Tag', category: 'marketing',
    checks: [
      () => typeof (window as any).pintrk === 'function',
      () => document.documentElement.innerHTML.includes("pintrk('load'"),
    ],
  },
  {
    id: 'snapchat-pixel', name: 'Snapchat Pixel', category: 'marketing',
    checks: [
      () => typeof (window as any).snaptr === 'function',
      () => document.documentElement.innerHTML.includes('snapchat'),
    ],
  },
];

export function detectTechStack(): TechStack {
  const items: TechItem[] = [];
  const now = new Date().toISOString();
  for (const sig of techSignatures) {
    let hits = 0;
    for (const check of sig.checks) { try { if (check()) hits++; } catch (_) {} }
    items.push({ id: sig.id, name: sig.name, category: sig.category, detected: hits > 0, confidence: Math.min(100, Math.round((hits / sig.checks.length) * 100)) });
  }
  return { items, detectedAt: now };
}
