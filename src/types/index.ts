// ─── Platform Detection ────────────────────────────────────────────────────

export type Platform =
  | 'shopify'
  | 'tiendanube'
  | 'woocommerce'
  | 'magento'
  | 'prestashop'
  | 'vtex'
  | 'bigcommerce'
  | 'unknown';

export interface PlatformInfo {
  platform: Platform;
  confidence: number;
  indicators: string[];
  version?: string;
}

// ─── Technology Stack ──────────────────────────────────────────────────────

export type TechCategory = 'analytics' | 'marketing' | 'heatmap' | 'tagmanager' | 'chat' | 'review' | 'payment';

export interface TechItem {
  id: string;
  name: string;
  category: TechCategory;
  detected: boolean;
  confidence: number;
  version?: string;
  details?: string;
}

export interface TechStack {
  items: TechItem[];
  detectedAt: string;
}

// ─── Blueprint ─────────────────────────────────────────────────────────────

export type BlueprintSectionType =
  | 'header' | 'hero' | 'benefits' | 'reviews' | 'faq' | 'footer'
  | 'trust_badges' | 'newsletter' | 'upsells' | 'product_gallery'
  | 'countdown_timer' | 'popup' | 'sticky_bar';

export interface BlueprintSection {
  type: BlueprintSectionType;
  label: string;
  detected: boolean;
  score: number;
  details: string[];
  position?: number;
  notes?: string;
}

export interface StoreBlueprint {
  sections: BlueprintSection[];
  overallScore: number;
  strengths: string[];
  opportunities: string[];
  generatedAt: string;
}

// ─── Product ───────────────────────────────────────────────────────────────

export interface ProductVariant {
  name: string;
  values: string[];
}

export interface ProductReview {
  rating: number;
  count: number;
  summary?: string;
}

export interface ProductInfo {
  id?: string;
  name: string;
  price: string;
  originalPrice?: string;
  currency?: string;
  discount?: string;
  variants: ProductVariant[];
  images: string[];
  description: string;
  reviewsSummary?: ProductReview;
  sku?: string;
  availability?: string;
  brand?: string;
  category?: string;
  url: string;
  extractedAt: string;
}

// ─── Store (Saved) ─────────────────────────────────────────────────────────

export interface SavedStore {
  id: string;
  url: string;
  domain: string;
  name: string;
  favicon?: string;
  platform: PlatformInfo;
  techStack: TechStack;
  blueprint?: StoreBlueprint;
  products: ProductInfo[];
  tags: string[];
  category?: string;
  notes: string;
  savedAt: string;
  updatedAt: string;
  analysisCount: number;
}

// ─── Messages ──────────────────────────────────────────────────────────────

export type MessageType = 'SCAN_STORE' | 'SCAN_RESULT' | 'ANALYZE_PRODUCT' | 'PRODUCT_RESULT' | 'GET_BLUEPRINT' | 'BLUEPRINT_RESULT' | 'ERROR';

export interface ChromeMessage {
  type: MessageType;
  payload?: unknown;
  error?: string;
  tabId?: number;
}

export interface ScanResult {
  url: string;
  platform: PlatformInfo;
  techStack: TechStack;
  blueprint: StoreBlueprint;
  product?: ProductInfo;
}

// ─── App State ─────────────────────────────────────────────────────────────

export type TabId = 'scanner' | 'blueprint' | 'product' | 'database' | 'export';

export interface AppState {
  activeTab: TabId;
  currentUrl: string;
  isScanning: boolean;
  scanResult: ScanResult | null;
  stores: SavedStore[];
  toasts: Toast[];
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export type ExportFormat = 'json' | 'csv';

export interface ExportOptions {
  format: ExportFormat;
  includeStores: boolean;
  includeProducts: boolean;
  includeBlueprints: boolean;
  storesToExport?: string[];
}
