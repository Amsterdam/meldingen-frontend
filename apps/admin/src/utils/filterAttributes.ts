import type { ExtendedComponentSchema } from '@formio/js'

const textareaAllowed = ['label', 'description', 'key', 'type', 'input', 'autoExpand', 'showCharCount']
const panelAllowed = ['label', 'key', 'type', 'input', 'components']

export const filterAttributes = (raw: ExtendedComponentSchema) => {
  const allowed = raw.type === 'textarea' ? textareaAllowed : panelAllowed

  return Object.keys(raw)
    .filter((key) => allowed.includes(key))
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: raw[key],
      }),
      {},
    )
}
