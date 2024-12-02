import { useState, useEffect } from "react";
import Live from "./Live";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const channelId = "UCfBw_uwZb_oFLyVsjWk6owQ";

async function fetchLiveStreamData(channelId, API_KEY) {
  const searchResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${API_KEY}`
  );
  const searchData = await searchResponse.json();

  if (!searchData.items || searchData.items.length === 0) {
    throw new Error("No active live streams found.");
  }

  return searchData.items
    .filter((item) => item.snippet.title.toLowerCase().includes("madina"))
    .map((item) => item.id.videoId)
    .join(",");
}

async function fetchVideoDetails(videoIds, API_KEY) {
  const detailsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoIds}&key=${API_KEY}`
  );
  const detailsData = await detailsResponse.json();

  if (!detailsData.items || detailsData.items.length === 0) {
    throw new Error("No Madinah live stream available.");
  }

  return detailsData.items.reduce((max, video) => {
    const viewers = parseInt(
      video.liveStreamingDetails.concurrentViewers || "0",
      10
    );
    return viewers > (max.viewers || 0) ? { id: video.id, viewers } : max;
  }, {});
}

export default function Makkah() {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    const fetchLiveVideoWithMostViewers = async () => {
      try {
        const videoIds = await fetchLiveStreamData(channelId, API_KEY);
        const mostViewedVideo = await fetchVideoDetails(videoIds, API_KEY);

        if (mostViewedVideo.id) {
          setVideoId(mostViewedVideo.id);
        }
      } catch (error) {
        console.error("Error fetching live stream data:", error);
        setVideoId(null);
      }
    };

    fetchLiveVideoWithMostViewers();
  }, []);

  return (
    <section className="relative py-12 h-screen" id="makkah">
      <div className="max-w-5xl mx-auto flex justify-center items-center h-full z-10">
        <div className="text-center">
          <h2 className="md:text-4xl text-2xl font-bold mb-6 p-3">
            Live From Madinah al-Munawwarah
          </h2>
          {videoId ? (
            <Live videoId={videoId} />
          ) : (
            <p>No live stream available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
}
