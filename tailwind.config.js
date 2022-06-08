module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    color: {
      "background": "#f7f4ef",
      "main": "black",
      "secondary": "#8492a6"
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: ['corporate'],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
}