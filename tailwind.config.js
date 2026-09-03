/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        background: "#8f7a68",
        primary: "#8f7a68",
        accent: "#d8ad54",
        muted: "#cbb9a4",
        dark: "#3c332c",
        light: "#f6f0e8",
      },

      boxShadow: {
        soft: "0 2px 12px rgba(0, 0, 0, 0.08)",
        inset: "inset 0 1px 3px rgba(0, 0, 0, 0.06)",
      },
    },
  },

  plugins: [],
};

export default config;
