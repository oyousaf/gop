import GA from "./components/GA";

export const metadata = {
  title: "حدائق الجنة",
  description:
    "Reviving the Ummah through sacred Islamic knowledge.",
  author: "OYOUSAF, OYOUSAF87, OMAR YOUSAF, oyousaf_",
  keywords:
    "Islamic knowledge, Quran, Hadith, Tafsir, Fiqh, Seerah, Deen, sacred knowledge, Islamic faith, learn Islam, Islamic teachings, Islamic scholars, Islamic history, Quranic studies, Arabic language, Islamic online courses, Islamic education, spiritual growth, Islamic spirituality, Islamic community, global Ummah, Islamic values, Islamic guidance, Islamic heritage, Islamic philosophy, Muslim lifestyle, Islamic parenting, Islamic beliefs, Islamic culture, Quran memorization, Islamic sermons, Islamic books, Islamic wisdom, Islamic resources, understanding Islam, Islamic lectures, Islam for beginners, Islamic jurisprudence, Islamic ethics, Islamic devotion, Islamic learning, Islam worldwide, Islamic practices, Islamic reminders, Islamic motivation, Sunnah, Zakah, Salah, Hajj, Umrah, Ramadan, Islamic unity, Islamic knowledge seekers, worldwide Islamic education, Quran and Sunnah, Islamic teachings online.",
  openGraph: {
    title: "حدائق الجنة",
    description:
      "Discover the beauty of Islam with resources on Quranic teachings, Hadith, spiritual growth, and Islamic education.",
    type: "website",
  },
  twitter: {
    card: "summary",
    creator: "OYOUSAF, OYOUSAF87, OMAR YOUSAF, oyousaf_",
    title: "حدائق الجنة",
    description:
      "Reviving the Ummah through sacred Islamic knowledge.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb">
      <body>
        <GA />
        {children}
      </body>
    </html>
  );
}
