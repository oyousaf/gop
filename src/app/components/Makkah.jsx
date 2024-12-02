import { useState, useEffect } from "react";
import Live from "./Live";

export default function Makkah() {
  const [videoId, setVideoId] = useState(null);
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const channelId = "UCfBw_uwZb_oFLyVsjWk6owQ";

  useEffect(() => {
    const fetchVideoByTitleAndViewers = async () => {
      try {
        // Fetch live stream search data
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${API_KEY}`
        );
        const searchData = await searchResponse.json();

        if (!searchData.items?.length) {
          console.error("No active live streams found.");
          setVideoId(null);
          return;
        }

        // Filter videos by title containing "makka"
        const filteredVideos = searchData.items.filter((item) =>
          item.snippet.title.toLowerCase().includes("makka")
        );

        if (!filteredVideos.length) {
          console.error("No Makkah live stream available.");
          setVideoId(null);
          return;
        }

        // Get the video IDs and fetch live stream details
        const videoIds = filteredVideos
          .map((item) => item.id.videoId)
          .join(",");
        const detailsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoIds}&key=${API_KEY}`
        );
        const detailsData = await detailsResponse.json();

        if (!detailsData.items?.length) {
          console.error("Error fetching live stream details.");
          setVideoId(null);
          return;
        }

        // Find the most viewed live stream
        const mostViewedVideo = detailsData.items.reduce((max, video) => {
          const viewers = parseInt(
            video.liveStreamingDetails.concurrentViewers || "0",
            10
          );
          return viewers > (max.viewers || 0) ? { id: video.id, viewers } : max;
        }, {});

        setVideoId(mostViewedVideo.id || null);
      } catch (error) {
        console.error("Error fetching live stream data:", error);
        setVideoId(null);
      }
    };

    fetchVideoByTitleAndViewers();
  }, [API_KEY, channelId]);

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
