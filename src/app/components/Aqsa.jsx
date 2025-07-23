"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Live from "./Live";

const CHANNEL_ID = "UC2l1w7FCuff2-h429sAUSXQ";

export default function Aqsa() {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/youtube?channelId=${CHANNEL_ID}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data?.videoId) setVideoId(data.videoId);
      } catch (err) {
        console.error("❌ Aqsa video fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, []);

  if (!hasMounted || loading) {
    return (
      <SectionWrapper>
        <p className="text-white/70 animate-pulse text-base">
          Loading stream...
        </p>
      </SectionWrapper>
    );
  }

  return (
    <section
      id="aqsa"
      role="region"
      aria-label="Live Al-Aqsa Stream"
      className="relative py-16 min-h-screen"
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
          Live from Bayt al-Maqdis
        </motion.h2>

        <div className="w-full mb-8">
          {videoId ? (
            <Live sourceType="youtube" videoId={videoId} />
          ) : (
            <div className="flex justify-center items-center w-full aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10">
              <p className="text-white/80 text-lg animate-pulse">
                No video available at the moment.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

function SectionWrapper({ children }) {
  return (
    <section
      id="aqsa"
      role="region"
      aria-label="Loading Al-Aqsa Stream"
      className="relative py-16 min-h-screen flex justify-center items-center"
    >
      <div className="w-full max-w-5xl px-4 text-center">{children}</div>
    </section>
  );
}
