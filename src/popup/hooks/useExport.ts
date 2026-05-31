import { useCallback } from 'react';
import { useAppStore } from '../store/useStore';
import { exportAllData } from '@/db/database';
import { handleExport } from '@/utils/export';
import type { ExportOptions } from '@/types';

export function useExport() {
  const { addToast } = useAppStore();
  const exportData = useCallback(async (options: ExportOptions) => {
    try {
      const { stores, products } = await exportAllData();
      handleExport(options, stores, products);
      addToast({ type: 'success', message: `Exported as ${options.format.toUpperCase()}` });
    } catch (err) {
      addToast({ type: 'error', message: `Export failed: ${(err as Error).message}` });
    }
  }, [addToast]);
  return { exportData };
}
