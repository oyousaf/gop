"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Live from "./Live";

const CHANNEL_ID = "UCfBw_uwZb_oFLyVsjWk6owQ";

export default function Madinah() {
  const [videoId, setVideoId] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Mount check
  useEffect(() => setHasMounted(true), []);

  // Fetch fallback only when needed
  useEffect(() => {
    if (!useFallback) return;

    const fetchFallbackStream = async () => {
      try {
        const res = await fetch(
          `/api/youtube?channelId=${CHANNEL_ID}&query=madinah`
        );
        const data = await res.json();
        if (data.videoId) setVideoId(data.videoId);
      } catch (err) {
        console.error("YouTube fallback fetch failed:", err);
      }
    };

    fetchFallbackStream();
  }, [useFallback]);

  const handleStreamError = () => {
    console.warn("⚠️ Madinah HLS stream failed. Switching to YouTube.");
    setUseFallback(true);
  };

  if (!hasMounted) {
    return (
      <section
        id="madinah"
        className="relative py-16 min-h-screen flex justify-center items-center"
      >
        <p className="text-white/70 animate-pulse">Loading Madinah stream...</p>
      </section>
    );
  }

  return (
    <section id="madinah" className="relative py-16 min-h-screen">
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
          <Live
            sourceType="hls"
            source="/api/stream/madinah"
            onError={() => setUseFallback(true)}
          />
          {useFallback && videoId && (
            <Live sourceType="youtube" videoId={videoId} />
          )}
        </div>
      </motion.div>
    </section>
  );
}
