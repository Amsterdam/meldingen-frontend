export const label = (ctx: any) =>
  ctx.component.label &&
  `
  <label
    ref="label"
    class="${ctx.label.className} ams-label"
    for="${ctx.instance.id}-${ctx.component.key}"
  >
    ${ctx.t(ctx.component.label, { _userInput: true })}
  </label>
`
