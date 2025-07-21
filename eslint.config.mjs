import { fixupPluginRules } from '@eslint/compat'
import eslint from '@eslint/js'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import pluginNext from '@next/eslint-plugin-next'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import _import from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import react from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

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
      // Next.js generated files
      '**/.next/',
    ],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es6, ...globals.node, ...globals.vitest },
    },
  },

  // JavaScript, TypeScript & React
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: fixupPluginRules(_import),
      'jsx-a11y': jsxA11y,
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
      ...eslint.configs.recommended.rules,
      ...jsxA11y.configs.strict.rules,
      ...react.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'no-console': 'warn',
      'prefer-arrow-functions/prefer-arrow-functions': 'error',
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error',
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: ['external', 'internal', ['parent', 'sibling', 'index']],
          named: true,
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@meldingen/**',
              group: 'internal',
            },
            {
              pattern: 'apps/**',
              group: 'parent',
            },
            {
              // It's not possible to match *.module.css files on all depths,
              // so the most common depths are specified here. Add to this list if needed.
              pattern: '{./,../,../../}*.module.css',
              group: 'unknown',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
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
    plugins: { json },
    language: 'json/json',
    ...json.configs.recommended,
  },

  // Markdown
  ...markdown.configs.recommended,

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
