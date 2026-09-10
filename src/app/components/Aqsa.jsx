"use client";

import { useState, useEffect } from "react";
import Live from "./Live";
import { StreamSection, StreamSectionWrapper } from "./StreamSection";

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
      <StreamSectionWrapper id="aqsa" ariaLabel="Loading Al-Aqsa Stream">
        <p className="text-white/70 animate-pulse text-base">
          Loading stream...
        </p>
      </StreamSectionWrapper>
    );
  }

  return (
    <StreamSection
      id="aqsa"
      headingId="aqsa-heading"
      ariaLabel="Live Al-Aqsa Stream"
      title="Live from Bayt al-Maqdis"
    >
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
    </StreamSection>
  );
}
