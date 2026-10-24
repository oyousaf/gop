"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export const PRAYER_ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const STORAGE_KEY = "gop:prayer-settings";

// Aladhan calculation method ids; "" lets the API choose by location
export const METHODS = [
  ["", "Automatic (by location)"],
  ["3", "Muslim World League"],
  ["4", "Umm al-Qura, Makkah"],
  ["2", "ISNA (North America)"],
  ["15", "Moonsighting Committee"],
  ["1", "Karachi"],
  ["5", "Egyptian Authority"],
  ["13", "Diyanet (Turkey)"],
  ["12", "UOIF (France)"],
  ["11", "MUIS (Singapore)"],
  ["16", "Dubai"],
];

const readSettings = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const writeSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage unavailable (private mode); settings last for this visit only
  }
};

/* "Europe/London" → "London"; skips generic zones like UTC / Etc/GMT+1 */
function timezoneCity() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (!zone.includes("/") || zone.startsWith("Etc/")) return null;
    return zone.split("/").pop().replace(/_/g, " ");
  } catch {
    return null;
  }
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/* Seconds since midnight in the prayer location's timezone */
function secondsInZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type)?.value || 0);
  return get("hour") * 3600 + get("minute") * 60 + get("second");
}

/* "2026-10-24" in the prayer location's timezone */
const dateInZone = (date, timeZone) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

function nextPrayer(today, tomorrow, nowSeconds) {
  for (const name of PRAYER_ORDER) {
    const at = toMinutes(today[name]) * 60;
    if (at > nowSeconds) return { name, inSeconds: at - nowSeconds };
  }
  // After Isha: count down to tomorrow's Fajr
  return {
    name: "Fajr",
    inSeconds: 86400 - nowSeconds + toMinutes((tomorrow || today).Fajr) * 60,
  };
}

/* Last good response, so times appear instantly on return visits and offline */
const CACHE_KEY = "gop:prayer-cache";

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable: the live response still shows this visit
  }
};

/* Shows a reminder via the service worker (works with the tab in the
   background), falling back to a page notification in development */
async function showReminder(name, location) {
  const title = `${name} · time for salaah`;
  const options = {
    body: location ? `Prayer time in ${location}` : "It's time to pray",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: "salaah",
    renotify: true,
  };
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) return registration.showNotification(title, options);
    new Notification(title, options);
  } catch {
    // Notifications blocked or unsupported
  }
}

export function formatCountdown(totalSeconds, { short = false } = {}) {
  const mins = Math.ceil(totalSeconds / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${short ? "" : "in "}${hrs}h ${mins % 60}m`;
  if (mins > 1) return short ? `${mins}m` : `in ${mins} minutes`;
  return "now";
}

export function formatTime(hhmm, is24Hour) {
  if (is24Hour) return hhmm;
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

const PrayerContext = createContext(null);

export const usePrayer = () => useContext(PrayerContext);

/* Owns location detection, the timings fetch and the ticking clock, so the
   navbar chip, hero and prayer section all share one source of truth. */
export default function PrayerProvider({ children }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(null);
  const [settings, setSettings] = useState(null);
  const [locating, setLocating] = useState(false);
  // Detected location for this visit (not saved, so it follows the viewer as they travel)
  const [auto, setAuto] = useState(null);

  const [offline, setOffline] = useState(false);
  const lastUpcoming = useRef(null);

  useEffect(() => {
    setSettings(readSettings());
    const cached = readCache();
    if (cached?.days) setData(cached);
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const hasSavedLocation = Boolean(settings?.address || settings?.coords);

  // Already-granted device location is used silently, without a prompt
  useEffect(() => {
    if (!settings || hasSavedLocation) return;
    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((status) => {
        if (status.state !== "granted") return;
        navigator.geolocation.getCurrentPosition(
          ({ coords }) =>
            setAuto({ coords: { lat: coords.latitude, lng: coords.longitude } }),
          () => {},
          { maximumAge: 3600000, timeout: 10000 },
        );
      })
      .catch(() => {});
  }, [settings, hasSavedLocation]);

  // No IP location from the server (e.g. local dev): use the browser's timezone
  // city straight away, then ask for precise device location
  useEffect(() => {
    if (hasSavedLocation || auto || data?.source !== "default") return;
    const city = timezoneCity();
    if (city) setAuto({ address: city });
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setAuto({ coords: { lat: coords.latitude, lng: coords.longitude } }),
      () => {},
      { maximumAge: 3600000, timeout: 15000 },
    );
  }, [data?.source, hasSavedLocation, auto]);

  useEffect(() => {
    if (!settings) return;
    const location = hasSavedLocation ? settings : auto || {};
    const params = new URLSearchParams();
    if (location.address) params.set("address", location.address);
    if (location.coords) {
      params.set("lat", location.coords.lat.toFixed(2));
      params.set("lng", location.coords.lng.toFixed(2));
    }
    if (settings.method) params.set("method", settings.method);

    const controller = new AbortController();
    setError(null);
    fetch(`/api/prayer-times?${params}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
        // The service worker may have answered from cache, so trust the browser
        setOffline(!navigator.onLine);
        writeCache(json);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        // Keep showing cached times when the network is down
        if (readCache()?.days) setOffline(true);
        else setError(err.message);
      });

    return () => controller.abort();
  }, [settings, auto, hasSavedLocation]);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      writeSettings(next);
      return next;
    });
  }, []);

  const locateMe = useCallback(
    () =>
      new Promise((resolve) => {
        if (!navigator.geolocation) {
          setError("Location isn't available in this browser.");
          return resolve(false);
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setLocating(false);
            // Back to automatic: with permission granted, later visits re-detect silently
            setAuto({ coords: { lat: coords.latitude, lng: coords.longitude } });
            updateSettings({ coords: null, address: null });
            resolve(true);
          },
          () => {
            setLocating(false);
            setError(
              "Location access was blocked. Allow it in your browser, or search for a city.",
            );
            resolve(false);
          },
          { maximumAge: 3600000, timeout: 10000 },
        );
      }),
    [updateSettings],
  );

  const setAddress = useCallback(
    (address) => updateSettings({ address, coords: null }),
    [updateSettings],
  );

  // Reminders need permission, asked only when the visitor turns them on
  const setReminders = useCallback(
    async (enabled) => {
      if (!enabled) return updateSettings({ notify: false });
      if (!("Notification" in window)) {
        setError("Notifications aren't supported in this browser.");
        return;
      }
      const permission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();
      if (permission === "granted") updateSettings({ notify: true });
      else setError("Notifications are blocked. Allow them in your browser settings.");
    },
    [updateSettings],
  );

  const is24Hour = settings?.is24Hour ?? true;
  const timeZone = data?.timezone;
  const nowSeconds = now && timeZone ? secondsInZone(now, timeZone) : null;

  // Pick today's and tomorrow's timings from the cached calendar
  const todayKey = now && timeZone ? dateInZone(now, timeZone) : null;
  const dayIndex = data?.days?.findIndex((d) => d.date === todayKey) ?? -1;
  const today = dayIndex >= 0 ? data.days[dayIndex].timings : null;
  const tomorrow = dayIndex >= 0 ? data.days[dayIndex + 1]?.timings : null;

  const upcoming =
    today && nowSeconds !== null ? nextPrayer(today, tomorrow, nowSeconds) : null;

  // When the countdown rolls over, the prayer it was counting to has begun
  useEffect(() => {
    const prev = lastUpcoming.current;
    lastUpcoming.current = upcoming;
    if (!settings?.notify || !prev || !upcoming || prev.name === upcoming.name) return;
    // Background tabs tick about once a minute, so allow a little slack
    if (prev.inSeconds > 90 || prev.name === "Sunrise") return;
    showReminder(prev.name, data?.location?.split(",")[0]);
  }, [upcoming, settings?.notify, data?.location]);

  const zoned = (locale, fmt) =>
    now && timeZone
      ? new Intl.DateTimeFormat(locale, { timeZone, ...fmt }).format(now)
      : "";

  const value = {
    // `timings` is today's row, so consumers can keep reading data.timings
    data: data && today ? { ...data, timings: today } : null,
    error,
    offline,
    setReminders,
    settings,
    locating,
    is24Hour,
    upcoming,
    nowSeconds,
    gregorian: zoned("en-GB", { dateStyle: "full" }),
    hijri: zoned("ar-SA-u-ca-islamic-umalqura-nu-arab", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    clock: zoned(is24Hour ? "en-GB" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24Hour,
    }),
    updateSettings,
    locateMe,
    setAddress,
  };

  return <PrayerContext.Provider value={value}>{children}</PrayerContext.Provider>;
}
