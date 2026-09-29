import pluginNext from '@next/eslint-plugin-next'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export const frameworkConfigs = [
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
  eslintConfigPrettier,
]
