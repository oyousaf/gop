"use client";

import { useRef, useState } from "react";
import { FiMapPin, FiNavigation, FiSliders, FiX } from "react-icons/fi";
import SectionHeading from "./SectionHeading";
import {
  METHODS,
  PRAYER_ORDER,
  formatCountdown,
  formatTime,
  usePrayer,
} from "./PrayerProvider";

const ARABIC_NAMES = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const toSeconds = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h * 60 + m) * 60;
};

export default function PrayerTimes() {
  const {
    data,
    error,
    offline,
    setReminders,
    settings,
    locating,
    is24Hour,
    upcoming,
    nowSeconds,
    gregorian,
    hijri,
    clock,
    updateSettings,
    locateMe,
    setAddress,
  } = usePrayer();
  const [address, setAddressInput] = useState("");
  const settingsRef = useRef(null);

  const closeSettings = () => settingsRef.current?.hidePopover?.();

  const submitAddress = (e) => {
    e.preventDefault();
    const value = address.trim();
    if (!value) return;
    setAddress(value);
    closeSettings();
  };

  return (
    <section
      id="prayer-times"
      aria-labelledby="prayer-times-heading"
      className="relative mx-auto max-w-6xl px-4 py-24 md:py-32"
    >
      <SectionHeading
        id="prayer-times-heading"
        eyebrow="Salaah"
        arabic="الصلاة"
        title="Today’s prayer times"
      />

      <div
        data-reveal
        className="grid overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_30px_80px_-40px_oklch(0.2_0.03_58/0.45)] md:grid-cols-[1fr_1.15fr]"
      >
        {/* Focus: next prayer */}
        <div className="relative flex flex-col justify-between gap-10 bg-jade-deep p-8 text-white md:p-10">
          <div aria-hidden="true" className="pattern-star absolute inset-0 opacity-[0.07]" />

          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-white/80">
              <FiMapPin aria-hidden="true" />
              <span>{data?.location || "Finding your location…"}</span>
              {offline && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                  Offline · saved times
                </span>
              )}
            </p>
            <button
              type="button"
              popoverTarget="prayer-settings"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-white/90 transition-colors hover:bg-white/10"
            >
              <FiSliders aria-hidden="true" /> Settings
            </button>
          </div>

          <div className="relative" aria-live="polite">
            <p className="text-sm uppercase tracking-[0.18em] text-white/60">Next</p>
            {upcoming && data ? (
              <>
                <p className="mt-2 flex items-baseline gap-4">
                  <span className="font-display text-6xl md:text-7xl">{upcoming.name}</span>
                  <span lang="ar" className="font-arabic-display text-3xl text-white/70">
                    {ARABIC_NAMES[upcoming.name]}
                  </span>
                </p>
                <p className="mt-3 text-2xl tabular-nums text-accent">
                  {formatTime(data.timings[upcoming.name], is24Hour)}
                  <span className="text-white/70"> · {formatCountdown(upcoming.inSeconds)}</span>
                </p>
              </>
            ) : (
              <p className="mt-2 h-28 w-2/3 animate-pulse rounded-2xl bg-white/10" />
            )}
          </div>

          <div className="relative space-y-1">
            <p className="font-mono text-lg tabular-nums text-white/90">{clock || " "}</p>
            <p className="text-white/70">{gregorian || " "}</p>
            <p lang="ar" dir="rtl" className="text-left font-arabic text-lg text-white/80">
              {hijri || " "}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-4 md:p-6">
          {error && <p className="mb-3 px-4 pt-2 text-danger">{error}</p>}

          {data ? (
            <ol className="divide-y divide-line">
              {PRAYER_ORDER.map((name) => {
                const isNext = upcoming?.name === name;
                const isPast =
                  !isNext && nowSeconds !== null && toSeconds(data.timings[name]) <= nowSeconds;
                return (
                  <li
                    key={name}
                    aria-current={isNext ? "time" : undefined}
                    className={`relative flex items-center gap-4 rounded-2xl px-4 py-4 transition-colors duration-500 md:px-5 ${
                      isNext ? "bg-accent-soft" : ""
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-500 ${
                        isNext ? "bg-accent ring-4 ring-accent/25" : isPast ? "bg-line-strong" : "bg-ink-subtle/50"
                      }`}
                    />
                    <span className={`text-xl ${isPast ? "text-ink-subtle" : "text-ink"} ${isNext ? "font-semibold" : ""}`}>
                      {name}
                    </span>
                    <span lang="ar" className="font-arabic text-lg text-ink-subtle">
                      {ARABIC_NAMES[name]}
                    </span>
                    <span className="ml-auto flex items-center gap-3">
                      {isNext && (
                        <span className="hidden rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-ink sm:inline">
                          {formatCountdown(upcoming.inSeconds, { short: true })}
                        </span>
                      )}
                      <span
                        className={`text-2xl tabular-nums ${isPast ? "text-ink-subtle" : "text-ink"} ${isNext ? "font-semibold" : ""}`}
                      >
                        {formatTime(data.timings[name], is24Hour)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          ) : (
            !error && (
              <ul aria-hidden="true" className="space-y-2">
                {PRAYER_ORDER.map((n) => (
                  <li key={n} className="h-16 animate-pulse rounded-2xl bg-surface-2" />
                ))}
              </ul>
            )
          )}

          {data?.method && (
            <p className="px-4 pt-4 text-sm text-ink-subtle md:px-5">Calculation: {data.method}</p>
          )}
        </div>
      </div>

      {/* Settings (native popover: light-dismiss and Escape built in) */}
      <div
        ref={settingsRef}
        id="prayer-settings"
        popover="auto"
        aria-label="Prayer time settings"
        className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-3xl border border-line bg-surface p-6 text-ink shadow-2xl backdrop:bg-black/30 backdrop:backdrop-blur-sm"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-3xl">Settings</h3>
          <button
            type="button"
            onClick={closeSettings}
            aria-label="Close settings"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-2"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5">
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={() => locateMe().then((ok) => ok && closeSettings())}
            disabled={locating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <FiNavigation aria-hidden="true" />
            {locating ? "Locating…" : "Use my location"}
          </button>

          <form onSubmit={submitAddress} className="flex gap-2">
            <label htmlFor="prayer-address" className="sr-only">
              City or address
            </label>
            <input
              id="prayer-address"
              type="text"
              value={address}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Or search a city — e.g. Leeds, UK"
              autoComplete="address-level2"
              className="min-w-0 flex-1 rounded-full border border-line-strong bg-bg px-4 py-2.5 placeholder:text-ink-subtle"
            />
            <button
              type="submit"
              className="rounded-full border border-line-strong px-4 py-2.5 font-medium transition-colors hover:bg-surface-2"
            >
              Set
            </button>
          </form>

          <label className="block">
            <span className="mb-2 block text-sm text-ink-muted">Calculation method</span>
            <select
              value={settings?.method || ""}
              onChange={(e) => updateSettings({ method: e.target.value })}
              className="w-full rounded-full border border-line-strong bg-bg px-4 py-2.5"
            >
              {METHODS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-muted">Clock</span>
            <div role="group" aria-label="Clock format" className="inline-flex rounded-full bg-surface-2 p-1">
              {[
                [true, "24h"],
                [false, "12h"],
              ].map(([value, label]) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={is24Hour === value}
                  onClick={() => updateSettings({ is24Hour: value })}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    is24Hour === value ? "bg-surface text-ink shadow-sm" : "text-ink-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 border-t border-line pt-5">
            <span id="reminders-label">
              <span className="block text-sm text-ink">Prayer reminders</span>
              <span className="block text-xs text-ink-subtle">
                A notification at each prayer time while the site or app is open
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={Boolean(settings?.notify)}
              aria-labelledby="reminders-label"
              onClick={() => setReminders(!settings?.notify)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                settings?.notify ? "bg-accent" : "bg-surface-2 ring-1 ring-line-strong"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-1 left-1 h-5 w-5 rounded-full shadow transition-transform duration-300 ${
                  settings?.notify ? "translate-x-5 bg-accent-ink" : "bg-ink-subtle"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
