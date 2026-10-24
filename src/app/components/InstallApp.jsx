"use client";

import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";

/* "Install app" button, shown only where the browser offers installation
   (Chromium on desktop/Android) and the site isn't already installed. */
export default function InstallApp({ className = "" }) {
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    const onInstalled = () => setPrompt(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!prompt) return null;

  const install = async () => {
    prompt.prompt();
    await prompt.userChoice.catch(() => {});
    setPrompt(null);
  };

  return (
    <button
      type="button"
      onClick={install}
      className={`inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-[filter] hover:brightness-105 ${className}`}
    >
      <FiDownload aria-hidden="true" /> Install app
    </button>
  );
}
