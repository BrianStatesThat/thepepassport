import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pe-blue": "#1e88e5",
        "ocean-blue": "#0d7bb8",
        "sunset-orange": "#fb8c00",
        "warm-orange": "#f57c00",
        "beach-sand": "#f5f5f0",
        "soft-beige": "#faf8f3",
        "dark-gray": "#333333",
        "light-gray": "#666666",
      },
      fontFamily: {
        poppins: ["var(--font-poppins, system-ui)", "sans-serif"],
        inter: ["var(--font-inter, system-ui)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-coastal": "linear-gradient(135deg, #1e88e5 0%, #0d7bb8 100%)",
        "gradient-sunset": "linear-gradient(135deg, #fb8c00 0%, #f57c00 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
