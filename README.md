# Saleor Meilisearch Integration App

A high-performance bridge designed to sync **Saleor GraphQL** data into **Meilisearch** for lightning-fast, millisecond-latency storefront search.

---

## 🚀 Overview

This application automates the indexing process between Saleor and Meilisearch, ensuring your product discovery experience is optimized for speed and relevancy. It is built to handle complex e-commerce data structures while maintaining a simplified schema for the frontend.

### Current Capabilities
* **Channel-Based Indexing:** Automatically segments data by Saleor Channels.
* **Product Sync:** Full indexing of product variants, attributes, and pricing.
* **Category Mapping:** Maintains hierarchical category structures within the search index.
* **Modern Architecture:** Leverages the latest Next.js and React features for efficient data processing.

---

## 🛠 Tech Stack

| Tool | Version | Role |
| :--- | :--- | :--- |
| **Next.js** | `15.5.9` | Application Framework |
| **React** | `18.3.1` | UI Library |
| **Meilisearch** | `0.54.0` | Search Engine |
| **Saleor** | Latest | Headless E-commerce GraphQL API |

---

## 📋 Roadmap (Upcoming)

- [ ] **Webhook Integration:** Real-time index updates when products are created, updated, or deleted in Saleor.
- [ ] **Smart Filtering:** Automated configuration of `filterableAttributes` and `sortableAttributes`.
- [ ] **Metadata Support:** Syncing custom Saleor metadata for advanced search logic.

---

## ⚙️ Getting Started

### 1. Installation
```bash
git clone https://github.com/karthik1915/saleor-meilisearch-app.git
cd saleor-meilisearch-app
npm install
```

### 2. Docker Container

```bash
docker compose up
```

### 3. Environment Variables

```env
# MeiliSearch 
MEILI_HOST=
MEILI_MASTER_KEY=

# Saleor
SALEOR_API_URL=
APP_API_BASE_URL=
APP_IFRAME_BASE_URL=

# Incase of using UPSTASH for storing auth data
# if not provided, it would use default FTL as APL
APL=upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```