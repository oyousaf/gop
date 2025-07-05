"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import moment from "moment-hijri";
import Live from "./Live";

export default function Makkah() {
  const [videoId, setVideoId] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [clock, setClock] = useState(new Date());
  const [location, setLocation] = useState({
    city: "Makkah",
    country: "Saudi Arabia",
  });
  const [is24Hour, setIs24Hour] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [upcomingPrayer, setUpcomingPrayer] = useState("");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          "/api/youtube?channelId=UCqtGJe9AnRfq5wwjk27VsoQ"
        );
        const data = await res.json();
        if (data.videoId) setVideoId(data.videoId);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchVideo();
  }, []);

  useEffect(() => {
    const fetchLocationAndTimes = async () => {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();
        const city = ipData.city || "Makkah";
        const country = ipData.country_name || "Saudi Arabia";

        setLocation({ city, country });

        const prayerRes = await fetch(
          `/api/prayer-times?city=${city}&country=${country}`
        );
        const timings = await prayerRes.json();

        if (timings && !timings.error) {
          setPrayerTimes(timings);
        } else {
          console.warn("Prayer timing error:", timings);
        }
      } catch (err) {
        console.error("Location/Prayer fetch error:", err);
      }
    };

    fetchLocationAndTimes();
  }, []);

  // Detect upcoming prayer time
  useEffect(() => {
    if (!prayerTimes) return;

    const ordered = ["Fajr", "Sunrise", "Dhuhr", "'Asr", "Maghrib", "Isha"];
    const now = new Date();

    for (let name of ordered) {
      const timeStr = convertTo24(prayerTimes[name]);
      const [h, m] = timeStr.split(":").map(Number);
      const time = new Date();
      time.setHours(h, m, 0, 0);

      if (time > now) {
        setUpcomingPrayer(name);
        return;
      }
    }
    // If all times passed, fallback to first of next day
    setUpcomingPrayer("Fajr");
  }, [prayerTimes, clock]);

  if (!hasMounted) return null;

  const gregorian = moment(clock).locale("en").format("dddd, Do MMMM YYYY");
  const hijri = moment(clock).locale("ar-SA").format("iD iMMMM iYYYY");
  const formattedClock = is24Hour
    ? clock.toLocaleTimeString("en-GB")
    : clock.toLocaleTimeString("en-US");

  return (
    <section id="makkah" className="relative py-16 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto flex flex-col justify-center items-center h-full z-10 px-4 text-center"
      >
        <motion.h2
          className="md:text-5xl text-3xl font-bold mb-6 p-3 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Live from Makkah al-Mukarramah
        </motion.h2>

        <div className="w-full aspect-video relative mb-8 rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10">
          {videoId ? (
            <Live videoId={videoId} />
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <p className="text-white/80 text-lg animate-pulse">
                No video available at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Prayer Times */}
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
              onClick={() => setIs24Hour(!is24Hour)}
              className="text-white/70 border px-3 py-1 rounded hover:bg-white/10 transition"
            >
              {is24Hour ? "12H" : "24H"}
            </button>
          </div>

          {/* Date & Time */}
          <motion.div className="text-xl md:text-2xl">
            <p className="text-white/60 italic mb-2">{gregorian}</p>
            <p className="text-white/80 font-medium mb-2">{hijri}</p>
            <p className="text-white mb-4 font-mono">{formattedClock}</p>
          </motion.div>

          {prayerTimes ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-2xl md:text-3xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
            >
              {["Fajr", "Sunrise", "Dhuhr", "'Asr", "Maghrib", "Isha"].map(
                (name) => (
                  <motion.div
                    key={name}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative px-4 py-3 rounded-xl border shadow-md backdrop-blur-sm transition-all ${
                      name === upcomingPrayer
                        ? "bg-white/20 border-white/30 shadow-lg animate-pulse ring-2 ring-white/50"
                        : "bg-white/10 border-white/10"
                    }`}
                  >
                    <p className="text-white/70 tracking-wide">{name}</p>
                    <p className="font-semibold text-white mt-1">
                      {is24Hour
                        ? convertTo24(prayerTimes[name])
                        : prayerTimes[name]}
                    </p>
                  </motion.div>
                )
              )}
            </motion.div>
          ) : (
            <p className="text-white/60 italic animate-pulse">
              Loading prayer times...
            </p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

// Convert 12h time string to 24h format
function convertTo24(timeStr) {
  try {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier?.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (modifier?.toLowerCase() === "am" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  } catch {
    return timeStr;
  }
}
