import { useEffect, useRef, useState } from "react";

export default function Live({ videoId }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);

  // Load YouTube Iframe API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  // Initialize YouTube player when API is ready
  useEffect(() => {
    const checkYTReady = setInterval(() => {
      if (window.YT?.Player && !playerRef.current) {
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
            onReady: () => {
              setPlayerReady(true);
              playerRef.current?.playVideo();
            },
          },
        });
        clearInterval(checkYTReady);
      }
    }, 100);

    return () => clearInterval(checkYTReady);
  }, [videoId]);

  // Handle scroll visibility: unmute & fade in audio on scroll in, pause on scroll out
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!playerRef.current || !playerReady) return;

        const ratio = entry.intersectionRatio;

        if (ratio > 0.6) {
          // In view: play & fade in audio
          playerRef.current.playVideo();

          if (!isUnmuted) {
            fadeInAudio(playerRef.current);
            setIsUnmuted(true);
          }
        } else {
          // Out of view: pause
          playerRef.current.pauseVideo();
        }
      },
      {
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
      }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [playerReady, isUnmuted]);

  // Smooth audio fade-in from 0 to 100
  const fadeInAudio = (player) => {
    if (!player?.unMute || !player?.setVolume) return;

    player.unMute();
    player.setVolume(0);

    let volume = 0;
    const fade = setInterval(() => {
      if (volume < 100) {
        volume += 5;
        player.setVolume(volume);
      } else {
        clearInterval(fade);
      }
    }, 75);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10 mx-auto flex items-center justify-center"
    >
      <div id={`yt-player-${videoId}`} className="w-full h-full" />
    </div>
  );
}
