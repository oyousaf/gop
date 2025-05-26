import GA from "./components/GA";

export const metadata = {
  metadataBase: new URL("https://oyousaf.uk"),
  title: "حدائق الجنة – Reviving the Ummah through Sacred Islamic Knowledge",
  description:
    "Discover the beauty of Islam with resources on Quranic teachings, Hadith, spiritual growth, and Islamic education.",
  authors: [
    { name: "oyousaf", url: "https://oyousaf.uk" },
    { name: "OYOUSAF" },
    { name: "OYOUSAF87" },
    { name: "oyousaf_" },
  ],
  keywords: [
    "Islamic knowledge",
    "Quran",
    "Hadith",
    "Tafsir",
    "Fiqh",
    "Seerah",
    "Ilm",
    "Deen",
    "Makkah",
    "Madinah",
    "Masjid Aqsa",
    "Sacred knowledge",
    "Islamic faith",
    "Learn Islam",
    "Learn islam from home",
    "Revive the Ummah",
    "Daily Quranic reflection",
    "Understanding Tawheed",
    "Islamic teachings",
    "Dawah resources",
    "Islamic scholars",
    "Islamic history",
    "Quranic studies",
    "Arabic language",
    "Islamic education",
    "spiritual growth",
    "Islamic spirituality",
    "Tazkiyah",
    "Islamic community",
    "global Ummah",
    "Islamic values",
    "Islamic heritage",
    "Islamic philosophy",
    "Muslim lifestyle",
    "Islamic parenting",
    "Islamic beliefs",
    "Islamic culture",
    "Quran memorisation",
    "Islamic sermons",
    "Islamic books",
    "Islamic wisdom",
    "Islamic resources",
    "Understanding Islam",
    "Islamic lectures",
    "Islam for beginners",
    "Islamic jurisprudence",
    "Islamic ethics",
    "Islamic devotion",
    "Islamic learning",
    "Islam worldwide",
    "Islamic reminders",
    "Islamic motivation",
    "Sunnah",
    "Zakah",
    "Salah",
    "Hajj",
    "Umrah",
    "Ramadan",
    "Ramadhan",
    "Islamic unity",
    "Quran and Sunnah",
    "Islamic teachings online",
  ],
  openGraph: {
    title: "حدائق الجنة",
    description:
      "Discover the beauty of Islam with resources on Quranic teachings, Hadith, spiritual growth, and Islamic education.",
    type: "website",
    url: "https://oyousaf.uk",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "حدائق الجنة – Sacred Islamic Knowledge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@oyousaf_",
    title: "حدائق الجنة",
    description: "Reviving the Ummah through sacred Islamic knowledge.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#9d8770",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb">
      <head />
      <body className="bg-white text-gray-900 antialiased">
        <GA />
        {children}
      </body>
    </html>
  );
}
