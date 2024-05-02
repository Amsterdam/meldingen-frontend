import type { ExtendedComponentSchema } from 'formiojs'

const allowed = ['label', 'description', 'key', 'type', 'input', 'autoExpand', 'showCharCount']

export const filterAttributes = (raw: ExtendedComponentSchema) =>
  Object.keys(raw)
    .filter((key) => allowed.includes(key))
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: raw[key],
      }),
      {},
    )
