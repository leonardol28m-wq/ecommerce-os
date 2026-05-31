import type { ChromeMessage, ScanResult } from '@/types';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') console.log('[EcommerceOS] Extension installed');
});

chrome.runtime.onMessage.addListener((message: ChromeMessage, _sender, sendResponse) => {
  if (message.type === 'SCAN_STORE') {
    handleScanStore(message.tabId).then(sendResponse).catch((err) => {
      sendResponse({ type: 'ERROR', error: err.message });
    });
    return true;
  }
  return false;
});

async function handleScanStore(tabId?: number) {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const targetTab = tabId ? await chrome.tabs.get(tabId) : tabs[0];
    if (!targetTab?.id) return { type: 'ERROR', error: 'No active tab found' };
    const results = await chrome.scripting.executeScript({
      target: { tabId: targetTab.id },
      func: () => (window as any).__ECOMMERCE_OS_DATA__ ?? null,
    });
    const data = results[0]?.result as ScanResult | null;
    if (data) return { type: 'SCAN_RESULT', payload: data };
    return { type: 'ERROR', error: 'Could not extract data from page' };
  } catch (err) {
    return { type: 'ERROR', error: (err as Error).message };
  }
}

export {};
