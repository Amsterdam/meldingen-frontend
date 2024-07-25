const renderField = (ctx: any) => {
  const isField = ctx.component.type !== 'button'

  return `
<div
  ${isField && `class="ams-field"`}
  ref="component"
>
  ${ctx.visible && ctx.children}
</div>
`
}

const renderFieldSet = (ctx: any) => {
  const isRadio = ctx.component.type === 'radio'
  const hasDescription = ctx.component.description.length > 0

  return `
<fieldset
  ${hasDescription ? `aria-describedby="${ctx.id}-descr"` : ''}
  class="ams-field-set"
  ref="component"
  ${isRadio ? `role="radiogroup"` : ''}
>
  ${ctx.visible && ctx.children}
</fieldset>
`
}

export const component = (ctx: any) => {
  const isGroup = ctx.component.type === 'radio' || ctx.component.type === 'selectboxes'

  return isGroup ? renderFieldSet(ctx) : renderField(ctx)
}
