import 'server-only'

import { validateServerEnv } from './validate'

export const serverEnv = validateServerEnv()
