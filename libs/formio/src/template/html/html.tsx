// TODO: we probably want to make separate heading and paragraph component,
// and set the right classes there

export const html = (ctx: any) => `
  <${ctx.tag} class="formio-component-htmlelement ${ctx.component.className} ${
    ctx.tag === 'h1' ? 'ams-heading ams-heading--1' : ''
  } ${ctx.tag === 'p' ? 'ams-paragraph' : ''}" ref="html">
    ${ctx.t(ctx.content)}
  </${ctx.tag}>
`
