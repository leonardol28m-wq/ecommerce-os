import { useCallback } from 'react';
import { useAppStore } from '../store/useStore';
import type { ScanResult } from '@/types';
import { createStoreFromScan, extractDomain } from '@/utils/helpers';
import { saveStore, getStoreByDomain, updateStore } from '@/db/database';

export function useScanner() {
  const {
    isScanning, setScanning, setScanResult, setCurrentUrl,
    addToast, addStore, updateStore: updateStoreInMemory,
  } = useAppStore();

  const scanCurrentTab = useCallback(async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id || !tab.url) {
        addToast({ type: 'error', message: 'No active tab found' });
        return null;
      }
      setCurrentUrl(tab.url);

      const response = await chrome.tabs.sendMessage(tab.id, { type: 'SCAN_STORE' });

      if (response?.type === 'SCAN_RESULT' && response.payload) {
        const result = response.payload as ScanResult;
        setScanResult(result);
        addToast({ type: 'success', message: 'Store scanned successfully' });
        return result;
      }

      addToast({ type: 'warning', message: 'Limited data — reload the page and try again' });
    } catch (err) {
      addToast({ type: 'error', message: `Scan error: ${(err as Error).message}` });
    } finally {
      setScanning(false);
    }
    return null;
  }, [setScanning, setScanResult, setCurrentUrl, addToast]);

  const saveCurrentScan = useCallback(async (result: ScanResult) => {
    try {
      const domain = extractDomain(result.url);
      const existing = await getStoreByDomain(domain);

      if (existing) {
        const updated = {
          ...existing,
          platform: result.platform,
          techStack: result.techStack,
          blueprint: result.blueprint,
          updatedAt: new Date().toISOString(),
          analysisCount: existing.analysisCount + 1,
        };
        await updateStore(existing.id, updated);
        updateStoreInMemory(existing.id, updated);
        addToast({ type: 'success', message: 'Store updated in database' });
        return existing.id;
      }

      const store = createStoreFromScan(result);
      await saveStore(store);
      addStore(store);
      addToast({ type: 'success', message: 'Store saved to database' });
      return store.id;
    } catch (err) {
      addToast({ type: 'error', message: `Save failed: ${(err as Error).message}` });
      return null;
    }
  }, [addStore, updateStoreInMemory, addToast]);

  return { isScanning, scanCurrentTab, saveCurrentScan };
}
