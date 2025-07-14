"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function Live({ sourceType, source, videoId, onError }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const ytPlayerRef = useRef(null);

  const [fallback, setFallback] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);

  // YouTube API setup
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

  // HLS setup
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
          setFallback(true);
          onError?.();
        }
      });

      return () => hls.destroy();
    } else {
      setFallback(true);
      onError?.();
    }
  }, [sourceType, source, fallback, onError]);

  // Visibility detection
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.6 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Playback controller
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

  if ((fallback || sourceType === "youtube") && videoId) {
    return (
      <div
        ref={containerRef}
        className="relative aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10"
      >
        <div id={`yt-player-${videoId}`} className="w-full h-full" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10"
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        autoPlay
        muted
        playsInline
        onError={() => {
          console.warn("Native HLS error, switching to fallback.");
          setFallback(true);
          onError?.();
        }}
      />
    </div>
  );
}
