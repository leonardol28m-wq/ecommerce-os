# 🛒 Ecommerce OS

> **Premium competitive intelligence system for e-commerce stores**  
> Built with Chrome Extension MV3 · TypeScript · React · TailwindCSS · IndexedDB

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![MV3](https://img.shields.io/badge/Manifest-V3-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-purple?style=flat-square)

---

## ✨ Features

| Module | Description |
|---|---|
| **Store Scanner** | Detects platform (Shopify, Tiendanube, WooCommerce, Magento, PrestaShop, VTEX, BigCommerce) with confidence score |
| **Technology Detector** | Identifies GA4, Meta Pixel, TikTok Pixel, GTM, Clarity, Hotjar, Klaviyo and more |
| **Blueprint Generator** | Analyzes page structure: Hero, Header, Reviews, FAQ, Trust Badges, Newsletter, Upsells + scores each section |
| **Product Analyzer** | Extracts name, price, variants, images, description, reviews from any product page |
| **Competitor Database** | Saves stores locally with IndexedDB, supports tags, categories and notes |
| **Export** | Export all data as JSON or CSV |

---

## 🎨 Design

- **Dark premium theme** inspired by Apple/iOS
- **Glassmorphism** — backdrop blur, semi-transparent surfaces
- **Rounded corners** — xl, 2xl, 3xl everywhere
- **Smooth animations** — fade-in, slide-up, pulse
- **Color palette** — Electric blue (#3B82F6), Purple (#8B5CF6), Emerald (#10B981)
- **Typography** — SF Pro / Inter, clean hierarchy

---

## 🏗️ Architecture

```
ecommerce-os/
├── public/
│   ├── manifest.json          # Chrome MV3 manifest
│   └── icons/                 # Extension icons (16/32/48/128px)
├── src/
│   ├── types/
│   │   └── index.ts           # Shared TypeScript types
│   ├── db/
│   │   └── database.ts        # IndexedDB operations (idb library)
│   ├── background/
│   │   └── service-worker.ts  # MV3 Service Worker
│   ├── content/
│   │   ├── index.ts           # Content script entry
│   │   └── detectors/
│   │       ├── platform.detector.ts    # Platform detection
│   │       ├── technology.detector.ts  # Tech stack detection
│   │       ├── blueprint.detector.ts   # Page blueprint analysis
│   │       └── product.detector.ts     # Product data extraction
│   ├── utils/
│   │   ├── export.ts          # JSON/CSV export utilities
│   │   └── helpers.ts         # Shared helpers
│   └── popup/
│       ├── index.html         # Popup entry HTML
│       ├── index.tsx          # React root
│       ├── index.css          # TailwindCSS + custom layers
│       ├── App.tsx            # Root component + routing
│       ├── store/
│       │   └── useStore.ts    # Zustand global state
│       ├── hooks/
│       │   ├── useScanner.ts  # Scan orchestration
│       │   ├── useDatabase.ts # DB CRUD operations
│       │   └── useExport.ts   # Export trigger
│       └── components/
│           ├── layout/        # Header, Navigation
│           ├── ui/            # Button, Badge, Card, Spinner, Toast
│           ├── scanner/       # StoreScannerTab, PlatformBadge, TechStack
│           ├── blueprint/     # BlueprintTab
│           ├── product/       # ProductAnalyzerTab
│           ├── database/      # DatabaseTab (store cards)
│           └── export/        # ExportTab
```

---

## 🔄 Data Flow

```
User opens extension
       │
       ▼
Popup requests tab info
       │
       ▼
User clicks "Scan"
       │
       ▼
Message → Content Script
       │
       ├── platform.detector.ts  → PlatformInfo
       ├── technology.detector.ts → TechStack
       ├── blueprint.detector.ts  → StoreBlueprint
       └── product.detector.ts    → ProductInfo
       │
       ▼
ScanResult returned to popup
       │
       ├── Display in Scanner tab
       ├── Display in Blueprint tab
       └── Display in Product tab
              │
              ▼
       User saves → IndexedDB
              │
              ▼
       Database tab (CRUD)
              │
              ▼
       Export tab (JSON/CSV)
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or pnpm
- Google Chrome or Chromium

### Development

```bash
# 1. Clone the repo
git clone https://github.com/leonardol28m-wq/ecommerce-os.git
cd ecommerce-os

# 2. Install dependencies
npm install

# 3. Build (watch mode)
npm run dev

# 4. Load in Chrome
# → chrome://extensions
# → Enable Developer Mode
# → Load unpacked → select /dist folder
```

### Production Build

```bash
npm run build
# Output: /dist folder — ready to load or zip for Chrome Web Store
```

---

## 🧠 Technical Decisions

| Decision | Rationale |
|---|---|
| **Vite** | Fastest bundler, native ESM, excellent Chrome extension support |
| **React 18** | Component model perfect for tab-based popup UI |
| **Zustand** | Lightweight state management, no boilerplate, perfect for extensions |
| **TailwindCSS** | Utility-first, no CSS-in-JS overhead, small bundle |
| **idb** | Typed IndexedDB wrapper, promise-based, excellent DX |
| **Content Scripts** | Direct DOM access for reliable detection without external API calls |
| **MV3 Service Worker** | Required for MV3, handles background tab communication |

---

## 🔒 Permissions

| Permission | Purpose |
|---|---|
| `storage` | Chrome Storage API (backup/sync) |
| `activeTab` | Access current tab URL |
| `scripting` | Execute content scripts programmatically |
| `tabs` | Query active tab info |
| `<all_urls>` | Analyze any e-commerce store |

---

## 📦 Supported Platforms

| Platform | Detection Method |
|---|---|
| Shopify | `window.Shopify`, CDN URLs, meta tags |
| Tiendanube | `window.LS`, CDN patterns |
| WooCommerce | `wc_add_to_cart_params`, `.woocommerce` class |
| Magento | `window.Magento`, `[data-mage-init]` |
| PrestaShop | `window.prestashop`, `#_desktop_top_menu` |
| VTEX | `window.__RUNTIME__`, `window.vtex` |
| BigCommerce | `window.BCData`, `.bc-cart` |

---

## 🧪 Testing

```bash
npm run type-check  # TypeScript validation
npm run lint        # ESLint
```

---

## 📝 License

MIT © 2024 Ecommerce OS
