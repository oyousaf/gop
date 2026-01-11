"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment-hijri";
import { socialLinks } from "../utils/constants";

const getIslamicDate = () => moment().format("iD iMMMM iYYYY");

export default function Footer() {
  const [islamicDate, setIslamicDate] = useState("");

  useEffect(() => {
    setIslamicDate(getIslamicDate());
  }, []);

  return (
    <footer className="bg-background text-white py-10">
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
            priority={false}
            className="object-contain"
          />
          <span>Free Palestine 🍉</span>
        </div>

        {/* Islamic date */}
        <p className="text-lg opacity-90">{islamicDate}</p>

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
