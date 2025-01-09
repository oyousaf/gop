"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import Makkah from "./components/Makkah";
import Madinah from "./components/Madinah";
import Knowledge from "./components/Knowledge";
import Hadith from "./components/Hadith";
import News from "./components/News";

import "./styles/globals.css";
import ScrollToTop from "./components/ScrollToTop";
import Aqsa from "./components/Aqsa";

export default function Home() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-background text-foreground">
      <Navbar />
      <Hero />
      <Banner />
      <Makkah />
      <Madinah />
      <Aqsa />
      <Knowledge />
      <Hadith />
      <News />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
