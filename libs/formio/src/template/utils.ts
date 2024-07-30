export const hasDescription = (ctx: any) => ctx.component.description.length > 0

export const isGroup = (ctx: any) => ctx.component.type === 'radio' || ctx.component.type === 'selectboxes'

type GenerateAttrsParams = {
  attrs: {
    [key: string]: any
  }
  filterClass?: boolean
}

/** Loop through the object of attrs and generate strings. */
export const generateAttrs = ({ attrs, filterClass = true }: GenerateAttrsParams) => {
  // Always skip the 'type' attribute. Only skip 'class' if filterClass is false.
  // We set these attributes manually.
  const filter = filterClass ? ['class', 'type'] : ['type']

  const attrStrings = Object.keys(attrs).map((key: string) => (!filter.includes(key) ? `${key}="${attrs[key]}"` : ''))
  return attrStrings.join(' ')
}
