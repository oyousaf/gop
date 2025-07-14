"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function Live({ sourceType = "hls", source, videoId, onError }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const ytPlayerRef = useRef(null);

  const [fallback, setFallback] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);

  // Setup YouTube script if needed
  useEffect(() => {
    if ((fallback || sourceType === "youtube") && videoId && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      ytPlayerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
        videoId,
        playerVars: {
          autoplay: 0,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => setPlayerReady(true),
        },
      });
    };

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, [fallback, sourceType, videoId]);

  // Handle HLS stream
  useEffect(() => {
    if (sourceType !== "hls" || fallback || !videoRef.current) return;

    const video = videoRef.current;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          hls.destroy();
          fallbackToYoutube();
        }
      });

      return () => hls.destroy();
    } else {
      fallbackToYoutube();
    }
  }, [sourceType, source, fallback]);

  // Detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.6 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle playback when visible
  useEffect(() => {
    const video = videoRef.current;
    const yt = ytPlayerRef.current;

    if (!isVisible) {
      video?.pause();
      yt?.pauseVideo?.();
      return;
    }

    if (sourceType === "hls" && video) {
      video.play().catch(() => {});
      if (!isUnmuted) fadeInAudio(video);
    }

    if ((fallback || sourceType === "youtube") && yt && playerReady) {
      yt.playVideo();
      if (!isUnmuted) fadeInAudio(yt);
    }
  }, [isVisible, fallback, sourceType, playerReady, isUnmuted]);

  function fadeInAudio(media) {
    setIsUnmuted(true);
    const step = media.setVolume ? 5 : 0.05;
    let volume = 0;

    const fade = setInterval(() => {
      volume = Math.min(media.setVolume ? 100 : 1, volume + step);
      if (media.setVolume) {
        media.unMute();
        media.setVolume(volume);
      } else {
        media.muted = false;
        media.volume = volume;
      }
      if (volume >= (media.setVolume ? 100 : 1)) clearInterval(fade);
    }, 75);
  }

  function fallbackToYoutube() {
    setFallback(true);
    onError?.();
  }

  const isYoutube = fallback || sourceType === "youtube";

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10"
    >
      {isYoutube && videoId ? (
        <div id={`yt-player-${videoId}`} className="w-full h-full" />
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full"
          autoPlay
          muted
          playsInline
          onError={fallbackToYoutube}
        />
      )}
    </div>
  );
}
