# Changelog

All notable changes to **Ecommerce OS** are documented here.

---

## [1.0.0] — 2024-01-01

### 🎉 Initial Release

#### Added
- **Store Scanner** — Detects Shopify, Tiendanube, WooCommerce, Magento, PrestaShop, VTEX, BigCommerce
- **Technology Detector** — 12+ tracking/marketing tools (GA4, Meta Pixel, TikTok, GTM, Hotjar, Clarity, Klaviyo)
- **Blueprint Generator** — 13 page sections analysis with quality scoring
- **Product Analyzer** — Extracts product data via structured JSON-LD, Shopify API, and DOM parsing
- **Competitor Database** — IndexedDB-powered local storage with CRUD, tags, categories, notes
- **Export System** — JSON and CSV export
- **Premium UI** — Dark theme, glassmorphism, smooth animations
- **Toast System** — Real-time feedback
- **Zustand Store** — Global state management
- **Chrome MV3** — Service Worker + Content Scripts

#### Technical
- Vite 5, React 18, TypeScript 5.4, TailwindCSS 3.4
- IndexedDB with `idb` library
- Modular detector architecture
- Message passing: popup ↔ content script ↔ service worker

---

## Upcoming [1.1.0]
- [ ] Price tracking history charts
- [ ] AI-powered recommendations
- [ ] Bulk store scanning
- [ ] Chrome Storage Sync (team sharing)
- [ ] Shopify theme detector
- [ ] MercadoLibre analyzer (Argentina)
