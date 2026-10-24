"use client";

import { useEffect } from "react";

/* One IntersectionObserver for every [data-reveal] element on the page,
   including ones rendered later (news, hadith pages, search results). */
export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const observe = (root) => {
      if (root.nodeType !== 1) return;
      if (root.matches("[data-reveal]:not([data-revealed])")) io.observe(root);
      root
        .querySelectorAll("[data-reveal]:not([data-revealed])")
        .forEach((el) => io.observe(el));
    };

    observe(document.body);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) m.addedNodes.forEach(observe);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
