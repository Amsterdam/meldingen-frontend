import _import from 'eslint-plugin-import'
import { fileURLToPath } from 'node:url'
import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import globals from 'globals'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import path from 'node:path'
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
  ...compat.extends('eslint-config-prettier'),

  // JavaScript, TypeScript & React
  ...compat.extends('plugin:react/recommended').map(() => ({
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: fixupPluginRules(_import),
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
    rules: {},
  })),

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
)
