"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { FaPlayCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Live({ sourceType = "hls", source, videoId, onError }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const ytRef = useRef(null);

  const [isYoutube, setIsYoutube] = useState(sourceType === "youtube");
  const [playerReady, setPlayerReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.6 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Detect user interaction (for autoplay & unmute)
  useEffect(() => {
    const onClick = () => {
      setUserInteracted(true);
      window.removeEventListener("click", onClick);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Setup YouTube
  useEffect(() => {
    if (!isYoutube || !videoId || ytRef.current) return;

    const id = `yt-player-${videoId}`;
    const initYT = () => {
      const container = document.getElementById(id);
      if (!container || ytRef.current || !window.YT?.Player) return false;

      ytRef.current = new window.YT.Player(id, {
        videoId,
        playerVars: {
          autoplay: 0,
          mute: 1,
          playsinline: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
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

    if (!window.YT && !document.getElementById("yt-api")) {
      const script = document.createElement("script");
      script.id = "yt-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = initYT;
    } else {
      const ready = initYT();
      if (!ready) {
        const interval = setInterval(() => {
          if (initYT()) clearInterval(interval);
        }, 150);
        return () => clearInterval(interval);
      }
    }

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, [isYoutube, videoId]);

  // Setup HLS
  useEffect(() => {
    if (isYoutube || !videoRef.current || !source) return;

    const video = videoRef.current;
    const onCanPlay = () => {
      setPlayerReady(true);
      setLoading(false);
    };

    video.addEventListener("canplay", onCanPlay);

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

    return () => video.removeEventListener("canplay", onCanPlay);
  }, [source, isYoutube]);

  // Manage playback & fade audio
  useEffect(() => {
    const yt = ytRef.current;
    const video = videoRef.current;

    if (!isVisible) {
      yt?.pauseVideo?.();
      video?.pause?.();
      return;
    }

    if (!isUnmuted && userInteracted) {
      if (yt && playerReady) fadeInAudio(yt);
      if (video && !isYoutube) fadeInAudio(video);
    }

    if (yt && playerReady) yt.playVideo?.();
    if (video && !isYoutube) video.play().catch(() => {});
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
    setIsYoutube(true);
    setLoading(true);
    onError?.();
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10"
      role="region"
      aria-label="Live Makkah Stream"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <AiOutlineLoading3Quarters className="text-white animate-spin text-3xl" />
        </div>
      )}

      {isYoutube && videoId ? (
        <div
          id={`yt-player-${videoId}`}
          className="w-full h-full"
          aria-label="YouTube Live Player"
        />
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

      {!playerReady && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-20">
          <FaPlayCircle className="text-6xl opacity-60 hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}
