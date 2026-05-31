import { useCallback, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { getAllStores, deleteStore as dbDeleteStore, updateStore as dbUpdateStore } from '@/db/database';

export function useDatabase() {
  const { stores, setStores, addToast, removeStore, updateStore } = useAppStore();

  const loadStores = useCallback(async () => {
    try { setStores(await getAllStores()); } catch (err) { addToast({ type: 'error', message: `Failed to load stores: ${(err as Error).message}` }); }
  }, [setStores, addToast]);

  const deleteStore = useCallback(async (id: string) => {
    try { await dbDeleteStore(id); removeStore(id); addToast({ type: 'success', message: 'Store deleted' }); }
    catch (err) { addToast({ type: 'error', message: `Delete failed: ${(err as Error).message}` }); }
  }, [removeStore, addToast]);

  const updateStoreNotes = useCallback(async (id: string, notes: string) => {
    try { await dbUpdateStore(id, { notes }); updateStore(id, { notes }); }
    catch (err) { addToast({ type: 'error', message: `Update failed: ${(err as Error).message}` }); }
  }, [updateStore, addToast]);

  const updateStoreTags = useCallback(async (id: string, tags: string[]) => {
    try { await dbUpdateStore(id, { tags }); updateStore(id, { tags }); }
    catch (err) { addToast({ type: 'error', message: `Update failed: ${(err as Error).message}` }); }
  }, [updateStore, addToast]);

  const updateStoreCategory = useCallback(async (id: string, category: string) => {
    try { await dbUpdateStore(id, { category }); updateStore(id, { category }); }
    catch (err) { addToast({ type: 'error', message: `Update failed: ${(err as Error).message}` }); }
  }, [updateStore, addToast]);

  useEffect(() => { loadStores(); }, [loadStores]);

  return { stores, loadStores, deleteStore, updateStoreNotes, updateStoreTags, updateStoreCategory };
}
