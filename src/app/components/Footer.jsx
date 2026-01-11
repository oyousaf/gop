"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { socialLinks } from "../utils/constants";

const getIslamicDate = () => {
  return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date())
    .replace(/\s?هـ$/, "");
};

export default function Footer() {
  const [islamicDate, setIslamicDate] = useState("");

  useEffect(() => {
    setIslamicDate(getIslamicDate());
  }, []);

  return (
    <footer className="bg-background text-white py-10 border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
        {/* Brand */}
        <p className="text-3xl font-semibold tracking-wide font-arabic">
          &copy; {new Date().getFullYear()} حدائق الجنة
        </p>

        {/* Solidarity */}
        <div className="flex items-center justify-center gap-2 text-xl">
          <Image
            src="/images/palestineflag.png"
            alt="Palestine flag"
            width={24}
            height={24}
            className="object-contain"
          />
          <span>Free Palestine 🍉</span>
        </div>

        {/* Islamic date */}
        <p className="text-xl md:text-2xl font-semibold font-arabic opacity-95">
          {islamicDate}
        </p>

        {/* Social */}
        <div className="flex justify-center gap-6 pt-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${link.name}`}
              className="text-2xl transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
