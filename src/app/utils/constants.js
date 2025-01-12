import Image from "next/image";
import { PiMosqueFill } from "react-icons/pi";

export const navLinks = [
  { id: "home", name: "Home", href: "/hero" },
  { id: "makkah", name: "🕋", href: "/makkah" },
  { id: "madinah", name: "🕌", href: "/madinah" },
  { id: "aqsa", name: <PiMosqueFill />, href: "/aqsa" },
  { id: "hadith", name: "Hadith", href: "/hadith" },
  { id: "news", name: "News", href: "/news" },
  {
    id: "divestment",
    name: (
      <Image
        src="/images/palestineflag.png"
        alt="Palestine Flag"
        width={30}
        height={30}
        className="object-contain w-auto h-auto"
      />
    ),
    href: "/divestment",
  },
];

import { BsTwitterX, BsYoutube } from "react-icons/bs";

export const socialLinks = [
  {
    name: "Twitter",
    icon: <BsTwitterX size={30} />,
    url: "https://twitter.com/oyousaf_",
  },
  {
    name: "YouTube",
    icon: <BsYoutube size={30} />,
    url: "https://www.youtube.com/@oyousaf_",
  },
];
