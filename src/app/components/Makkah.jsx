"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Live from "./Live";

export default function Makkah() {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          "/api/youtube?channelId=UCqtGJe9AnRfq5wwjk27VsoQ"
        );
        const data = await res.json();
        if (data.videoId) setVideoId(data.videoId);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchVideo();
  }, []);

  return (
    <section id="makkah" className="relative py-16 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto flex flex-col justify-center items-center h-full z-10 px-4 text-center"
      >
        <h2 className="md:text-5xl text-3xl font-bold mb-6 p-3 text-white">
          Live from Makkah al-Mukarramah
        </h2>

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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow p-6 w-full max-w-2xl"
        >
          <h3 className="text-xl font-semibold mb-3 text-white">
            Today's Prayer Times
          </h3>
          <p className="text-sm text-white/60 italic mb-4">
            (Prayer time integration coming soon)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left text-base text-white/90">
            {[
              { name: "Fajr", time: "--:--" },
              { name: "Dhuhr", time: "--:--" },
              { name: "Asr", time: "--:--" },
              { name: "Maghrib", time: "--:--" },
              { name: "Isha", time: "--:--" },
            ].map(({ name, time }) => (
              <div key={name} className="flex justify-between">
                <span>{name}</span>
                <span>{time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
