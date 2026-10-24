import {
  Geist,
  Instrument_Serif,
  Amiri,
  Noto_Naskh_Arabic,
} from "next/font/google";
import "./styles/globals.css";
import RevealObserver from "./components/RevealObserver";
import ServiceWorker from "./components/ServiceWorker";
import { Analytics } from "@vercel/analytics/next";

// Google Fonts: Geist (UI/body), Instrument Serif (display),
// Amiri (Arabic display), Noto Naskh Arabic (Arabic body)
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: "variable",
  display: "swap",
  variable: "--font-noto-naskh",
});

// Metadata for SEO & socials (see lib/seo.js)
export { metadata } from "./lib/seo";

// Viewport settings for responsive layout
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e9" },
    { media: "(prefers-color-scheme: dark)", color: "#221a14" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-GB"
      dir="ltr"
      suppressHydrationWarning
      className={`${geist.variable} ${instrumentSerif.variable} ${amiri.variable} ${notoNaskhArabic.variable}`}
    >
      <head>
        {/* Flags JS before first paint so reveal animations start hidden, not flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Analytics />
        <RevealObserver />
        <ServiceWorker />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
