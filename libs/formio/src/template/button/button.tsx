export const button = (ctx: any) => `
<div>
  <button
    class="ams-button ams-button--primary"
    ref="button"
    type="submit"
  >
  ${ctx.input.content}
  </button>
</div>
`
