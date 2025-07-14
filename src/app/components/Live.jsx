"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function Live({ sourceType, source, videoId, onError }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [fallback, setFallback] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const ytPlayerRef = useRef(null);

  // Load YouTube player if fallback is active
  useEffect(() => {
    if ((fallback || sourceType === "youtube") && videoId) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        ytPlayerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
          videoId,
          width: "100%",
          height: "100%",
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
              ytPlayerRef.current.playVideo();
            },
          },
        });
      };

      return () => {
        delete window.onYouTubeIframeAPIReady;
      };
    }
  }, [fallback, sourceType, videoId]);

  // Attach and manage HLS
  useEffect(() => {
    if (sourceType === "hls" && !fallback && videoRef.current) {
      const video = videoRef.current;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_, { fatal }) => {
          if (fatal) {
            hls.destroy();
            setFallback(true);
            onError?.();
          }
        });
      } else {
        setFallback(true);
        onError?.();
      }
    }
  }, [sourceType, source, fallback]);

  // Scroll observer to play/pause and handle mute state
  useEffect(() => {
    const node = containerRef.current;
    const video = videoRef.current;
    const ytPlayer = ytPlayerRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.intersectionRatio > 0.6;

        // HLS video
        if (sourceType === "hls" && video) {
          if (inView) {
            video.play();
            if (!isUnmuted) fadeInAudio(video);
          } else {
            video.pause();
          }
        }

        // YouTube video
        if ((fallback || sourceType === "youtube") && ytPlayer && playerReady) {
          if (inView) {
            ytPlayer.playVideo();
            if (!isUnmuted) fadeInAudio(ytPlayer);
          } else {
            ytPlayer.pauseVideo();
          }
        }
      },
      {
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [sourceType, fallback, isUnmuted, playerReady]);

  const fadeInAudio = (media) => {
    setIsUnmuted(true);

    if (media.unMute && media.setVolume) {
      media.unMute();
      media.setVolume(0);
      let volume = 0;
      const fade = setInterval(() => {
        volume = Math.min(100, volume + 5);
        media.setVolume(volume);
        if (volume >= 100) clearInterval(fade);
      }, 75);
    } else if (media.volume !== undefined) {
      media.muted = false;
      media.volume = 0;
      let volume = 0;
      const fade = setInterval(() => {
        volume = Math.min(1, volume + 0.05);
        media.volume = volume;
        if (volume >= 1) clearInterval(fade);
      }, 75);
    }
  };

  if (fallback || sourceType === "youtube") {
    if (!videoId) return null;
    return (
      <div
        ref={containerRef}
        className="relative aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10 mx-auto flex items-center justify-center"
      >
        <div id={`yt-player-${videoId}`} className="w-full h-full" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10 mx-auto flex items-center justify-center"
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        autoPlay
        muted
        playsInline
        onError={() => {
          console.warn("Native stream error; falling back");
          setFallback(true);
          onError?.();
        }}
      />
    </div>
  );
}
