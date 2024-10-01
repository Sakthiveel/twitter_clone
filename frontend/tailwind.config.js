/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      defaultBC: "rgb(47, 51, 54)",
      grey: "rgb(113, 118, 123)",
      blue: {
        primary: "rgb(29, 155, 240)",
        hover: "rgb(12, 117, 188)",
      },
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
