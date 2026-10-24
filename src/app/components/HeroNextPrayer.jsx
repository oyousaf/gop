"use client";

import { formatCountdown, formatTime, usePrayer } from "./PrayerProvider";

export default function HeroNextPrayer() {
  const { data, upcoming, is24Hour, hijri } = usePrayer();
  const ready = data && upcoming;

  return (
    <a
      href="#prayer-times"
      className="group block min-w-64 rounded-3xl border border-white/15 bg-black/30 p-5 text-white backdrop-blur-md transition-colors hover:bg-black/40"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-white/60">
        Next salaah{data?.location ? ` · ${data.location.split(",")[0]}` : ""}
      </p>
      {ready ? (
        <p className="mt-2 flex items-baseline justify-between gap-6">
          <span className="font-display text-4xl">{upcoming.name}</span>
          <span className="text-right">
            <span className="block text-xl tabular-nums text-accent">
              {formatTime(data.timings[upcoming.name], is24Hour)}
            </span>
            <span className="text-sm text-white/70">{formatCountdown(upcoming.inSeconds)}</span>
          </span>
        </p>
      ) : (
        <span aria-hidden="true" className="mt-3 block h-10 animate-pulse rounded-xl bg-white/10" />
      )}
      <p lang="ar" dir="rtl" className="mt-3 border-t border-white/10 pt-3 text-left font-arabic text-white/75">
        {hijri || " "}
      </p>
    </a>
  );
}
