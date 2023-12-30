/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'prettier',
    'plugin:tailwindcss/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'tailwindcss'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
        trailingComma: 'es5',
        tabWidth: 2,
        printWidth: 120,
        semi: false,
        singleQuote: true,
        pluginSearchDirs: false,
        importOrder: [
          '<TYPES>',
          '<TYPES>^[.]',
          '',
          '^react',
          '',
          '^@next',
          '^next',
          '^next/.*$',
          '',
          '<BUILT_IN_MODULES>',
          '',
          '<THIRD_PARTY_MODULES>',
          '',
          '^@/.*$',
          '',
          '^[.]',
        ],
      },
    ],
    'no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
  },
  settings: {
    tailwindcss: {
      callees: ['cn'],
      config: 'tailwind.config.js',
    },
    next: {
      rootDir: true,
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
    },
  ],
}
