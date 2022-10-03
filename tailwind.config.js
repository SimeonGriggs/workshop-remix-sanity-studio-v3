const defaultTheme = require('tailwindcss/defaultTheme')
const sanityUIColor = require('@sanity/color')

const sanityUIColorTailwindPalette = Object.keys(sanityUIColor.hues).reduce(
  (acc, hue) => {
    const hueTints = Object.keys(sanityUIColor.hues[hue]).reduce((palette, tint) => {
      return {...palette, [tint]: sanityUIColor[hue][tint].hex}
    }, {})

    return {...acc, [hue]: hueTints}
  },
  {
    black: sanityUIColor.black.hex,
    white: sanityUIColor.white.hex,
  }
)

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // <-- Added this "blob"
  ],
  theme: {
    fontFamily: {
      sans: ['Larsseit', ...defaultTheme.fontFamily.sans],
    },
    colors: sanityUIColorTailwindPalette,
  },
  plugins: [require('@tailwindcss/typography')],
}
