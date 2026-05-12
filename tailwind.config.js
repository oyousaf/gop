/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        primary: "#9d8770",
        accent: "#c4ac92",
        muted: "#bba58d",
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
