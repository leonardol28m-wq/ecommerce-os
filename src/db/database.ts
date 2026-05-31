import { openDB, type IDBPDatabase } from 'idb';
import type { SavedStore, ProductInfo } from '@/types';

const DB_NAME = 'EcommerceOS';
const DB_VERSION = 1;

interface EcommerceOSDB {
  stores: {
    key: string;
    value: SavedStore;
    indexes: { 'by-domain': string; 'by-platform': string; 'by-savedAt': string; 'by-category': string; };
  };
  products: {
    key: string;
    value: ProductInfo & { storeId: string };
    indexes: { 'by-storeId': string; 'by-extractedAt': string; };
  };
}

let dbInstance: IDBPDatabase<EcommerceOSDB> | null = null;

async function getDB(): Promise<IDBPDatabase<EcommerceOSDB>> {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB<EcommerceOSDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('stores')) {
        const storeStore = db.createObjectStore('stores', { keyPath: 'id' });
        storeStore.createIndex('by-domain', 'domain', { unique: false });
        storeStore.createIndex('by-platform', 'platform.platform', { unique: false });
        storeStore.createIndex('by-savedAt', 'savedAt', { unique: false });
        storeStore.createIndex('by-category', 'category', { unique: false });
      }
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' });
        productStore.createIndex('by-storeId', 'storeId', { unique: false });
        productStore.createIndex('by-extractedAt', 'extractedAt', { unique: false });
      }
    },
  });
  return dbInstance;
}

export async function getAllStores(): Promise<SavedStore[]> {
  const db = await getDB();
  const stores = await db.getAll('stores');
  return stores.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
}

export async function getStoreById(id: string): Promise<SavedStore | undefined> {
  const db = await getDB();
  return db.get('stores', id);
}

export async function getStoreByDomain(domain: string): Promise<SavedStore | undefined> {
  const db = await getDB();
  return db.getFromIndex('stores', 'by-domain', domain);
}

export async function saveStore(store: SavedStore): Promise<string> {
  const db = await getDB();
  await db.put('stores', store);
  return store.id;
}

export async function updateStore(id: string, updates: Partial<SavedStore>): Promise<void> {
  const db = await getDB();
  const existing = await db.get('stores', id);
  if (!existing) throw new Error(`Store ${id} not found`);
  await db.put('stores', { ...existing, ...updates, updatedAt: new Date().toISOString() });
}

export async function deleteStore(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('stores', id);
  const allProducts = await db.getAllFromIndex('products', 'by-storeId', id);
  const tx = db.transaction('products', 'readwrite');
  await Promise.all(allProducts.map((p) => tx.store.delete(p.id ?? '')));
  await tx.done;
}

export async function searchStores(query: string): Promise<SavedStore[]> {
  const all = await getAllStores();
  const q = query.toLowerCase();
  return all.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.domain.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      (s.category?.toLowerCase().includes(q) ?? false),
  );
}

export async function getAllProducts(): Promise<(ProductInfo & { storeId: string })[]> {
  const db = await getDB();
  return db.getAll('products');
}

export async function getProductsByStore(storeId: string): Promise<ProductInfo[]> {
  const db = await getDB();
  return db.getAllFromIndex('products', 'by-storeId', storeId);
}

export async function saveProduct(product: ProductInfo & { storeId: string }): Promise<void> {
  const db = await getDB();
  await db.put('products', product);
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('products', id);
}

export async function getStats() {
  const [stores, products] = await Promise.all([getAllStores(), getAllProducts()]);
  const platformBreakdown: Record<string, number> = {};
  const categoryBreakdown: Record<string, number> = {};
  for (const store of stores) {
    const p = store.platform.platform;
    platformBreakdown[p] = (platformBreakdown[p] ?? 0) + 1;
    const c = store.category ?? 'Uncategorized';
    categoryBreakdown[c] = (categoryBreakdown[c] ?? 0) + 1;
  }
  return { totalStores: stores.length, totalProducts: products.length, platformBreakdown, categoryBreakdown };
}

export async function exportAllData() {
  const [stores, products] = await Promise.all([getAllStores(), getAllProducts()]);
  return { stores, products };
}
