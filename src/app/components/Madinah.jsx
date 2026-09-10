"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { StreamSection, StreamSectionWrapper } from "./StreamSection";

// Lazy-load Live component with fallback skeleton
const Live = dynamic(() => import("./Live"), {
  loading: () => (
    <div className="aspect-video flex items-center justify-center rounded-xl bg-black/40 text-white">
      <p className="animate-pulse text-lg">Loading Live Stream…</p>
    </div>
  ),
  ssr: false,
});

const CHANNEL_IDS = [
  "UCROKYPep-UuODNwyipe6JMw", // main
  "UCfBw_uwZb_oFLyVsjWk6owQ", // backup 1
  "UCdJ1z8f2zkgARhnxCqohb_g", // backup 2
];

export default function Madinah() {
  const [videoId, setVideoId] = useState(null);
  const [ytChecked, setYtChecked] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  // YouTube is the primary source (higher quality); the HLS proxy is a quiet fallback.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/youtube?channelId=${CHANNEL_IDS}`);
        const data = await res.json();
        if (data.videoId) {
          setVideoId(data.videoId);
        } else {
          console.warn("⚠️ No live YouTube video found for Madinah.");
        }
      } catch (err) {
        console.error("Madinah YouTube fetch failed:", err);
      } finally {
        setYtChecked(true);
      }
    })();
  }, []);

  if (!hasMounted) {
    return (
      <StreamSectionWrapper id="madinah" ariaLabel="Loading Madinah Stream">
        <p className="text-white/70 animate-pulse">Loading Madinah stream...</p>
      </StreamSectionWrapper>
    );
  }

  return (
    <StreamSection
      id="madinah"
      headingId="madinah-heading"
      ariaLabel="Live Madinah Stream"
      title="Live from Madinah al-Munawwarah"
    >
      <div className="w-full mb-8">
        {!ytChecked ? (
          <div className="aspect-video flex items-center justify-center rounded-xl bg-black/40 text-white">
            <p className="animate-pulse text-lg">Loading Live Stream…</p>
          </div>
        ) : videoId ? (
          <Live sourceType="youtube" videoId={videoId} />
        ) : (
          <Live sourceType="hls" source="/api/stream/madinah" />
        )}
      </div>
    </StreamSection>
  );
}
