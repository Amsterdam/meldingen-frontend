import { generateAttrs } from '../utils'

export const select = (ctx: any) => `
<select
  ${generateAttrs({ attrs: ctx.input.attr })}
  ${ctx.component.description ? `aria-describedby="${ctx.id}-descr"` : ''}
  aria-required="${ctx.input.component.validate.required}"
  class="ams-select"
  id="${ctx.instance.id}-${ctx.component.key}"
  ref="selectContainer"
>
  ${ctx.selectOptions}
</select>
`
