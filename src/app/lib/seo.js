/* Single source of truth for SEO: metadata, structured data, sitemap and
   manifest all read from here. */

export const SITE = {
  url: "https://oyousaf.uk",
  name: "حدائق الجنة",
  nameEn: "Gardens of Paradise",
  title: "حدائق الجنة · Prayer Times, Live Makkah & Madinah, Authentic Hadith",
  description:
    "Salaah times for your location, live streams from Makkah, Madinah and Al-Aqsa, authentic hadith in English and Arabic, Palestine news and a searchable boycott list.",
  ogImage: "/og-image.jpg",
  twitter: "@oyousaf_",
  sameAs: ["https://x.com/oyousaf_", "https://www.youtube.com/@oyousaf_"],
};

// Page sections, in reading order (used for sitelinks-style navigation data)
export const SECTIONS = [
  { id: "prayer-times", name: "Prayer times (Salaah)" },
  { id: "live", name: "Live from Makkah, Madinah and Al-Aqsa" },
  { id: "hadith", name: "Hadith of the month" },
  { id: "news", name: "Palestine and Muslim world news" },
  { id: "divestment", name: "BDS boycott list" },
];

const COLLECTION_NAMES = {
  bukhari: "Sahih al-Bukhari",
  muslim: "Sahih Muslim",
  tirmidhi: "Jami` at-Tirmidhi",
  nasai: "Sunan an-Nasa'i",
  ibnmajah: "Sunan Ibn Majah",
  abudawud: "Sunan Abi Dawud",
};

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "oyousaf", url: SITE.url }],
  creator: "oyousaf",
  category: "Religion & Spirituality",
  keywords: [
    "prayer times",
    "salah times near me",
    "namaz times",
    "Makkah live",
    "Madinah live",
    "Al Aqsa live",
    "Masjid al Haram live stream",
    "Masjid an Nabawi live stream",
    "authentic hadith",
    "hadith in English and Arabic",
    "Hijri date today",
    "Palestine news",
    "BDS boycott list",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    alternateLocale: ["ar_SA"],
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.nameEn}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: SITE.twitter,
    site: SITE.twitter,
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  formatDetection: { telephone: false, address: false },
};

export function buildStructuredData({ hadith = [] } = {}) {
  const website = `${SITE.url}/#website`;
  const org = `${SITE.url}/#organization`;
  const page = `${SITE.url}/#webpage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: SITE.name,
        alternateName: [SITE.nameEn, "Hadaiq al-Jannah"],
        url: SITE.url,
        logo: {
          "@type": "ImageObject",
          url: `${SITE.url}/apple-touch-icon.png`,
        },
        sameAs: SITE.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": website,
        url: SITE.url,
        name: SITE.name,
        alternateName: SITE.nameEn,
        description: SITE.description,
        inLanguage: ["en-GB", "ar"],
        publisher: { "@id": org },
      },
      {
        "@type": "WebPage",
        "@id": page,
        url: SITE.url,
        name: SITE.title,
        description: SITE.description,
        isPartOf: { "@id": website },
        about: [
          { "@type": "Thing", name: "Salah (Islamic prayer) times" },
          { "@type": "Place", name: "Masjid al-Haram, Makkah" },
          { "@type": "Place", name: "Masjid an-Nabawi, Madinah" },
          { "@type": "Place", name: "Masjid al-Aqsa, Jerusalem" },
          { "@type": "Thing", name: "Hadith" },
          { "@type": "Thing", name: "Boycott, Divestment and Sanctions (BDS)" },
        ],
        inLanguage: ["en-GB", "ar"],
        primaryImageOfPage: { "@type": "ImageObject", url: `${SITE.url}${SITE.ogImage}` },
        dateModified: new Date().toISOString(),
        hasPart: SECTIONS.map((s) => ({
          "@type": "WebPageElement",
          "@id": `${SITE.url}/#${s.id}`,
          name: s.name,
          url: `${SITE.url}/#${s.id}`,
        })),
        mainEntity: hadith.length
          ? {
              "@type": "ItemList",
              name: "Hadith of the month",
              itemListElement: hadith.slice(0, 5).map((h, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Quotation",
                  text: h.content.replace(/\s+/g, " ").trim().slice(0, 600),
                  inLanguage: "en",
                  ...(h.sources?.[0] && {
                    citation: COLLECTION_NAMES[h.sources[0]] || h.sources[0],
                  }),
                },
              })),
            }
          : undefined,
      },
    ],
  };
}
