# DATA.md — Data Queries & Caching
- `GET /v1/costliving`: Server Route Handler (`next: { revalidate: 86400 }`), protects `x-api-key` and caches CPI metrics for 24h.
- `GET /api/daily-match`: Server Route Handler, rotates suggested affordable place every 24h epoch.
- `GET /api/calculations`: Client fetch on `/dashboard`, dynamic per user session.