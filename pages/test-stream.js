"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function TestStream() {
  const videoRef = useRef(null);
  const [location, setLocation] = useState("makkah");

  useEffect(() => {
    const video = videoRef.current;
    const src = `/api/stream/${location}`;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });

      return () => hls.destroy();
    } else {
      console.error("HLS not supported in this browser.");
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black p-6">
      <h1 className="text-white text-2xl mb-6">
        Test HLS Stream – {location.toUpperCase()}
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setLocation("makkah")}
          className={`px-4 py-2 rounded ${
            location === "makkah"
              ? "bg-green-600 text-white"
              : "bg-white text-black"
          }`}
        >
          Makkah
        </button>
        <button
          onClick={() => setLocation("madinah")}
          className={`px-4 py-2 rounded ${
            location === "madinah"
              ? "bg-green-600 text-white"
              : "bg-white text-black"
          }`}
        >
          Madinah
        </button>
      </div>

      <video
        ref={videoRef}
        className="w-full max-w-3xl border border-white rounded"
        controls
        autoPlay
        muted
        playsInline
      />
    </div>
  );
}
