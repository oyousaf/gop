/* Jade band with a Rub el Hizb lattice, used to punctuate structural beats
   between content sections (Welcome banner, Knowledge banner). */
export default function SectionDivider({ id, label, lines, className = "" }) {
  return (
    <section id={id} aria-label={label} className={`px-4 ${className}`}>
      <div
        data-reveal
        className="relative mx-auto flex min-h-64 max-w-6xl items-center justify-center overflow-hidden rounded-[2rem] bg-jade-deep
          px-6 py-14 text-white shadow-[0_30px_80px_-40px_oklch(0.2_0.05_190/0.6)] md:min-h-80"
      >
        <div aria-hidden="true" className="pattern-star absolute inset-0 opacity-[0.08]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.2_0.04_190/0.7)_100%)]"
        />

        <h2 className="sr-only">{label}</h2>

        <div lang="ar" dir="rtl" className="relative text-center font-arabic-display leading-[1.4]">
          {lines.map((line, i) => (
            <span
              key={line}
              data-reveal
              style={{ "--reveal-delay": `${200 + i * 150}ms` }}
              className={`block ${i === 0 ? "text-5xl md:text-7xl" : "mt-2 text-3xl text-white/80 md:text-5xl"}`}
            >
              {line}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
