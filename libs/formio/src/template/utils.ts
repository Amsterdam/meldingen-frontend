export const hasDescription = (ctx: any) => ctx.component.description.length > 0
export const isGroup = (ctx: any) => ctx.component.type === 'radio' || ctx.component.type === 'selectboxes'
