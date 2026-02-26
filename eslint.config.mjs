// @ts-check
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'playwright-report/**',
    'test-results/**',
    'coverage/**',
  ]),
  {
    ignores: ['node_modules/**'],
  },
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          plugins: ['@ianvs/prettier-plugin-sort-imports' /*, 'prettier-plugin-tailwindcss'*/],
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
  eslintPluginPrettierRecommended,
  {
    settings: {
      // Fix for ESLint 10+: eslint-plugin-react uses context.getFilename() (legacy API)
      // which was removed in ESLint 10 flat config. Declaring the version explicitly
      // prevents the plugin from trying to auto-detect it and failing.
      react: { version: '19' },
    },
  },
])

export default eslintConfig
