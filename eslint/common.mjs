/* eslint-disable perfectionist/sort-objects */

import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import perfectionist from 'eslint-plugin-perfectionist'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import workspaces from 'eslint-plugin-workspaces'
import globals from 'globals'

const perfectionistImportGroups = {
  customGroups: [
    {
      elementNamePattern: ['^~'],
      groupName: 'type-parent',
      selector: 'type',
    },
    {
      elementNamePattern: ['^~'],
      groupName: 'value-parent',
    },
    {
      elementNamePattern: ['.css$'],
      groupName: 'unknown',
    },
  ],
  internalPattern: ['^@meldingen'],
}

const perfectionistCustomGridPropsOrder = {
  customGroups: [
    {
      groupName: 'narrow',
      elementNamePattern: 'narrow',
    },
    {
      groupName: 'medium',
      elementNamePattern: 'medium',
    },
    {
      groupName: 'wide',
      elementNamePattern: 'wide',
    },
  ],
  groups: ['narrow', 'medium', 'wide'],
}

export const globalConfigs = [
  {
    ignores: [
      // Ignore generated files
      '**/vendor/',
      '**/build/',
      '**/coverage/',
      '**/dist/',
      '**/tmp/',
      // Ignore generated api client
      'libs/api-client/src/generated',
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
]

export const scriptConfigs = [
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@stylistic': stylistic,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      perfectionist,
      'prefer-arrow-functions': preferArrowFunctions,
      react,
      'react-hooks': reactHooks,
      workspaces,
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        // This uses eslint-import-resolver-typescript
        typescript: {},
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
      ...workspaces.configs.recommended.rules,

      // TypeScript
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-shadow': ['warn'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-shadow': 'off',

      // Stylistic
      '@stylistic/padding-line-between-statements': [
        'warn',
        {
          blankLine: 'always',
          prev: '*',
          next: ['block', 'block-like', 'return'],
        },
        {
          blankLine: 'always',
          prev: ['block', 'block-like'],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],

      // Import
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/newline-after-import': 'error',
      'import/no-cycle': 'error',
      'import/no-default-export': 'error',
      'import/no-named-as-default': 'error',

      // ESLint
      'no-console': 'error',
      'no-unused-vars': 'off',
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          returnStyle: 'implicit',
        },
      ],
      'max-lines': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],

      // Perfectionist
      'perfectionist/sort-imports': ['error', perfectionistImportGroups],
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-objects': ['error', perfectionistCustomGridPropsOrder],
      'perfectionist/sort-union-types': 'off',

      // React
      'react/display-name': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
]
