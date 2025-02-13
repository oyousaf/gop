import { useState, useEffect } from "react";
import Live from "./Live";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = "UCqDUJp6Z4wyFkDJGqd0EP4Q";

export default function Makkah() {
  const [videoId, setVideoId] = useState(null);
  const [fallbackVideoId, setFallbackVideoId] = useState(null);

  useEffect(() => {
    const fetchLiveStream = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&q=makka&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items?.length) {
          setVideoId(data.items[0].id.videoId);
        } else {
          console.warn(
            "No Makkah live stream available. Fetching the latest video..."
          );
          fetchFallbackVideo();
        }
      } catch (error) {
        console.error("Error fetching live stream data:", error);
        fetchFallbackVideo();
      }
    };

    const fetchFallbackVideo = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items?.length) {
          setFallbackVideoId(data.items[0].id.videoId);
        } else {
          console.warn("No fallback video available.");
        }
      } catch (error) {
        console.error("Error fetching fallback video data:", error);
      }
    };

    fetchLiveStream();
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
