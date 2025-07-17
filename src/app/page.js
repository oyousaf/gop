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

import "./styles/globals.css";

export default function Home() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-background text-foreground">
      <h1 className="sr-only">
        حدائق الجنة – Reviving the Ummah through Sacred Islamic Knowledge
      </h1>
      <Navbar />
      <Hero />
      <Banner />
      <Makkah />
      <Madinah />
      <Aqsa />
      <Knowledge />
      <Hadith />
      <News />
      <Divestment />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
