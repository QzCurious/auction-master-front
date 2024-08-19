import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  darkMode: 'selector',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [
    require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    plugin(({ addComponents }) => {
      addComponents({
        '.text-link': {
          '@apply underline underline-offset-2 hover:decoration-indigo-500': {},
        },
      })
    }),
  ],
}
export default config
