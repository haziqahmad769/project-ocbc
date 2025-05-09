/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      "light",
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(39, 170, 225)",
          secondary: "rgb(24, 24, 24)",
        },
      },
    ],
  },
};
