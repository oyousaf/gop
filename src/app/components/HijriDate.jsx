"use client";

import { useEffect, useState } from "react";

const format = () =>
  new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura-nu-arab", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date())
    .replace(/\s?هـ$/, "");

/* Rendered after mount so the date follows the viewer's own day, not the server's */
export default function HijriDate({ className }) {
  const [date, setDate] = useState("");

  useEffect(() => setDate(format()), []);

  return (
    <p className={className} dir="rtl" lang="ar">
      {date || " "}
    </p>
  );
}
