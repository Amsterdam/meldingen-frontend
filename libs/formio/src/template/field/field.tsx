import { hasDescription, isGroup } from '../utils'

export const field = (ctx: any) => `
${ctx.labelMarkup}
${hasDescription(ctx) ? `<p class="ams-paragraph ams-paragraph--small${isGroup(ctx) ? ' ams-mb--xs' : ''}" id="${ctx.id}-descr">${ctx.t(ctx.component.description)}</p>` : ''}
${ctx.element}
`
