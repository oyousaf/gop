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
  "Explore Quran and Sunnah, authentic Hadith, Islamic spirituality, prayer times, live views of Makkah, Madinah and Al-Aqsa, and thoughtful resources for Muslims worldwide.";

// JSON-LD structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "حدائق الجنة",
  url: "https://oyousaf.uk",
  logo: "https://oyousaf.uk/apple-touch-icon.png",
  sameAs: ["https://x.com/oyousaf_", "https://www.youtube.com/@oyousaf_"],
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
  title: {
    default: "حدائق الجنة | Sacred Islamic Knowledge",
    template: "%s | حدائق الجنة",
  },
  description,
  applicationName: "حدائق الجنة",
  authors: [{ name: "oyousaf", url: "https://oyousaf.uk" }],
  category: "Religion & Spirituality",
  keywords: [
    "Islamic knowledge",
    "learn Islam online",
    "Quran and Sunnah",
    "authentic Hadith",
    "Hadith in English and Arabic",
    "Islamic spirituality",
    "tazkiyah and tawheed",
    "fiqh and seerah",
    "daily prayer times",
    "Makkah live stream",
    "Madinah live stream",
    "Al Aqsa live stream",
    "Masjid al Haram",
    "Masjid an Nabawi",
    "Palestine solidarity",
    "BDS boycott guide",
    "Islamic resources worldwide",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://oyousaf.uk",
    siteName: "حدائق الجنة",
    title: "حدائق الجنة | Sacred Islamic Knowledge",
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
    languages: {
      "en-GB": "https://oyousaf.uk",
      "x-default": "https://oyousaf.uk",
    },
  },
};

// Viewport settings for responsive layout
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8f7a68",
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
      </head>
      <body className="bg-background text-white antialiased scroll-smooth">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <GA />
        <Analytics />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
