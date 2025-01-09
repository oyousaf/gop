import { PiMosqueFill } from "react-icons/pi";

export const navLinks = [
    { name: "Home", href: "/hero" },
    { name: "🕋", href: "/makkah" },
    { name: "🕌", href: "/madinah" },
    { name: <PiMosqueFill />, href: "/aqsa" },
    { name: "Hadith", href: "/hadith" },
    { name: "News", href: "/news" },
  ];
  
import { BsTwitterX, BsYoutube } from "react-icons/bs"

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