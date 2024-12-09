"use client";

import { useEffect } from "react";
import ReactGA from "react-ga4";

const TRACKING_ID = "G-ZYK38288LH";

export default function GA() {
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  return null;
}
