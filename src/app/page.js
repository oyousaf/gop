import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Banner from "./components/Banner";
import PrayerProvider from "./components/PrayerProvider";
import PrayerTimes from "./components/PrayerTimes";
import LiveSection from "./components/LiveSection";
import Knowledge from "./components/Knowledge";
import Hadith from "./components/Hadith";
import News from "./components/News";
import Divestment from "./components/Divestment";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { getHadithPage } from "./lib/hadith";
import { getNews } from "./lib/news";
import { buildStructuredData } from "./lib/seo";

// Re-render at most every 15 minutes so news and the monthly hadith stay fresh
export const revalidate = 900;

const safely = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    console.error("Server prefetch failed:", error.message);
    return null;
  }
};

/* Server Component shell: static markup and the first hadith/news render on
   the server (indexable), interactive sections hydrate as client islands. */
export default async function Home() {
  const [hadith, news] = await Promise.all([
    safely(() => getHadithPage({ limit: 10, offset: 0 })),
    safely(() => getNews("en")),
  ]);

  const jsonLd = buildStructuredData({ hadith: hadith?.results ?? [] });

  return (
    <PrayerProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Navbar />
      <ScrollToTop />

      <Hero />
      <Banner />

      <PrayerTimes />
      <LiveSection />

      <Knowledge />

      <Hadith initial={hadith} />
      <News initial={news} />
      <Divestment />

      <Footer />
    </PrayerProvider>
  );
}
