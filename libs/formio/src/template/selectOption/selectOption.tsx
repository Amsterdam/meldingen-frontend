import { generateAttrs } from '../utils'

export const selectOption = (ctx: any) => `
<option
  ${generateAttrs({ attrs: ctx.attrs })}
  ${ctx.selected ? 'selected="selected"' : ''}
  class="ams-select__option"
  value='${ctx.useId ? ctx.id : ctx.option.value}'
>
  ${ctx.t(ctx.option.label)}
</option>`
