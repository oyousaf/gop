import Image from "next/image";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";
import HeroNextPrayer from "./HeroNextPrayer";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-svh items-end overflow-hidden px-4 pb-16 pt-32 text-white md:pb-20"
    >
      <Image
        src="/images/hero-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 scale-105 object-cover"
        draggable={false}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.15_0.02_58/0.55)_0%,oklch(0.15_0.02_58/0.25)_35%,oklch(0.15_0.02_58/0.85)_100%)]"
      />

      <div className="mx-auto grid w-full max-w-6xl items-end gap-12 lg:grid-cols-[1fr_auto]">
        <div data-reveal className="max-w-3xl">
          <p lang="ar" className="font-arabic-display text-2xl text-accent">
            حدائق الجنة
          </p>

          <h1 className="mt-4">
            <span lang="ar" dir="rtl" className="block text-left font-arabic-display text-5xl leading-[1.3] md:text-7xl">
              إحياء الأمة بعلم الدين المقدس
            </span>
            <span className="mt-4 block font-display text-3xl italic leading-tight text-white/90 md:text-5xl">
              Reviving the Ummah through sacred Islamic knowledge
            </span>
          </h1>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#prayer-times"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-ink transition-[filter] hover:brightness-105"
            >
              Today’s prayer times
              <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#live"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red-500" />
              Watch live
            </a>
          </div>
        </div>

        <div data-reveal style={{ "--reveal-delay": "150ms" }}>
          <HeroNextPrayer />
        </div>
      </div>

      <a
        href="#welcome"
        aria-label="Scroll to content"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 animate-[bob_2.4s_ease-in-out_infinite] text-white/60 transition-colors
          hover:text-white motion-reduce:animate-none md:block"
      >
        <FiArrowDown aria-hidden="true" size={22} />
      </a>
    </section>
  );
}
