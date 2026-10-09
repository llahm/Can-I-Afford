/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: { 50: "#FDFBF7", 100: "#FAF6F0", 200: "#F3ECE1", 300: "#E6DBC8" },
        cocoa: { 400: "#A68A71", 500: "#8C6D53", 600: "#6E5039", 700: "#593E2B", 800: "#4A3525", 900: "#2C1E16" }
      }
    }
  },
  plugins: []
};