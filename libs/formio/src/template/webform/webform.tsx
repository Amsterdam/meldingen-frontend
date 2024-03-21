import styles from './webform.module.css'

export const webform = (ctx: any) => `
  <form class="${ctx.classes} ${styles.webform}" ref="webform" novalidate>${ctx.children}</form>
`
