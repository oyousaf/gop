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
    "Quran and Sunnah",
    "Hadith and Tafsir",
    "Islamic spirituality",
    "Fiqh and Seerah",
    "Learn Islam online",
    "Daily Quran reflection",
    "Islamic education",
    "Revive the Ummah",
    "Muslim lifestyle",
    "Tazkiyah and Tawheed",
    "Sacred Islamic teachings",
    "Islamic unity and values",
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
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://oyousaf.uk",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#9d8770",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb" dir="ltr">
      <head />
      <body>
        <GA />
        {children}
      </body>
    </html>
  );
}
