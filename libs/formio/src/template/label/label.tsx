const labelMarkup = (ctx: any) => `
<label
  ref="label"
  class="ams-label"
  for="${ctx.instance.id}-${ctx.component.key}"
>
  ${ctx.t(ctx.component.label, { _userInput: true })}
</label>
`

export const label = (ctx: any) => (ctx.component.input ? labelMarkup(ctx) : '')
