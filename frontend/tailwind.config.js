/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aquifer: "#0D1B2A",
        ripple: "#47c9af",
        blessing: "#FDE68A",
        spiral: "#C084FC",
        portal: "#7DD3FC",
        seed: "#A7F3D0",
      },
    },
  },
  plugins: [],
};
