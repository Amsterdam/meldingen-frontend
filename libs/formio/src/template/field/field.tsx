export const field = (ctx: any) => `
  ${ctx.labelMarkup}

  ${
    ctx.component.description &&
    `<p class="ams-paragraph ams-paragraph--small ams-mb-xs">${ctx.t(ctx.component.description, {
      _userInput: true,
    })}</p>`
  }

  ${ctx.element}
`
