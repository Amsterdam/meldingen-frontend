import type { Plugin } from 'vite'

import { loadEnv } from 'vite'

import { validateClientEnv } from '../../src/env/validate.ts'

const validateEnvPlugin = (): Plugin => ({
  config: ({ envDir, root }, { mode }) => {
    validateClientEnv(loadEnv(mode, envDir ?? root ?? process.cwd(), 'VITE_'))
  },
  name: 'vite-plugin-validate-env',
})

export default validateEnvPlugin
