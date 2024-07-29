import { isGroup } from '../utils'

const labelMarkup = (ctx: any) => {
  if (isGroup(ctx)) {
    return `
<legend class="ams-field-set__legend">
  ${ctx.t(ctx.component.label)}
</legend>`
  }

  return `
<label
  ref="label"
  class="ams-label"
  for="${ctx.instance.id}-${ctx.component.key}"
>
  ${ctx.t(ctx.component.label)}
</label>
`
}

export const label = (ctx: any) => (ctx.component.input ? labelMarkup(ctx) : '')
