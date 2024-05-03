/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      xs: "1px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: ["pastel"],
  },
  fontFamily: {
    sans: ["Montserrat", "Helvetica", "sans-serif"],
    serif: ["Times", "serif"],
  },
};
