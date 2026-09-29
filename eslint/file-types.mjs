import json from '@eslint/json'
import markdown from '@eslint/markdown'

export const fileTypeConfigs = [
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
  {
    files: ['**/*.{js,ts,mjs,cjs}'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    files: ['**/*.json'],
    language: 'json/json',
    plugins: { json },
    ...json.configs.recommended,
  },
  {
    ...markdown.configs.recommended[0],
    language: 'markdown/gfm',
  },
]
