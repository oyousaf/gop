"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { StreamSection, StreamSectionWrapper } from "./StreamSection";

// Lazy-load Live component with skeleton fallback
const Live = dynamic(() => import("./Live"), {
  loading: () => (
    <div className="aspect-video flex items-center justify-center rounded-xl bg-black/40 text-white">
      <p className="animate-pulse text-lg">Loading Live Stream…</p>
    </div>
  ),
  ssr: false,
});

const CHANNEL_ID = "UCos52azQNBgW63_9uDJoPDA";
const PRAYER_ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

export default function Makkah() {
  const [videoId, setVideoId] = useState(null);
  const [ytChecked, setYtChecked] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [clock, setClock] = useState(null);
  const [is24Hour, setIs24Hour] = useState(true);
  const [upcomingPrayer, setUpcomingPrayer] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [location, setLocation] = useState({
    city: "Makkah",
    country: "Saudi Arabia",
  });

  useEffect(() => {
    setHasMounted(true);
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // YouTube is the primary source (higher quality); the HLS proxy is a quiet fallback.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/youtube?channelId=${CHANNEL_ID}`);
        const data = await res.json();
        if (data.videoId) setVideoId(data.videoId);
      } catch (err) {
        console.error("❌ Makkah YouTube fetch failed:", err);
      } finally {
        setYtChecked(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();
        const city = ipData.city || "Makkah";
        const country = ipData.country_name || "Saudi Arabia";
        setLocation({ city, country });

        const prayerRes = await fetch(
          `/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
        );
        const timings = await prayerRes.json();
        if (!timings.error) setPrayerTimes(timings);
      } catch (err) {
        console.error("Location/Prayer fetch error:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!prayerTimes || !clock) return;
    const now = clock;

    for (let name of PRAYER_ORDER) {
      const [h, m] = convertTo24(prayerTimes[name]).split(":").map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(h, m, 0, 0);
      if (prayerTime > now) {
        setUpcomingPrayer(name);
        return;
      }
    }
    setUpcomingPrayer("Fajr");
  }, [prayerTimes, clock]);

  const gregorian = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
  }).format(clock);
  const hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(clock);
  const formattedClock = is24Hour
    ? clock?.toLocaleTimeString("en-GB")
    : clock?.toLocaleTimeString("en-US");

  if (!hasMounted || !clock) {
    return (
      <StreamSectionWrapper id="makkah" ariaLabel="Loading Makkah Stream">
        <p className="text-white/70 animate-pulse">Loading live stream...</p>
      </StreamSectionWrapper>
    );
  }

  return (
    <StreamSection
      id="makkah"
      headingId="makkah-heading"
      ariaLabel="Live Makkah Stream"
      title="Live from Makkah al-Mukarramah"
    >
      <div className="w-full mb-8">
        {!ytChecked ? (
          <div className="aspect-video flex items-center justify-center rounded-xl bg-black/40 text-white">
            <p className="animate-pulse text-lg">Loading Live Stream…</p>
          </div>
        ) : videoId ? (
          <Live sourceType="youtube" videoId={videoId} />
        ) : (
          <Live sourceType="hls" source="/api/stream/makkah" />
        )}
      </div>

      <PrayerTimesCard
        prayerTimes={prayerTimes}
        upcomingPrayer={upcomingPrayer}
        clock={clock}
        is24Hour={is24Hour}
        setIs24Hour={setIs24Hour}
        gregorian={gregorian}
        hijri={hijri}
        formattedClock={formattedClock}
      />
    </StreamSection>
  );
}

function PrayerTimesCard({
  prayerTimes,
  upcomingPrayer,
  clock,
  is24Hour,
  setIs24Hour,
  gregorian,
  hijri,
  formattedClock,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow p-6 w-full max-w-3xl"
    >
      <div className="flex justify-between items-center mb-3 text-xl">
        <h3 className="text-2xl md:text-4xl font-semibold text-white">
          Today&apos;s Prayer Times
        </h3>
        <button
          type="button"
          onClick={() => setIs24Hour(!is24Hour)}
          className="text-white/70 border px-3 py-1 rounded hover:bg-white/10 transition"
          aria-label="Toggle clock format"
        >
          {is24Hour ? "12H" : "24H"}
        </button>
      </div>

      <div className="text-xl md:text-2xl">
        <p className="text-white/60 italic mb-2">{gregorian}</p>
        <p className="text-white/80 font-medium mb-2">{hijri}</p>
        <p className="text-white mb-4 font-mono">{formattedClock}</p>
      </div>

      {prayerTimes ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-2xl md:text-3xl">
          {PRAYER_ORDER.map((name) => {
            const isNext = name === upcomingPrayer;
            const countdown = isNext
              ? getCountdown(prayerTimes[name], clock)
              : "";

            return (
              <motion.div
                key={name}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className={`relative px-4 py-4 rounded-xl border shadow-md backdrop-blur-sm flex flex-col justify-center items-center ${
                  isNext
                    ? "bg-amber-500/20 border-amber-400 shadow-lg ring-2 ring-amber-400/60"
                    : "bg-white/10 border-white/10"
                }`}
              >
                {isNext && (
                  <span className="absolute top-1 right-2 bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded">
                    Next
                  </span>
                )}
                <p className="text-white/70 tracking-wide">{name}</p>
                <p className="font-semibold text-white mt-1 text-3xl md:text-4xl">
                  {is24Hour
                    ? convertTo24(prayerTimes[name])
                    : prayerTimes[name]}
                </p>
                {isNext && countdown && (
                  <p className="text-lg md:text-xl text-amber-300 mt-1">
                    {countdown}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-white/60 italic animate-pulse">
          Loading prayer times...
        </p>
      )}
    </motion.div>
  );
}

// Utility Functions
function convertTo24(timeStr) {
  try {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier?.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (modifier?.toLowerCase() === "am" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  } catch {
    return timeStr;
  }
}

function getCountdown(timeStr, now) {
  try {
    const [h, m] = convertTo24(timeStr).split(":").map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    const diff = Math.max(0, target.getTime() - now.getTime());
    const mins = Math.floor(diff / (1000 * 60));
    const hrs = Math.floor(mins / 60);

    return hrs > 0
      ? `in ${hrs}h ${mins % 60}m`
      : mins > 0
      ? `in ${mins} minutes`
      : "soon";
  } catch {
    return "";
  }
}
