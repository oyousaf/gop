import { SITE } from "./lib/seo";

export default function manifest() {
  return {
    id: "/",
    name: `${SITE.name} — ${SITE.nameEn}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#221a14",
    theme_color: "#221a14",
    lang: "en-GB",
    dir: "ltr",
    categories: ["lifestyle", "education", "news"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Prayer times", short_name: "Salaah", url: "/#prayer-times" },
      { name: "Watch live", short_name: "Live", url: "/#live" },
      { name: "Hadith", url: "/#hadith" },
    ],
  };
}
