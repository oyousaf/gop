/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        background: "#173f3b",
        primary: "#173f3b",
        accent: "#f6c453",
        muted: "#a8c5bd",
        dark: "#2e2e2e",
        light: "#f4f4f4",
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
