import _import from 'eslint-plugin-import'
import { fileURLToPath } from 'node:url'
import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import globals from 'globals'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import path from 'node:path'
import pluginNext from '@next/eslint-plugin-next'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
})

export default tseslint.config(
  // Global
  {
    ignores: [
      // Ignore generated files
      '**/vendor/',
      '**/build/',
      '**/coverage/',
      '**/dist/',
      '**/tmp/',
      // Ignore generated api client
      'libs/api-client',
    ],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es6 },
    },
  },

  // JavaScript, TypeScript & React
  ...compat.extends('airbnb', 'airbnb-typescript', 'plugin:jsx-a11y/strict', 'plugin:react/recommended').map(() => ({
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: fixupPluginRules(_import),
      'prefer-arrow-functions': preferArrowFunctions,
      react,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        },
      },
      react: { version: 'detect' },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error',
      'import/order': [
        'error',
        {
          groups: ['external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@meldingen/**',
              group: 'internal',
            },
            {
              pattern: 'apps/**',
              group: 'parent',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-console': 'warn',
      'prefer-arrow-functions/prefer-arrow-functions': 'error',
      'react/function-component-definition': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
    },
  })),
  {
    files: ['**/vite.config.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // JSON
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    ...json.configs.recommended,
  },

  // Markdown
  {
    files: ['**/*.md'],
    plugins: { markdown },
    processor: 'markdown/markdown',
    rules: {},
  },

  // Next.js apps
  {
    files: ['apps/public/**/*', 'apps/back-office/**/*'],
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    files: ['**/page.tsx', '**/layout.tsx', '**/next.config.ts', '**/request.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Global Prettier config. Defined here to make sure no other rules override it.
  eslintConfigPrettier,
)
