# 🌿 حدائق الجنة — Gardens of Paradise

A single-page Islamic knowledge and community site: live views of Makkah, Madinah and
Al-Aqsa, daily prayer times, a curated Hadith reader, Palestine-related news, and a
BDS boycott reference — built with a calm, intentional browsing experience in mind.

Live at [oyousaf.uk](https://oyousaf.uk).

---

## ✨ Highlights

- ▲ **Next.js 16** (App Router) with Turbopack for local dev
- 🎬 **Motion** for subtle, reduced-motion-aware animations
- 🕋 **Live Makkah / Madinah / Al-Aqsa streams** — YouTube primary, with a self-hosted
  HLS proxy (`hls.js`) as a quiet fallback
- 🕌 **Daily prayer times** with a live countdown to the next prayer
- 📖 **Hadith reader** sourced from local, curated JSON collections
  (Bukhari, Muslim, Tirmidhi, and others), matched to the current Hijri month
- 📰 **Palestine/Islam-focused news**, bilingual (English/Arabic), via NewsAPI
- ✊ **BDS boycott reference list**
- 🌙 **Hijri date handling** via the native `Intl` API (no external calendar library)
- 📈 **Analytics** via GA4 (`react-ga4`) and `@vercel/analytics`
- 🔍 **SEO-aware**: structured data, OpenGraph/Twitter cards, `next-sitemap`

## 🛠️ Development runtime

Node.js version is pinned via `.nvmrc`. Use `nvm use` (or equivalent) before installing.

```bash
npm install
npm run dev
```

---

## 🧩 Tech Stack

### Core

- ⚛️ **React 19**
- ▲ **Next.js 16**
- 💨 **Tailwind CSS v4**
- 🎬 **Motion**

### Media & Data

- 🎥 **hls.js** — HLS playback for the self-hosted stream fallback
- 📖 Local JSON Hadith collections (`data/hadith/`)
- 📰 NewsAPI (`NEWS_API_KEY`)
- 📺 YouTube Data API (`YOUTUBE_API_KEY`) — live stream lookup with multi-channel fallback
- 🕌 [Aladhan API](https://aladhan.com/prayer-times-api) — free, no key required — for daily prayer times

### Analytics & UX

- 📊 **Google Analytics 4** (`react-ga4`)
- ⚡ **@vercel/analytics**
- 🎨 **react-icons**

---

## 🔑 Environment variables

Set in `.env.local` (never committed):

- `NEWS_API_KEY` — used by `/api/news`
- `YOUTUBE_API_KEY` — used by `/api/youtube`
- `RAPIDAPI_KEY`, `HADITH_API_KEY` — currently unused by the codebase; safe to leave
  unset unless a future feature needs them

---

## 🧠 Focus Areas

- Calm, distraction-free, accessible UI (reduced-motion support, focus-visible states,
  skip link, semantic landmarks)
- Resilient live media: YouTube-first with a self-hosted HLS fallback, so a section
  never goes dark if one source is down
- SEO-first content delivery
- Faith-aware date and calendar handling

---

## 📌 Status

💚 **Actively maintained.**
