import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12141C",
        "ink-soft": "#1B1E2B",
        paper: "#FBF8F2",
        "paper-dim": "#F0EAD9",
        "paper-line": "#E4DDC8",
        gold: "#C79A3D",
        "gold-deep": "#9C7527",
        "gold-soft": "#EFE0BA",
        teal: "#2F8F7A",
        "teal-soft": "#DCEEE9",
        danger: "#B3452F",
        "danger-soft": "#F5E1DB",
        muted: "#736C5C",
        "muted-dark": "#A7ACC0",
      },
      fontFamily: {
        display: ['"El Messiri"', "serif"],
        body: ["Cairo", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
