export const metadata = {
  title: "حدائق الجنة",
  description: "Reviving the Ummah via sacred Islamic knowledge.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb">
      <body>{children}</body>
    </html>
  );
}
