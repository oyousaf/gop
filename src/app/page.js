"use client";

import dynamic from "next/dynamic";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Banner from "./components/Banner";

const Makkah = dynamic(() => import("./components/Makkah"));
const Madinah = dynamic(() => import("./components/Madinah"));
const Aqsa = dynamic(() => import("./components/Aqsa"));
const Knowledge = dynamic(() => import("./components/Knowledge"));
const Hadith = dynamic(() => import("./components/Hadith"));
const News = dynamic(() => import("./components/News"));
const Divestment = dynamic(() => import("./components/Divestment"));
const ScrollToTop = dynamic(() => import("./components/ScrollToTop"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <h1 className="sr-only">
        حدائق الجنة – Reviving the Ummah through Sacred Islamic Knowledge
      </h1>

      <Navbar />
      <ScrollToTop />

      <main>
        <Knowledge />
        <Hadith />
        <News />
      </main>

      <Footer />
    </div>
  );
}
