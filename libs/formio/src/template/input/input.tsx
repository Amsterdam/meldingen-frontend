import { generateAttrs } from '../utils'

export const input = (ctx: any) => `
  <${ctx.input.type}
    ${generateAttrs({ attrs: ctx.input.attr, filterClass: false })}
    ${ctx.component.description ? `aria-describedby="${ctx.id}-descr"` : ''}
    id="${ctx.instance.id}-${ctx.component.key}"
    ref="${ctx.input.ref ? ctx.input.ref : 'input'}"
    ${ctx.input.type !== 'textarea' ? `type="${ctx.input.attr.type}"` : ''}
  >${ctx.input.content}</${ctx.input.type}>
  ${
    ctx.component.maxCharCount
      ? `<div class="ams-character-count" role="status" ref="charcount">0 van ${ctx.component.maxCharCount} tekens</div>`
      : ''
  }
`
