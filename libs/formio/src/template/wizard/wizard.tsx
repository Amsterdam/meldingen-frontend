export const wizard = (ctx: any) => `
<form class="ams-gap--md ${ctx.className}" ref="${ctx.wizardKey}">
  ${ctx.components}
  ${ctx.wizardNav}
</form>
`
