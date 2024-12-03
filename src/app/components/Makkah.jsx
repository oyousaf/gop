import { useState, useEffect } from "react";
import Live from "./Live";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = "UCSs5mehC-g9qDmIZWFe0a6Q";

export default function Makkah() {
  const [videoId, setVideoId] = useState(null);

  // Fetch the most-viewed live stream video by title
  const fetchMostViewedLiveVideo = async () => {
    try {
      // Fetch live streams for the given channel
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`
      );
      const searchData = await searchResponse.json();

      if (!searchData.items?.length) {
        console.warn("No active live streams found.");
        return null;
      }

      // Filter videos with titles containing "makka"
      const filteredVideos = searchData.items.filter((item) =>
        item.snippet.title.toLowerCase().includes("makka")
      );

      if (!filteredVideos.length) {
        console.warn("No Makkah live stream available.");
        return null;
      }

      // Get video details including live streaming data
      const videoIds = filteredVideos.map((item) => item.id.videoId).join(",");
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoIds}&key=${API_KEY}`
      );
      const detailsData = await detailsResponse.json();

      if (!detailsData.items?.length) {
        console.error("Error fetching live stream details.");
        return null;
      }

      // Find the most-viewed live video
      const mostViewedVideo = detailsData.items.reduce((max, video) => {
        const viewers = parseInt(
          video.liveStreamingDetails.concurrentViewers || "0",
          10
        );
        return viewers > (max.viewers || 0)
          ? { id: video.id, viewers }
          : max;
      }, {});

      return mostViewedVideo.id || null;
    } catch (error) {
      console.error("Error fetching live stream data:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadLiveStream = async () => {
      const mostViewedVideoId = await fetchMostViewedLiveVideo();
      setVideoId(mostViewedVideoId);
    };

    loadLiveStream();
  }, []);

  return (
    <section className="relative py-12 h-screen" id="makkah">
      <div className="max-w-5xl mx-auto flex justify-center items-center h-full z-10">
        <div className="text-center">
          <h2 className="md:text-4xl text-2xl font-bold mb-6 p-3">
            Live from Makkah al-Mukarramah
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
