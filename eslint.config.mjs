import { defineConfig } from 'eslint/config'

import { globalConfigs, scriptConfigs } from './eslint/common.mjs'
import { fileTypeConfigs } from './eslint/file-types.mjs'
import { frameworkConfigs } from './eslint/frameworks.mjs'

export default defineConfig(...globalConfigs, ...scriptConfigs, ...fileTypeConfigs, ...frameworkConfigs)
