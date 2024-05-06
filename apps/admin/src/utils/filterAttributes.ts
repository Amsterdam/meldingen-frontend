import type { ComponentSchema, ExtendedComponentSchema } from 'formiojs'

const textareaAllowed = ['label', 'description', 'key', 'type', 'input', 'autoExpand', 'showCharCount']
const panelAllowed = ['label', 'key', 'type', 'input', 'components']

const filterFunction = (raw: ExtendedComponentSchema, allowed: string[]) =>
  Object.keys(raw)
    .filter((key) => allowed.includes(key))
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: raw[key],
      }),
      {},
    )

export const filterAttributes = (raw: ExtendedComponentSchema) => {
  const filteredComponents = raw.components.map((item: ComponentSchema) => filterFunction(item, textareaAllowed))
  const filteredPanel = filterFunction(raw, panelAllowed)

  return {
    ...filteredPanel,
    components: filteredComponents,
  }
}
