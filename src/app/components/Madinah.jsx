import { useState, useEffect } from "react";
import Live from "./Live";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = "UCfBw_uwZb_oFLyVsjWk6owQ";

export default function Madinah() {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    const fetchLiveStream = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&q=madina&type=video&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items?.length) {
          setVideoId(data.items[0].id.videoId);
        } else {
          console.warn("No Madinah live stream available.");
        }
      } catch (error) {
        console.error("Error fetching live stream data:", error);
      }
    };

    fetchLiveStream();
  }, []);

  return (
    <section className="relative py-12 h-screen" id="madinah">
      <div className="max-w-5xl mx-auto flex justify-center items-center h-full z-10">
        <div className="text-center">
          <h2 className="md:text-5xl text-3xl font-bold mb-6 p-3">
            Live From Madinah al-Munawwarah
          </h2>
          {videoId ? (
            <Live videoId={videoId} />
          ) : (
            <p>No Madinah live stream available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
}
