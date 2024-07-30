import { hasDescription, isGroup } from '../utils'

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
  if (ctx.component.type === 'radio') {
    return `
<fieldset
  ${hasDescription(ctx) ? `aria-describedby="${ctx.id}-descr"` : ''}
  class="ams-field-set"
  ref="component"
  role="radiogroup"
>
  ${ctx.visible && ctx.children}
</fieldset>
    `
  }

  return `
<fieldset
  ${hasDescription(ctx) ? `aria-labelledby="${ctx.id}-fieldset ${ctx.id}-descr"` : ''}
  class="ams-field-set"
  ${hasDescription(ctx) ? `id="${ctx.id}-fieldset"` : ''}
  ref="component"
>
  ${ctx.visible && ctx.children}
</fieldset>
`
}

export const component = (ctx: any) => (isGroup(ctx) ? renderFieldSet(ctx) : renderField(ctx))
