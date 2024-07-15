export const field = (ctx: any) => `
  ${ctx.labelMarkup}

  ${
    ctx.component.description &&
    `<p class="ams-paragraph ams-paragraph--small" id="${ctx.id}-descr">${ctx.t(ctx.component.description)}</p>`
  }

  ${ctx.element}
`
