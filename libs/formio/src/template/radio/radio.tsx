type Props = {
  ctx: any
  item: {
    disabled: boolean
    label: string
    value: any
  }
  index: number
}

const radioButton = ({ ctx, item, index }: Props) => {
  const id = `${ctx.instance.root && ctx.instance.root.id}-${ctx.id}-${ctx.row}-${typeof item.value === 'object' ? `${item.value}-${index}` : item.value}`

  const generateAttrs = () => {
    // Loop through the object of attrs and generate strings.
    // The attr 'type' is skipped, we set that later.
    const attrs = Object.keys(ctx.input.attr).map((key) => (key !== 'type' ? `${key}="${ctx.input.attr[key]}"` : ''))
    return attrs.join(' ')
  }

  const isChecked =
    ctx.value &&
    (ctx.value === item.value ||
      (typeof ctx.value === 'object' &&
        Object.prototype.hasOwnProperty.call(ctx.value, item.value) &&
        ctx.value[item.value]))

  return `
<div class="ams-radio" ref="wrapper">
  <input
    ${generateAttrs()}
    checked="${isChecked}"
    class="ams-radio__input"
    ${item.disabled && 'disabled'}
    id="${id}"
    type="radio"
    value="${item.value}"
    ref="input"
  />
  <label
    class="ams-radio__label"
    for="${id}"
  >
    <span class="ams-radio__circle"></span>
    ${ctx.t(item.label)}
  </label>
</div>
`
}

export const radio = (ctx: any) => `
<div
  class="ams-column ams-column--extra-small"
  ref="radioGroup"
>
  ${ctx.values.map((item: any, index: number) => radioButton({ ctx, item, index })).join('')}
</div>
`
