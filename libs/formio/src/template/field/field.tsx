export const field = (ctx: any) => {
  const hasDescription = ctx.component.description.length > 0
  const isGroup = ctx.component.type === 'radio' || ctx.component.type === 'selectboxes'

  return `
${ctx.labelMarkup}
${hasDescription ? `<p class="ams-paragraph ams-paragraph--small${isGroup ? ' ams-mb--xs' : ''}" id="${ctx.id}-descr">${ctx.t(ctx.component.description)}</p>` : ''}
${ctx.element}
`
}
