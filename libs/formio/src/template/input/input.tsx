export const input = (ctx: any) => {
  const generateAttrs = () => {
    // Loop through the object of attrs and generate strings.
    // The attr 'type' is skipped, we set that later.
    const attrs = Object.keys(ctx.input.attr).map((key) => (key !== 'type' ? `${key}="${ctx.input.attr[key]}"` : ''))
    return attrs.join(' ')
  }

  return `
  <${ctx.input.type}
    ${generateAttrs()}
    ${ctx.component.description ? `aria-describedby="${ctx.id}-descr"` : ''}
    id="${ctx.instance.id}-${ctx.component.key}"
    ref="${ctx.input.ref ? ctx.input.ref : 'input'}"
    ${ctx.input.type !== 'textarea' ? `type="${ctx.input.attr.type}"` : undefined}
  >${ctx.input.content}</${ctx.input.type}>
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
}
