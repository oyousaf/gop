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
      <Navbar />
      <ScrollToTop />

      <div>
        {/* Above-the-fold */}
        <Hero />
        <Banner />

        {/* Deferred content */}
        <section aria-labelledby="makkah-heading">
          <Makkah />
        </section>

        <section aria-labelledby="madinah-heading">
          <Madinah />
        </section>

        <section aria-labelledby="aqsa-heading">
          <Aqsa />
        </section>

        {/* Static content */}
        <Knowledge />

        <section aria-labelledby="hadith-heading">
          <Hadith />
        </section>

        <section aria-labelledby="news-heading">
          <News />
        </section>

        <section aria-labelledby="divestment-heading">
          <Divestment />
        </section>
      </div>

      <Footer />
    </div>
  );
}
