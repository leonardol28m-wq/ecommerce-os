import { create } from 'zustand';
import type { AppState, TabId, ScanResult, SavedStore, Toast } from '@/types';
import { generateId } from '@/utils/helpers';

interface AppActions {
  setActiveTab: (tab: TabId) => void;
  setCurrentUrl: (url: string) => void;
  setScanning: (scanning: boolean) => void;
  setScanResult: (result: ScanResult | null) => void;
  setStores: (stores: SavedStore[]) => void;
  addStore: (store: SavedStore) => void;
  updateStore: (id: string, updates: Partial<SavedStore>) => void;
  removeStore: (id: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  activeTab: 'scanner', currentUrl: '', isScanning: false, scanResult: null, stores: [], toasts: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentUrl: (url) => set({ currentUrl: url }),
  setScanning: (isScanning) => set({ isScanning }),
  setScanResult: (scanResult) => set({ scanResult }),
  setStores: (stores) => set({ stores }),
  addStore: (store) => set((s) => ({ stores: [store, ...s.stores] })),
  updateStore: (id, updates) => set((s) => ({ stores: s.stores.map((store) => store.id === id ? { ...store, ...updates, updatedAt: new Date().toISOString() } : store) })),
  removeStore: (id) => set((s) => ({ stores: s.stores.filter((store) => store.id !== id) })),
  addToast: (toast) => {
    const id = generateId();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), toast.duration ?? 3000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
