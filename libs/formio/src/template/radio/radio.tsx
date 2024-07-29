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
    // The attrs 'type' and 'class' are skipped, we set that later.
    const attrs = Object.keys(ctx.input.attr).map((key) =>
      key !== 'type' && key !== 'class' ? `${key}="${ctx.input.attr[key]}"` : '',
    )
    return attrs.join(' ')
  }

  const isChecked =
    ctx.value &&
    (ctx.value === item.value ||
      (typeof ctx.value === 'object' &&
        Object.prototype.hasOwnProperty.call(ctx.value, item.value) &&
        ctx.value[item.value]))

  const type = ctx.component.type === 'selectboxes' ? 'checkbox' : 'radio'

  return `
<div class="ams-${type}" ref="wrapper">
  <input
    ${generateAttrs()}
    ${isChecked ? 'checked' : ''}
    class="ams-${type}__input"
    ${item.disabled ? 'disabled' : ''}
    id="${id}"
    type="${type}"
    value="${item.value}"
    ref="input"
  />
  <label
    class="ams-${type}__label"
    for="${id}"
  >
    <span class="ams-${type}__${type === 'checkbox' ? 'checkmark' : 'circle'}"></span>
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
