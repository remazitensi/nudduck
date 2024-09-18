module.exports = {
  printWidth: 200,
  endOfLine: 'auto',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  jsxSingleQuote: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  parser: 'typescript',
  plugins: ['prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.css',
      options: {
        parser: 'css',
      },
    },
  ],
};
