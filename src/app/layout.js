import { Oleo_Script } from "next/font/google";
import GA from "./components/GA";
import "./styles/globals.css";
import { Analytics } from "@vercel/analytics/next";

// Google Font
const oleo = Oleo_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Static site description
const description =
  "Discover the beauty of Islam with resources on Quran, Hadith, spiritual growth, and authentic Islamic education.";

// JSON-LD structured data
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

// Metadata for SEO & socials
export const metadata = {
  metadataBase: new URL("https://oyousaf.uk"),
  title: "حدائق الجنة – Sacred Islamic Knowledge",
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
    title: "حدائق الجنة – Sacred Islamic Knowledge",
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
    title: "حدائق الجنة – Sacred Islamic Knowledge",
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

// Viewport settings for responsive layout
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9d8770",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-GB"
      dir="ltr"
      suppressHydrationWarning
      className={oleo.className}
    >
      <head>
        {/* SEO structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <meta name="description" content={description} />
      </head>
      <body className="bg-background text-white antialiased scroll-smooth">
        <GA />
        <Analytics />
        <main>
          {/* Hidden H1 to reinforce title for Google */}
          <h1 className="sr-only">حدائق الجنة – Sacred Islamic Knowledge</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
