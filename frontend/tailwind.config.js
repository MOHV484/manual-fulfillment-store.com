const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [path.join(__dirname, "./src/**/*.{js,ts,jsx,tsx,mdx}")],
  theme: {
    extend: {
      colors: {
        ink: "#0E0F13",
        "ink-soft": "#1B1C24",
        "ink-line": "rgba(255,255,255,0.08)",
        paper: "#FFFFFF",
        "paper-dim": "#F5F5F7",
        "paper-line": "#E7E7EC",
        orange: "#FF5B1F",
        "orange-deep": "#E14A12",
        "orange-soft": "#FFE4D6",
        teal: "#1FAE87",
        "teal-soft": "#DFF5EE",
        danger: "#E5484D",
        "danger-soft": "#FDE4E4",
        muted: "#6B6B76",
        "muted-dark": "#A0A0AC",
      },
      fontFamily: {
        display: ["Tajawal", "sans-serif"],
        body: ["Tajawal", "sans-serif"],
      },
    },
  },
  plugins: [],
};
