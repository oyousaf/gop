"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import Makkah from "./components/Makkah";
import Madinah from "./components/Madinah";
import Aqsa from "./components/Aqsa";
import Knowledge from "./components/Knowledge";
import Hadith from "./components/Hadith";
import News from "./components/News";
import Divestment from "./components/Divestment";
import ScrollToTop from "./components/ScrollToTop";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <h1 className="sr-only">
        حدائق الجنة – Reviving the Ummah through Sacred Islamic Knowledge
      </h1>

      {/* Persistent UI */}
      <Navbar />
      <ScrollToTop />

      {/* Hero + Page Sections */}
      <Hero />{/*
      <Banner />
      <Makkah />
      <Madinah />
      <Aqsa />
      <Knowledge />*/}
      <Hadith />{/*
      <News />
      <Divestment />*/}

      {/* Footer */}
      <Footer />
    </div>
  );
}
