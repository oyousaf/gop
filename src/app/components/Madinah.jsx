"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy-load Live component with fallback skeleton
const Live = dynamic(() => import("./Live"), {
  loading: () => (
    <div className="aspect-video flex items-center justify-center rounded-xl bg-black/40 text-white">
      <p className="animate-pulse text-lg">Loading Live Stream…</p>
    </div>
  ),
  ssr: false,
});

const CHANNEL_ID = "UCfBw_uwZb_oFLyVsjWk6owQ";

export default function Madinah() {
  const [videoId, setVideoId] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (!useFallback) return;

    (async () => {
      try {
        const res = await fetch(
          `/api/youtube?channelId=${CHANNEL_ID}&query=madinah`
        );
        const data = await res.json();
        if (data.videoId) setVideoId(data.videoId);
      } catch (err) {
        console.error("YouTube fallback fetch failed:", err);
      }
    })();
  }, [useFallback]);

  const handleStreamError = () => {
    console.warn("⚠️ Madinah HLS stream failed. Switching to YouTube.");
    setUseFallback(true);
  };

  if (!hasMounted) {
    return (
      <SectionWrapper>
        <p className="text-white/70 animate-pulse">Loading Madinah stream...</p>
      </SectionWrapper>
    );
  }

  return (
    <section
      id="madinah"
      className="relative py-16 min-h-screen"
      role="region"
      aria-label="Live Madinah Stream"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto flex flex-col justify-center items-center h-full z-10 px-4 text-center"
      >
        <motion.h2
          className="md:text-5xl text-3xl font-bold mb-6 p-3 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Live from Madinah al-Munawwarah
        </motion.h2>

        <div className="w-full mb-8">
          {useFallback && videoId ? (
            <Live sourceType="youtube" videoId={videoId} />
          ) : (
            <Live
              sourceType="hls"
              source="/api/stream/madinah"
              videoId={videoId}
              onError={handleStreamError}
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}

function SectionWrapper({ children }) {
  return (
    <section
      id="madinah"
      className="relative py-16 min-h-screen flex justify-center items-center"
    >
      {children}
    </section>
  );
}
