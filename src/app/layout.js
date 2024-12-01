import ReactGA from "react-ga4";

const TRACKING_ID = "G-ZYK38288LH";
ReactGA.initialize(TRACKING_ID);

export const metadata = {
  title: "حدائق الجنة",
  description: "Reviving the Ummah via sacred Islamic knowledge.",
  author: "OYOUSAF,OYOUSAF87,OMAR YOUSAF,oyousaf_",
  keywords:
    "Islam, Islamic knowledge, Quran, Hadith, Islamic teachings, Deen, sacred knowledge, Islamic faith, learn Islam, Islamic scholars, Islamic history, Quranic studies, Arabic language, Islamic teachings online, Islamic education, spiritual growth, Islamic community, worldwide Islamic knowledge, Islam for beginners, understanding Islam",
  openGraph: {
    title: "حدائق الجنة",
    description: "Reviving the Ummah via sacred Islamic knowledge.",
    type: "website",
  },
  twitter: {
    card: "summary",
    creator: "OYOUSAF,OYOUSAF87,OMAR YOUSAF,oyousaf_",
    title: "حدائق الجنة",
    description: "Reviving the Ummah via sacred Islamic knowledge.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb">
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content={metadata.description} />
        <meta name="author" content={metadata.author} />
        <meta name="title" content={metadata.title} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:creator" content={metadata.twitter.creator} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
