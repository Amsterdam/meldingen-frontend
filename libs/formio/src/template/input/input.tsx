export const input = (ctx: any) => `
  <${ctx.input.type}
    class="${ctx.input.attr.class}"
    id="${ctx.instance.id}-${ctx.component.key}"
    name="${ctx.input.attr.name}"
    ref="${ctx.input.ref ? ctx.input.ref : 'input'}"
    rows=${ctx.input.attr.rows}
    spellcheck=${ctx.input.attr.spellcheck}
    ${ctx.input.type !== 'textarea' ? `type="${ctx.input.attr.type}"` : undefined}
  >
    ${ctx.input.content}
  </${ctx.input.type}>
  ${
    ctx.component.showCharCount
      ? `<span aria-live="polite" class="ams-paragraph ams-paragraph--small" ref="charcount"></span>`
      : ''
  }
  ${
    ctx.component.showWordCount
      ? `<span aria-live="polite" class="ams-paragraph ams-paragraph--small" ref="wordcount"></span>`
      : ''
  }
`
