import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
// import tailwindcss from 'eslint-plugin-tailwindcss' // V4 is not supported yet

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat.extends(
    'next/core-web-vitals',
    'prettier',
    // 'plugin:tailwindcss/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
      // tailwindcss,
    },

    settings: {
      // tailwindcss: {
      //   callees: ['cn'],
      //   config: 'tailwind.config.js',
      // },

      next: {
        rootDir: true,
      },
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          plugins: ['@ianvs/prettier-plugin-sort-imports'/*, 'prettier-plugin-tailwindcss'*/],
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
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,
    },
  },
]
