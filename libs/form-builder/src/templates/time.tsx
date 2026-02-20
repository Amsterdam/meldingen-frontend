export const time = () => ({
  form: (ctx: any) => `
      <div class="form-group">
        <input
          ref="${ctx.input ? ctx.input.attr.ref : 'input'}"
          type="time"
          class="form-control ${ctx.instance.component.customClass || ''}"
          id="${ctx.instance.id}"
          placeholder="${ctx.component.placeholder || ''}"
          value="${ctx.value || ''}"
          ${ctx.component.disabled ? 'disabled' : ''}
          ${ctx.component.required ? 'required' : ''}
        />
      </div>
    `,
})
