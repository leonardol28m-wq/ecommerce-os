import { detectPlatform } from './detectors/platform.detector';
import { detectTechStack } from './detectors/technology.detector';
import { detectBlueprint } from './detectors/blueprint.detector';
import { detectProduct } from './detectors/product.detector';
import type { ScanResult } from '@/types';

function runDetection(): void {
  try {
    const platform = detectPlatform();
    const techStack = detectTechStack();
    const blueprint = detectBlueprint();
    const product = detectProduct();
    const result: ScanResult = { url: window.location.href, platform, techStack, blueprint, product };
    (window as any).__ECOMMERCE_OS_DATA__ = result;
  } catch (err) {
    console.error('[EcommerceOS] Detection error:', err);
    (window as any).__ECOMMERCE_OS_DATA__ = null;
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SCAN_STORE') {
    runDetection();
    const data = (window as any).__ECOMMERCE_OS_DATA__;
    sendResponse({ type: 'SCAN_RESULT', payload: data });
    return true;
  }
  if (message.type === 'ANALYZE_PRODUCT') {
    const product = detectProduct();
    sendResponse({ type: 'PRODUCT_RESULT', payload: product });
    return true;
  }
});

if (document.readyState === 'complete') {
  runDetection();
} else {
  window.addEventListener('load', runDetection);
}

export {};
