import eslint from '@eslint/js'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import pluginNext from '@next/eslint-plugin-next'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import perfectionist from 'eslint-plugin-perfectionist'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import react from 'eslint-plugin-react'
import globals from 'globals'

export default defineConfig(
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
      // Next.js generated files
      '**/.next/',
      '**/next-env.d.ts',
    ],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es6, ...globals.node, ...globals.vitest },
    },
  },

  // JavaScript, TypeScript & React
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      perfectionist,
      'prefer-arrow-functions': preferArrowFunctions,
      react,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['js', 'jsx', 'ts', 'tsx'],
        },
      },
      react: { version: 'detect' },
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...jsxA11y.configs.strict.rules,
      ...perfectionist.configs['recommended-natural'].rules,
      ...react.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,

      // TypeScript
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Import
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/newline-after-import': 'error',
      'import/no-cycle': 'warn',
      'import/no-default-export': 'error',
      'import/no-named-as-default': 'error',

      // ESLint
      'no-console': 'warn',
      'prefer-arrow-functions/prefer-arrow-functions': 'error',

      // Perfectionist
      'perfectionist/sort-imports': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: ['^@meldingen'],
              groupName: 'value-internal',
            },
            {
              elementNamePattern: ['^apps/', '^libs/'],
              groupName: 'value-parent',
            },
            {
              elementNamePattern: ['.css$'],
              groupName: 'unknown',
            },
          ],
        },
      ],
      'perfectionist/sort-modules': 'off', // This impacts readability in a negative way. We want to decide the order of modules ourselves.
      'perfectionist/sort-union-types': 'off', // This causes more issues than it solves

      // React
      'react/display-name': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
    },
  },

  // Don't force using type over interface in .d.ts files
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },

  // Don't force named exports for non-React files
  {
    files: ['**/*.{js,ts,mjs,cjs}'],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // JSON
  {
    files: ['**/*.json'],
    language: 'json/json',
    plugins: { json },
    ...json.configs.recommended,
  },

  // Markdown
  {
    ...markdown.configs.recommended[0],
    language: 'markdown/gfm',
  },

  // Next.js apps
  {
    files: ['apps/melding-form/**/*', 'apps/back-office/**/*'],
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': ['error', ['apps/melding-form/src', 'apps/back-office/src']],
    },
  },
  {
    files: ['**/error.tsx', '**/page.tsx', '**/layout.tsx', '**/not-found.tsx'],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Global Prettier config. Defined here to make sure no other rules override it.
  eslintConfigPrettier,
)
