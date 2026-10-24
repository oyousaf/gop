"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiVolume2 } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

/* Plays a YouTube live stream, or an HLS stream with YouTube as the fallback.
   Starts muted (browser autoplay policy), pauses when scrolled out of view,
   and only unmutes when the viewer asks to. */
export default function Live({ sourceType = "hls", source, videoId, title }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const ytRef = useRef(null);
  const fadeRef = useRef(null);

  const [isYoutube, setIsYoutube] = useState(sourceType === "youtube");
  const [playerReady, setPlayerReady] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  const fallbackToYoutube = useCallback(() => {
    if (videoId) setIsYoutube(true);
    else setFailed(true);
  }, [videoId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // YouTube IFrame API
  useEffect(() => {
    if (!isYoutube || !videoId) return;
    const id = `yt-player-${videoId}`;
    let cancelled = false;
    let interval;

    const initYT = () => {
      if (cancelled || ytRef.current) return true;
      if (!window.YT?.Player || !document.getElementById(id)) return false;

      ytRef.current = new window.YT.Player(id, {
        videoId,
        playerVars: { autoplay: 0, mute: 1, playsinline: 1, rel: 0 },
        events: { onReady: () => !cancelled && setPlayerReady(true) },
      });
      return true;
    };

    if (!document.getElementById("yt-api")) {
      const script = document.createElement("script");
      script.id = "yt-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
    if (!initYT()) {
      interval = setInterval(() => initYT() && clearInterval(interval), 150);
    }

    return () => {
      cancelled = true;
      clearInterval(interval);
      ytRef.current?.destroy?.();
      ytRef.current = null;
      setPlayerReady(false);
    };
  }, [isYoutube, videoId]);

  // HLS (native on Safari, hls.js elsewhere — loaded only when needed)
  useEffect(() => {
    if (isYoutube || !videoRef.current || !source) return;
    const video = videoRef.current;
    let hls;
    let cancelled = false;

    const onCanPlay = () => setPlayerReady(true);
    video.addEventListener("canplay", onCanPlay);

    (async () => {
      try {
        const res = await fetch(source);
        if (res.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Stream unavailable");
        }
        if (cancelled) return;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          return;
        }
        const { default: Hls } = await import("hls.js");
        if (cancelled) return;
        if (!Hls.isSupported()) throw new Error("HLS unsupported");

        hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            hls.destroy();
            fallbackToYoutube();
          }
        });
      } catch {
        if (!cancelled) fallbackToYoutube();
      }
    })();

    return () => {
      cancelled = true;
      hls?.destroy();
      video.removeEventListener("canplay", onCanPlay);
    };
  }, [source, isYoutube, fallbackToYoutube]);

  // Play while on screen, pause when scrolled away
  useEffect(() => {
    if (!playerReady) return;
    const yt = ytRef.current;
    const video = videoRef.current;
    if (isVisible) {
      if (isYoutube) yt?.playVideo?.();
      else video?.play().catch(() => {});
    } else {
      yt?.pauseVideo?.();
      video?.pause();
    }
  }, [isVisible, isYoutube, playerReady]);

  useEffect(() => () => clearInterval(fadeRef.current), []);

  const unmute = () => {
    setIsUnmuted(true);
    const yt = isYoutube ? ytRef.current : null;
    const video = videoRef.current;
    let level = 0;

    if (yt) {
      yt.unMute?.();
      yt.setVolume?.(0);
    } else if (video) {
      video.muted = false;
      video.volume = 0;
    }

    clearInterval(fadeRef.current);
    fadeRef.current = setInterval(() => {
      level = Math.min(1, level + 0.05);
      if (yt) yt.setVolume?.(level * 100);
      else if (video) video.volume = level;
      if (level >= 1) clearInterval(fadeRef.current);
    }, 75);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black"
      aria-label={title ? `${title} live stream` : "Live stream"}
      role="region"
    >
      {!playerReady && !failed && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
          <AiOutlineLoading3Quarters
            aria-label="Loading stream"
            className="animate-spin text-3xl text-white"
          />
        </div>
      )}

      {failed ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-white/80">
            The stream is unavailable right now. Please check back soon.
          </p>
        </div>
      ) : isYoutube && videoId ? (
        <div id={`yt-player-${videoId}`} className="h-full w-full" />
      ) : (
        <video
          ref={videoRef}
          className="h-full w-full"
          muted
          playsInline
          controls
          onError={fallbackToYoutube}
        />
      )}

      {playerReady && !isUnmuted && (
        <button
          type="button"
          onClick={unmute}
          className="absolute bottom-14 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-black/85"
        >
          <FiVolume2 aria-hidden="true" /> Tap for sound
        </button>
      )}
    </div>
  );
}
