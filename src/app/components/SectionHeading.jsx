/* Consistent section header: gold eyebrow with its Arabic name, a display
   serif title and an optional lede. */
export default function SectionHeading({
  id,
  eyebrow,
  arabic,
  title,
  lede,
  align = "center",
  className = "",
}) {
  const centered = align === "center";

  return (
    <header
      data-reveal
      className={`mb-12 md:mb-16 ${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
    >
      {(eyebrow || arabic) && (
        <p
          className={`mb-4 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-accent-text ${
            centered ? "justify-center" : ""
          }`}
        >
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
          {eyebrow}
          {arabic && (
            <span lang="ar" className="font-arabic-display text-lg normal-case tracking-normal">
              {arabic}
            </span>
          )}
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
        </p>
      )}

      <h2
        id={id}
        className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl"
      >
        {title}
      </h2>

      {lede && (
        <p className="mt-5 text-lg leading-relaxed text-ink-muted md:text-xl">{lede}</p>
      )}
    </header>
  );
}
