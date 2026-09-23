import type { Plugin } from 'vite'

import { loadEnv } from 'vite'

import { validateEnv } from '../../src/env/validateEnv.js'

const validateEnvPlugin = (): Plugin => ({
  config: ({ envDir, root }, { mode }) => {
    validateEnv(loadEnv(mode, envDir ?? root ?? process.cwd(), 'VITE_'))
  },
  name: 'vite-plugin-validate-env',
})

export default validateEnvPlugin
