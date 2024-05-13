/** @type {import("prettier").Config} */
const config = {
  printWidth: 86,
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  plugins: [
    // https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/207#issuecomment-1698071122
    'prettier-plugin-tailwindcss',
  ],
}

export default config
