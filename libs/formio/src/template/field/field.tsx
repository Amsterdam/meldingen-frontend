import { hasDescription, isGroup } from '../utils'

export const field = (ctx: any) => {
  const baseClass = 'ams-paragraph ams-paragraph--small'
  const groupClass = `${baseClass} ams-mb--xs`

  if (hasDescription(ctx)) {
    return `
${ctx.labelMarkup}
<p
  class="${isGroup(ctx) ? groupClass : baseClass}"
  id="${ctx.id}-descr"
>
  ${ctx.t(ctx.component.description)}
</p>
${ctx.element}
`
  }

  return `
${ctx.labelMarkup}
${ctx.element}
`
}
