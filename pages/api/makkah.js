export default async function handler(req, res) {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const CHANNEL_ID = "UCSs5mehC-g9qDmIZWFe0a6Q";

  const fetchLiveStream = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&q=makka&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.items?.length) {
        return { videoId: data.items[0].id.videoId };
      } else {
        console.warn(
          "No Makkah live stream available. Fetching the latest video..."
        );
        return await fetchFallbackVideo();
      }
    } catch (error) {
      console.error("Error fetching live stream data:", error);
      return await fetchFallbackVideo();
    }
  };

  const fetchFallbackVideo = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.items?.length) {
        return { fallbackVideoId: data.items[0].id.videoId };
      } else {
        console.warn("No fallback video available.");
        return {};
      }
    } catch (error) {
      console.error("Error fetching fallback video data:", error);
      return {};
    }
  };

  const videoData = await fetchLiveStream();
  res.status(200).json(videoData);
}
