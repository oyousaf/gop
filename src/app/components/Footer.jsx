import Image from "next/image";
import { navLinks, socialLinks } from "../utils/constants";
import HijriDate from "./HijriDate";
import InstallApp from "./InstallApp";

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-[oklch(0.17_0.016_58)] text-white">
      <div aria-hidden="true" className="pattern-star absolute inset-0 opacity-[0.04]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <Image src="/logo.png" alt="حدائق الجنة" width={210} height={70} className="h-12 w-auto" />
          <p className="mt-5 max-w-sm font-display text-2xl italic leading-snug text-white/80">
            Reviving the Ummah through sacred Islamic knowledge.
          </p>
          <HijriDate className="mt-6 text-left font-arabic-display text-xl text-accent" />
          <InstallApp className="mt-6" />
        </div>

        {/* Sections */}
        <nav aria-label="Footer">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-white/50">Explore</p>
          <ul className="space-y-2.5">
            {navLinks.map((n) => (
              <li key={n.id}>
                <a href={n.href} className="text-white/75 transition-colors hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social */}
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-white/50">Follow</p>
          <div className="flex gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${link.name}`}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/8 ring-1 ring-white/10 transition-colors hover:bg-white/16
                  [&_svg]:h-5 [&_svg]:w-5"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-white/60">
          <p>
            &copy; {new Date().getFullYear()} <span lang="ar">حدائق الجنة</span>
          </p>
          <p className="inline-flex items-center gap-2">
            <Image
              src="/images/palestineflag.png"
              alt=""
              width={24}
              height={24}
              className="h-4 w-auto"
            />
            Free Palestine 🍉
          </p>
        </div>
      </div>
    </footer>
  );
}
