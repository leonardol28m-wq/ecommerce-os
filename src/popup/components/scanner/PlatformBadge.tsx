import React from 'react';
import type { Platform } from '@/types';
import { getPlatformColor, getPlatformLabel } from '@/utils/helpers';

const platformIcons: Record<Platform, string> = {
  shopify: 'S', tiendanube: 'TN', woocommerce: 'WC', magento: 'M',
  prestashop: 'PS', vtex: 'VX', bigcommerce: 'BC', unknown: '?',
};

export function PlatformBadge({ platform, confidence, large }: { platform: Platform; confidence: number; large?: boolean }) {
  const color = getPlatformColor(platform);
  const label = getPlatformLabel(platform);
  const icon = platformIcons[platform];

  if (large) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: `${color}22`, color, border: `2px solid ${color}44` }}>{icon}</div>
        <div>
          <p className="text-base font-bold text-text-primary">{label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="h-1.5 w-20 bg-bg-tertiary rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${confidence}%`, backgroundColor: color }} />
            </div>
            <span className="text-xs text-text-muted font-medium">{confidence}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border"
      style={{ backgroundColor: `${color}18`, color, borderColor: `${color}38` }}>
      <span className="text-[10px] font-bold">{icon}</span>
      {label}
      <span className="opacity-60">·{confidence}%</span>
    </span>
  );
}
