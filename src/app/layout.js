import GA from "./components/GA";
import "./styles/globals.css";

const description =
  "Discover the beauty of Islam with resources on Quranic teachings, Hadith, spiritual growth, and Islamic education.";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "حدائق الجنة",
  url: "https://oyousaf.uk",
  logo: "https://oyousaf.uk/apple-touch-icon.png",
  sameAs: ["https://x.com/oyousaf_", "https://oyousaf.uk"],
  description,
  founder: {
    "@type": "Person",
    name: "oyousaf",
    url: "https://oyousaf.uk",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
  },
};

export const metadata = {
  metadataBase: new URL("https://oyousaf.uk"),
  title: {
    default:
      "حدائق الجنة – Reviving the Ummah through Sacred Islamic Knowledge",
    template: "%s | حدائق الجنة",
  },
  description,
  applicationName: "حدائق الجنة",
  authors: [{ name: "oyousaf", url: "https://oyousaf.uk" }],
  category: "Religion & Spirituality",
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
    "Authentic Hadith",
    "Masjid al-Aqsa",
    "Sacred knowledge",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://oyousaf.uk",
    siteName: "حدائق الجنة",
    title: "حدائق الجنة – Reviving the Ummah through Sacred Islamic Knowledge",
    description,
    images: [
      {
        url: "https://oyousaf.uk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "حدائق الجنة – Sacred Islamic Knowledge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@oyousaf_",
    site: "@oyousaf_",
    title: "حدائق الجنة",
    description,
    images: ["https://oyousaf.uk/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  alternates: {
    canonical: "https://oyousaf.uk",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9d8770",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts to improve LCP */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oleo+Script:wght@400;700&display=swap"
        />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Fallback meta description */}
        <meta name="description" content={description} />
      </head>
      <body className="bg-background text-white antialiased scroll-smooth">
        <GA />
        <main>
          <p className="sr-only">{description}</p>
          {children}
        </main>
      </body>
    </html>
  );
}
