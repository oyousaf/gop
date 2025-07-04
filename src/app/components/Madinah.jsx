"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Live from "./Live";

const CHANNEL_ID = "UCfBw_uwZb_oFLyVsjWk6owQ";

export default function Madinah() {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch(
          `/api/youtube?channelId=${CHANNEL_ID}&query=madinah`
        );
        const data = await res.json();
        if (data.videoId) setVideoId(data.videoId);
      } catch (err) {
        console.error("Madinah video fetch error:", err);
      }
    };
    fetchLive();
  }, []);

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

        <div className="w-full aspect-video relative mb-8 rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10">
          {videoId ? (
            <Live videoId={videoId} />
          ) : (
            <div className="flex justify-center items-center w-full h-full">
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
