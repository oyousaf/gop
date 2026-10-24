"use client";

import { useEffect } from "react";

/* Registers /sw.js in production only, so local dev never serves stale cached files */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((err) => console.error("Service worker registration failed:", err));
  }, []);

  return null;
}
