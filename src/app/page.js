"use client";

import dynamic from "next/dynamic";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Banner from "./components/Banner";
import Knowledge from "./components/Knowledge";
import Footer from "./components/Footer";

/* ---------------------------------
   LAZY SECTIONS (non-critical)
---------------------------------- */
const Makkah = dynamic(() => import("./components/Makkah"), {
  loading: () => null,
});
const Madinah = dynamic(() => import("./components/Madinah"), {
  loading: () => null,
});
const Aqsa = dynamic(() => import("./components/Aqsa"), {
  loading: () => null,
});
const Hadith = dynamic(() => import("./components/Hadith"), {
  loading: () => null,
});
const News = dynamic(() => import("./components/News"), {
  loading: () => null,
});
const Divestment = dynamic(() => import("./components/Divestment"), {
  loading: () => null,
});

/* Client-only utility */
const ScrollToTop = dynamic(() => import("./components/ScrollToTop"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* SEO / screen readers */}
      <h1 className="sr-only">
        حدائق الجنة – Reviving the Ummah through Sacred Islamic Knowledge
      </h1>

      <Navbar />
      <ScrollToTop />

      <main>
        {/* Above-the-fold */}
        <Hero />
        <Banner />

        {/* Static content */}
        <Knowledge />

        {/* Deferred content */}
        <section>
          <Makkah />
        </section>

        <section>
          <Madinah />
        </section>

        <section>
          <Aqsa />
        </section>

        <section>
          <Hadith />
        </section>

        <section>
          <News />
        </section>

        <section>
          <Divestment />
        </section>
      </main>

      <Footer />
    </div>
  );
}
