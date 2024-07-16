import styles from './component.module.css'

export const component = (ctx: any) => `
  <div class="${ctx.classes} ${styles.component}" ref="component">
    ${ctx.visible && ctx.children}
  </div>
`
