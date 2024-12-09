import GA from "./components/GA";

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
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb">
      <head>
      </head>
      <body>
        <GA />
        {children}
      </body>
    </html>
  );
}
