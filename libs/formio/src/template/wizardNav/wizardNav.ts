export const wizardNav = (ctx: any) => `
<div>
  ${ctx.buttons.next ? `<button class="ams-button ams-button--primary" type="submit" ref="${ctx.wizardKey}-next">${ctx.t('next')}</button>` : ''}
  ${ctx.buttons.submit ? `<button class="ams-button ams-button--primary" type="submit" ref="${ctx.wizardKey}-submit">${ctx.t('submit')}</button>` : ''}
</div>
`
