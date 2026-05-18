# Ezrafmonline — News Portal

A full-featured news portal website with a custom admin CMS, built with Next.js 16, TypeScript, Tailwind CSS v4, and Prisma 7.

## Features

### Public Site
- **Responsive Design** — Mobile-first layout with hamburger menu, scroll-aware sticky header with auto-hide
- **Live Date/Time** — Amber header bar with real-time clock and weather widget
- **Article Management** — Rich text editing (TipTap), image upload, categories, editor's picks
- **Search** — Full-text article search
- **Ad Placements** — Leaderboard, sidebar, and in-article ad slots (custom or AdSense)
- **SEO** — Per-page metadata, JSON-LD structured data, Open Graph / Twitter Cards, sitemap.xml, canonical URLs
- **PWA** — Service worker, manifest, installable on mobile/desktop
- **Analytics** — Built-in page view tracking with daily traffic dashboard
- **Social Links** — Facebook, Twitter/X, Instagram, YouTube, TikTok, WhatsApp
- **Weather** — Configurable OpenWeatherMap integration in header

### Admin Dashboard
- **Stats Overview** — Total articles, categories, users, ads, views with gradient progress bars
- **Traffic Analytics** — Daily view chart (14 days), most viewed articles, today's / weekly totals
- **Article Management** — Create, edit, delete articles with TipTap rich editor, image upload, categories, Editor's Pick toggle
- **Category Manager** — Add, edit, delete categories with gradient initials and article counts
- **User Management** — Create admin/editor accounts (ADMIN only)
- **Ad Manager** — Place ads by position (leaderboard, sidebar, article banner/sidebar); supports image, HTML code, or AdSense
- **Site Settings** — Weather API key/city, Meta Pixel ID, Google AdSense publisher ID
- **Role-Based Access** — Admin vs editor permissions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite (Prisma 7, switchable to PostgreSQL) |
| Auth | next-auth v5 beta (Credentials provider, JWT) |
| Editor | TipTap (ProseMirror wrapper) |
| Validation | Zod |
| Security | Rate limiting, HTML sanitization, magic byte upload verification |
| PWA | Custom service worker + manifest |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/agyirisakyi3-blip/ezrafmonline.git
cd ezrafmonline
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | `file:./dev.db` | SQLite path or PostgreSQL URL |
| `AUTH_SECRET` | ✅ | — | Run `openssl rand -hex 32` to generate |
| `AUTH_URL` | ✅ | — | Your domain (e.g. `https://ezrafmonline.com`) |
| `REVALIDATION_SECRET` | ✅ | — | Run `openssl rand -hex 32` to generate |
| `WEATHER_API_KEY` | ❌ | — | OpenWeatherMap API key |

### Setup Database & Seed

```bash
npx prisma db push
npm run seed
```

This creates the SQLite database and seeds it with:

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@newsportal.com | admin123 | ADMIN |
| Editor | jane@newsportal.com | test123456 | EDITOR |

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin panel is at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed/update database |

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public-facing pages
│   │   ├── page.tsx        # Homepage
│   │   ├── articles/       # Article list + detail pages
│   │   ├── categories/     # Category filter
│   │   ├── search/         # Search results
│   │   └── live/           # TV / Radio placeholder pages
│   ├── admin/
│   │   ├── login/          # Admin login (split-screen branded)
│   │   └── (dashboard)/    # Admin dashboard, articles, categories, users, ads
│   ├── api/                # API routes (articles, categories, auth, upload, weather, track-view, revalidate)
│   ├── layout.tsx          # Root layout (fonts, meta, AdSense, Meta Pixel)
│   ├── globals.css         # Tailwind + brand colors
│   └── sitemap.ts          # Dynamic sitemap generation
├── components/
│   ├── admin-sidebar.tsx   # Admin sidebar with active-link highlighting
│   ├── ads/                # Ad slot renderers, AdSense, Meta Pixel
│   ├── articles/           # Article cards, content renderer, form
│   ├── layout/             # Header (navbar), footer, date-time, mobile menu
│   └── ui/                 # TipTap editor, image lightbox, JSON-LD
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── auth.ts             # NextAuth v5 config
│   ├── queries.ts          # Cached DB queries (React cache)
│   ├── ads.ts              # Cached ad helpers
│   ├── security.ts         # Rate limiter, sanitizers, validators
│   ├── seo.ts              # Metadata + JSON-LD helpers
│   ├── api-utils.ts        # JSON response helpers
│   └── utils.ts            # Shared utilities
└── proxy.ts                # Middleware (admin route protection)
```

## Admin Panel

| Path | Description |
|------|-------------|
| `/admin` | Dashboard with stats + traffic analytics |
| `/admin/articles` | List all articles |
| `/admin/articles/new` | Create article (TipTap editor) |
| `/admin/articles/{id}/edit` | Edit article |
| `/admin/categories` | Manage categories |
| `/admin/users` | Manage users (ADMIN only) |
| `/admin/ads` | Ad placements + site settings (weather, Meta Pixel, AdSense) |

## Deployment

### Production Build

```bash
npm run build
npm start -- -p 3001
```

### Environment Variables (Production)

Set these on your hosting platform:

- `DATABASE_URL` — `file:./dev.db` (SQLite) or PostgreSQL URL
- `AUTH_SECRET` — Generate via `openssl rand -hex 32`
- `AUTH_URL` — Your production domain
- `REVALIDATION_SECRET` — Generate via `openssl rand -hex 32`
- `WEATHER_API_KEY` — Optional, for weather feature

### Process Management (recommended)

```bash
npm install -g pm2
pm2 start npm --name "ezrafmonline" -- start -- -p 3001
```

### Production Configurations

- **Security Headers** — HSTS (2yr), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy
- **Caching** — ISR: homepage 60s, articles/categories 120s, stale-while-revalidate
- **Rate Limiting** — All API endpoints rate-limited
- **Input Validation** — Zod schemas on all mutation endpoints

## License

MIT
