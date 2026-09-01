import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0B0D10",
          900: "#101317",
          800: "#14171C",
          700: "#1B1F26",
          600: "#262A31",
        },
        ink: {
          100: "#EDEEF0",
          300: "#C7CBD1",
          500: "#9AA1AC",
          700: "#5B616B",
        },
        bronze: {
          400: "#DDA35D",
          500: "#C98A3D",
          600: "#A9702E",
        },
        signal: {
          green: "#6FA96C",
          amber: "#D9A441",
          red: "#C4574A",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
