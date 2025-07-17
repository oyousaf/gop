"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { FaSpinner, FaPlayCircle } from "react-icons/fa";

export default function Live({ sourceType = "hls", source, videoId, onError }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const ytRef = useRef(null);

  const [fallback, setFallback] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const isYoutube = fallback || sourceType === "youtube";

  // ✅ User interaction (for autoplay audio)
  useEffect(() => {
    const handleClick = () => {
      setUserInteracted(true);
      window.removeEventListener("click", handleClick);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // ✅ HLS setup
  useEffect(() => {
    if (isYoutube || !videoRef.current || !source?.trim()) return;

    const video = videoRef.current;

    const handleCanPlay = () => {
      setPlayerReady(true);
      setLoading(false);
    };

    video.addEventListener("canplay", handleCanPlay);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source.trim();
    } else if (Hls.isSupported()) {
      const hls = new Hls();

      try {
        hls.loadSource(source.trim());
        hls.attachMedia(video);
      } catch (err) {
        console.error("HLS load failed:", err);
        fallbackToYoutube();
      }

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

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [source, isYoutube]);

  // ✅ YouTube setup
  useEffect(() => {
    if (!isYoutube || !videoId) return;

    const playerId = `yt-player-${videoId}`;
    const tryInitYT = () => {
      const container = document.getElementById(playerId);
      if (!container || ytRef.current || !window.YT?.Player) return false;

      ytRef.current = new window.YT.Player(playerId, {
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
          onReady: () => {
            setPlayerReady(true);
            setLoading(false);
          },
        },
      });

      return true;
    };

    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = () => tryInitYT();
    } else {
      const initialized = tryInitYT();
      if (!initialized) {
        const interval = setInterval(() => {
          if (tryInitYT()) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
      }
    }

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, [isYoutube, videoId]);

  // ✅ Visibility tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.6 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ✅ Playback and audio
  useEffect(() => {
    const video = videoRef.current;
    const yt = ytRef.current;

    if (!isVisible) {
      video?.pause();
      yt?.pauseVideo?.();
      return;
    }

    if (!isUnmuted && userInteracted) {
      if (!isYoutube && video) fadeInAudio(video);
      if (isYoutube && playerReady && yt) fadeInAudio(yt);
    }

    if (!isYoutube && video) video.play().catch(() => {});
    if (isYoutube && yt && playerReady) yt.playVideo();
  }, [isVisible, userInteracted, isUnmuted, isYoutube, playerReady]);

  function fadeInAudio(media) {
    setIsUnmuted(true);
    const step = media.setVolume ? 5 : 0.05;
    let volume = 0;

    const fade = setInterval(() => {
      volume = Math.min(media.setVolume ? 100 : 1, volume + step);
      if (media.setVolume) {
        media.unMute?.();
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
    setLoading(true);
    onError?.();
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10"
    >
      {/* 👇 Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <FaSpinner className="text-white animate-spin text-3xl" />
        </div>
      )}

      {/* 👇 Video or YouTube */}
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

      {/* 👇 Optional fallback thumbnail (if loading too long) */}
      {!playerReady && !loading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center text-white z-20">
          <FaPlayCircle className="text-6xl opacity-60 hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}
