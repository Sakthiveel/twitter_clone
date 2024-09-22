/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colorsk: {
      defaultBC: "rgb(47, 51, 54)",
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
