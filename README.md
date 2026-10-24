# 🌿 حدائق الجنة — Gardens of Paradise

A single-page Islamic knowledge and community site: salaah times for wherever you are,
live views from Makkah, Madinah and Al-Aqsa, a curated Hadith reader, Palestine-related
news, and a searchable BDS boycott reference — built with a calm, intentional browsing
experience in mind.

Live at [oyousaf.uk](https://oyousaf.uk).

---

## ✨ Highlights

- ▲ **Next.js 16** (App Router) — Server Components for the page shell, client islands
  only where interaction is needed, and ISR (15-minute refresh) for fresh content
- 🕌 **Salaah times for the visitor's location** — detected from saved choice, device
  location, IP (Vercel geo) or browser timezone, with a city search, calculation-method
  picker, 12/24h clock and a live countdown to the next prayer (shown in the navbar too)
- 🕋 **One Live section** for Makkah / Madinah / Al-Aqsa — YouTube primary, with a
  self-hosted HLS proxy (`hls.js`, loaded on demand) as a quiet fallback
- 📖 **Hadith reader** from the six canonical collections, matched to the current Hijri
  month, in English and Arabic, with native share
- 📰 **Palestine/Islam-focused news**, bilingual (English/Arabic), via NewsAPI
- ✊ **BDS boycott reference** with instant search and A–Z navigation
- 🌙 **Hijri dates** via the native `Intl` API using the Umm al-Qura calendar
- 🎨 **Light and dark themes** that follow the system, built on OKLCH design tokens
- 🎬 **CSS-only motion** — one shared easing curve, reveal-on-scroll, native `<dialog>`
  and popover transitions, all respecting reduced-motion
- 📲 **Installable PWA** — works offline (service worker caches the page, hadith, news
  and two months of prayer times), with opt-in prayer reminders
- 🔍 **SEO-first**: server-rendered content, JSON-LD structured data, OpenGraph/Twitter
  cards, native `sitemap.xml` / `robots.txt` / web manifest, and `llms.txt`

## 🛠️ Development runtime

Node.js version is pinned via `.nvmrc`. Use `nvm use` (or equivalent) before installing.

```bash
npm install
npm run dev
```

### Environment variables

| Variable          | Used for                                      |
| ----------------- | --------------------------------------------- |
| `NEWS_API_KEY`    | News section (NewsAPI)                        |
| `YOUTUBE_API_KEY` | Live stream lookup (YouTube Data API)         |

Prayer times need no key. Locally there is no IP geolocation, so the browser timezone and
device location are used instead.

---

## 🧩 Tech Stack

### Core

- ⚛️ **React 19**
- ▲ **Next.js 16**
- 💨 **Tailwind CSS v4**

### Typography

- **Instrument Serif** (display), **Geist** (UI/body)
- **Amiri** (Arabic display), **Noto Naskh Arabic** (Arabic body)

### Media & Data

- 🎥 **hls.js** — HLS playback for the self-hosted stream fallback
- 📖 Local JSON Hadith collections (`data/hadith/`)
- 📰 NewsAPI (`NEWS_API_KEY`)
- 📺 YouTube Data API (`YOUTUBE_API_KEY`) — live stream lookup with multi-channel fallback
- 🕌 [Aladhan API](https://aladhan.com/prayer-times-api) — free, no key required — for prayer times
- 🗺️ [OpenStreetMap Nominatim](https://nominatim.org/) — place names for device locations

### Analytics & UX

- ⚡ **@vercel/analytics** (cookieless)
- 🎨 **react-icons**

---

## 🗂️ Project structure

```
src/app/
├── page.js              # Single page: server shell + client islands
├── layout.js            # Fonts, viewport, global providers
├── sitemap.js · robots.js · manifest.js
├── components/          # Sections (PrayerTimes, LiveSection, Hadith, News, Divestment…)
├── lib/                 # Shared server logic: hadith, news, SEO config
├── api/                 # hadith · news · prayer-times · youtube · stream (HLS proxy)
├── styles/globals.css   # Design tokens, motion, base styles
└── utils/constants.js   # Navigation, socials, boycott list
```

---

## 🧠 Focus Areas

- Calm, distraction-free, accessible UI (reduced-motion support, focus-visible states,
  skip link, semantic landmarks, keyboard-friendly tabs and dialogs)
- Resilient live media: YouTube-first with a self-hosted HLS fallback, so a section
  never goes dark if one source is down
- Location-aware, privacy-conscious prayer times (coordinates rounded to ~1 km)
- SEO-first content delivery
- Faith-aware date and calendar handling

---

## 📌 Status

💚 **Actively maintained.**
