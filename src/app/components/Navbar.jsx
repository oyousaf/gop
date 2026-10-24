"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

import { navLinks, socialLinks } from "../utils/constants";
import { formatCountdown, usePrayer } from "./PrayerProvider";

const SECTION_IDS = navLinks.map((n) => n.href.slice(1));

/* Which section is in the middle band of the viewport */
function useActiveSection() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const visible = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        setActive(SECTION_IDS.find((id) => visible.get(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return active;
}

function NextPrayerChip({ className = "" }) {
  const prayer = usePrayer();
  const next = prayer?.upcoming;
  if (!next) return null;

  return (
    <a
      href="#prayer-times"
      className={`items-center gap-2 rounded-full bg-white/8 py-1.5 pl-2 pr-3.5 text-sm text-white/90 ring-1 ring-white/10
        transition-colors hover:bg-white/14 ${className}`}
    >
      <span aria-hidden="true" className="relative grid h-2 w-2 place-items-center">
        <span className="absolute h-2 w-2 animate-ping rounded-full bg-accent/60 motion-reduce:hidden" />
        <span className="h-2 w-2 rounded-full bg-accent" />
      </span>
      <span>
        {next.name}{" "}
        <span className="tabular-nums text-white/60">
          {formatCountdown(next.inSeconds, { short: true })}
        </span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [pill, setPill] = useState(null);
  const menuRef = useRef(null);
  const listRef = useRef(null);
  const active = useActiveSection();

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 24);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slide the active pill under the current link
  const measure = useCallback(() => {
    const link = active && listRef.current?.querySelector(`[data-id="${active}"]`);
    setPill(link ? { x: link.offsetLeft, w: link.offsetWidth } : null);
  }, [active]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    if (!listRef.current) return;
    const ro = new ResizeObserver(measure);
    ro.observe(listRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // Native modal <dialog>: focus trap, Escape and inert background come free
  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => menuRef.current?.close();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-100 flex justify-center px-3 pt-3">
      <nav
        aria-label="Main navigation"
        className={`pointer-events-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10
          bg-[oklch(0.19_0.018_58/0.72)] text-white shadow-[0_12px_40px_-12px_oklch(0.1_0.02_58/0.5)] backdrop-blur-xl backdrop-saturate-150
          transition-[padding,background-color] duration-500
          ${scrolled ? "py-1.5 pl-3 pr-2 bg-[oklch(0.19_0.018_58/0.86)]" : "py-2.5 pl-4 pr-3"}`}
      >
        <a href="#hero" aria-label="حدائق الجنة — home" className="shrink-0 rounded-full">
          <Image
            src="/logo.png"
            alt=""
            width={210}
            height={70}
            priority
            sizes="120px"
            className={`w-auto transition-[height] duration-500 ${scrolled ? "h-8" : "h-10"}`}
          />
        </a>

        {/* Desktop links with sliding active pill */}
        <ul ref={listRef} className="relative hidden items-center md:flex">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 rounded-full bg-white/12 transition-[transform,width,opacity] duration-500"
            style={{
              width: pill?.w ?? 0,
              transform: `translateX(${pill?.x ?? 0}px)`,
              opacity: pill ? 1 : 0,
            }}
          />
          {navLinks.map((n) => {
            const isActive = active === n.href.slice(1);
            return (
              <li key={n.id}>
                <a
                  href={n.href}
                  data-id={n.href.slice(1)}
                  aria-current={isActive ? "location" : undefined}
                  aria-label={n.type ? n.label : undefined}
                  className={`flex h-10 items-center rounded-full px-4 text-[15px] font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/65 hover:text-white"
                  }`}
                >
                  {n.type === "image" ? (
                    <Image src={n.src} alt="" width={22} height={22} className="h-4 w-auto" />
                  ) : (
                    n.label
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <NextPrayerChip className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            aria-haspopup="dialog"
            className="grid h-10 w-10 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/10 md:hidden"
          >
            <FiMenu aria-hidden="true" className="text-xl" />
          </button>
        </div>
      </nav>

      {/* Mobile menu (bottom sheet) */}
      <dialog
        ref={menuRef}
        aria-label="Menu"
        onClick={(e) => e.target === e.currentTarget && closeMenu()}
        className="sheet pointer-events-auto mx-2 mb-2 mt-auto w-[calc(100%-1rem)] max-w-none rounded-[2rem] border border-white/10
          bg-[oklch(0.19_0.018_58/0.94)] p-0 text-white backdrop-blur-xl md:hidden"
      >
        <div className="relative px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
          <div aria-hidden="true" className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/25" />
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            <FiX aria-hidden="true" />
          </button>

          <NextPrayerChip className="mb-4 inline-flex" />

          <ul className="flex flex-col">
            {navLinks.map((n) => {
              const isActive = active === n.href.slice(1);
              return (
                <li key={n.id}>
                  <a
                    href={n.href}
                    onClick={closeMenu}
                    aria-current={isActive ? "location" : undefined}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-3xl transition-colors ${
                      isActive ? "bg-white/10 text-white" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {n.label}
                    {n.type === "image" && (
                      <Image src={n.src} alt="" width={22} height={22} className="h-5 w-auto" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex gap-3 border-t border-white/10 pt-5">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl transition-colors hover:bg-white/20 [&_svg]:h-5 [&_svg]:w-5"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </dialog>
    </header>
  );
}
