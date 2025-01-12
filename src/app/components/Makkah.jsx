import { useState, useEffect } from "react";
import Live from "./Live";

export default function Makkah() {
  const [videoId, setVideoId] = useState(null);
  const [fallbackVideoId, setFallbackVideoId] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch("/api/makkah");
        const data = await response.json();

        if (data.videoId) {
          setVideoId(data.videoId);
        } else if (data.fallbackVideoId) {
          setFallbackVideoId(data.fallbackVideoId);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData();
  }, []);

  return (
    <section className="relative py-12 h-screen" id="makkah">
      <div className="max-w-5xl mx-auto flex flex-col justify-center items-center h-full z-10">
        <div className="text-center">
          <h2 className="md:text-5xl text-3xl font-bold mb-6 p-3">
            Live from Makkah al-Mukarramah
          </h2>
        </div>
        <div className="w-full relative aspect-video text-center">
          {videoId ? (
            <Live videoId={videoId} />
          ) : fallbackVideoId ? (
            <Live videoId={fallbackVideoId} />
          ) : (
            <p>No videos available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
}
