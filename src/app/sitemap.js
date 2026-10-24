import { SITE } from "./lib/seo";

export default function sitemap() {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      images: [`${SITE.url}${SITE.ogImage}`],
    },
  ];
}
