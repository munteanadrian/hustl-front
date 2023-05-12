// tailwind.config.js

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#121212",

        turqoise: "#1abc9c",
        greenSea: "#16a085",

        emerald: "#2ecc71",
        nephritis: "#27ae60",

        peterRiver: "#3498db",
        belizeHole: "#2980b9",

        amethyst: "#9b59b6",
        wisteria: "#8e44ad",

        wetAsphalt: "#34495e",
        midnight: "#2c3e50",

        sunFlower: "#f1c40f",
        orange: "#f39c12",

        carrot: "#e67e22",
        pumpkin: "#d35400",

        alizarin: "#e74c3c",
        pomegranate: "#c0392b",

        clouds: "#ecf0f1",
        silver: "#bdc3c7",

        concrete: "#95a5a6",
        asbestos: "#7f8c8d",
      },
      fontFamily: {
        Regular: ["DMSans-Regular"],
        Medium: ["DMSans-Medium"],
        Bold: ["DMSans-Bold"],
      },
    },
  },
  plugins: [],
};