"use client";

import { useEffect, useRef, useState } from "react";
import Live from "./Live";
import SectionHeading from "./SectionHeading";

/* YouTube is the primary source (higher quality); the HLS proxy is a quiet
   fallback where one exists. Several channel ids are tried in order. */
const STREAMS = [
  {
    id: "makkah",
    label: "Makkah",
    arabic: "مكة المكرمة",
    title: "Masjid al-Haram, Makkah al-Mukarramah",
    channels: ["UCos52azQNBgW63_9uDJoPDA"],
    hls: "/api/stream/makkah",
  },
  {
    id: "madinah",
    label: "Madinah",
    arabic: "المدينة المنورة",
    title: "Masjid an-Nabawi, Madinah al-Munawwarah",
    channels: [
      "UCROKYPep-UuODNwyipe6JMw",
      "UCfBw_uwZb_oFLyVsjWk6owQ",
      "UCdJ1z8f2zkgARhnxCqohb_g",
    ],
    hls: "/api/stream/madinah",
  },
  {
    id: "aqsa",
    label: "Al-Aqsa",
    arabic: "المسجد الأقصى",
    title: "Masjid al-Aqsa, Bayt al-Maqdis",
    channels: ["UC2l1w7FCuff2-h429sAUSXQ"],
    hls: null,
  },
];

const STREAM_IDS = STREAMS.map((s) => s.id);

// "Fri 23 Oct, 12:11" in the viewer's own timezone
const formatBroadcastDate = (iso) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export default function LiveSection() {
  const [active, setActive] = useState("makkah");
  // Per stream: { videoId, type: "live" | "replay" | "latest", startedAt } or null
  const [videos, setVideos] = useState({});
  const tabRefs = useRef({});

  // #makkah / #madinah / #aqsa deep links select the matching tab
  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      if (STREAM_IDS.includes(hash)) setActive(hash);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Look up each stream's video once, the first time its tab is shown
  useEffect(() => {
    if (active in videos) return;
    const stream = STREAMS.find((s) => s.id === active);
    const controller = new AbortController();

    fetch(`/api/youtube?channelId=${stream.channels.join(",")}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => setVideos((p) => ({ ...p, [active]: data?.videoId ? data : null })))
      .catch((err) => {
        if (err.name !== "AbortError") setVideos((p) => ({ ...p, [active]: null }));
      });

    return () => controller.abort();
  }, [active, videos]);

  const onTabKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const index = STREAM_IDS.indexOf(active);
    const next = STREAM_IDS[(index + step + STREAM_IDS.length) % STREAM_IDS.length];
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const stream = STREAMS.find((s) => s.id === active);
  const video = videos[active];
  const videoId = video?.videoId;
  const checked = active in videos;

  const activeIndex = STREAM_IDS.indexOf(active);

  return (
    <section
      id="live"
      aria-labelledby="live-heading"
      className="relative mx-auto max-w-6xl px-4 py-24 md:py-32"
    >
      {/* Anchors so #makkah / #madinah / #aqsa links land here */}
      {STREAMS.map((s) => (
        <span key={s.id} id={s.id} className="absolute top-0" />
      ))}

      <SectionHeading
        id="live-heading"
        eyebrow="Live"
        arabic="بث مباشر"
        title="From the Blessed Lands"
      />

      <div data-reveal className="mb-8 flex justify-center">
        <div
          role="tablist"
          aria-label="Choose a live stream"
          className="relative grid grid-cols-3 rounded-full bg-surface-2 p-1 ring-1 ring-line"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-ink shadow transition-transform duration-500"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {STREAMS.map((s) => {
            const selected = s.id === active;
            return (
              <button
                key={s.id}
                ref={(el) => (tabRefs.current[s.id] = el)}
                type="button"
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={selected}
                aria-controls="live-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(s.id)}
                onKeyDown={onTabKeyDown}
                className={`relative z-10 min-w-24 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-500 sm:min-w-32 sm:text-base ${
                  selected ? "text-bg" : "text-ink-muted hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="live-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        data-reveal
        className="overflow-hidden rounded-[2rem] border border-line bg-surface p-2 shadow-[0_30px_80px_-40px_oklch(0.2_0.03_58/0.45)] md:p-3"
      >
        {!checked ? (
          <div className="flex aspect-video items-center justify-center rounded-3xl bg-surface-2">
            <p className="animate-pulse text-ink-muted">Loading live stream…</p>
          </div>
        ) : videoId ? (
          <Live key={`yt-${videoId}`} sourceType="youtube" videoId={videoId} title={stream.label} />
        ) : stream.hls ? (
          <Live key={`hls-${active}`} sourceType="hls" source={stream.hls} title={stream.label} />
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-3xl bg-surface-2">
            <p className="text-ink-muted">No stream is available at the moment.</p>
          </div>
        )}

        <div key={active} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 pb-3 pt-5 animate-[fade-in_0.5s_ease-out]">
          <div>
            <h3 className="font-display text-2xl text-ink md:text-3xl">{stream.title}</h3>
            {video && (
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-ink-muted">
                {video.type === "live" ? (
                  <>
                    <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-red-500 motion-reduce:animate-none" />
                    Live now
                  </>
                ) : (
                  <>
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink-subtle" />
                    {video.type === "replay" ? "Latest broadcast" : "Latest video"}
                    {video.startedAt && ` · ${formatBroadcastDate(video.startedAt)}`}
                  </>
                )}
              </p>
            )}
          </div>
          <p lang="ar" dir="rtl" className="font-arabic-display text-2xl text-ink-muted">
            {stream.arabic}
          </p>
        </div>
      </div>
    </section>
  );
}
