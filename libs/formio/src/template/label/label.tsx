const labelMarkup = (ctx: any) => {
  const isGroup = ctx.component.type === 'radio' || ctx.component.type === 'selectboxes'

  return isGroup
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
}

export const label = (ctx: any) => (ctx.component.input ? labelMarkup(ctx) : '')
