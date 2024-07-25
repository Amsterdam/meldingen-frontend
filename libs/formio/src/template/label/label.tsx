import { isGroup } from '../utils'

const labelMarkup = (ctx: any) =>
  isGroup(ctx)
    ? `
<legend class="ams-field-set__legend">
  ${ctx.t(ctx.component.label)}
</legend>`
    : `
<label
  ref="label"
  class="ams-label"
  for="${ctx.instance.id}-${ctx.component.key}"
>
  ${ctx.t(ctx.component.label)}
</label>
`

export const label = (ctx: any) => (ctx.component.input ? labelMarkup(ctx) : '')
