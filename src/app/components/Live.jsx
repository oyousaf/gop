import { useEffect, useRef, useState } from "react";

export default function Live({ videoId }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Load YouTube API once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  // Track visibility with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // Init player only once
  useEffect(() => {
    if (!window.YT || playerRef.current || !isVisible) return;

    const interval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(interval);

        playerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
          height: "100%",
          width: "100%",
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event) => {
              setPlayerReady(true);
              event.target.playVideo();
            },
          },
        });
      }
    }, 100);
  }, [isVisible, videoId]);

  // Pause/resume based on scroll
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !playerReady) return;

    if (isVisible) {
      player.playVideo();
      if (!isMuted) player.unMute();
    } else {
      player.pauseVideo();
    }
  }, [isVisible, playerReady, isMuted]);

  const handleUnmute = () => {
    if (playerRef.current) {
      playerRef.current.unMute();
      setIsMuted(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10 mx-auto flex items-center justify-center"
    >
      <div id={`yt-player-${videoId}`} className="w-full h-full" />
      {isMuted && isVisible && playerReady && (
        <button
          onClick={handleUnmute}
          className="absolute bottom-4 right-4 px-4 py-2 text-sm font-semibold rounded-lg bg-white/80 text-background backdrop-blur-md hover:bg-white transition"
        >
          🔈 Unmute
        </button>
      )}
    </div>
  );
}
