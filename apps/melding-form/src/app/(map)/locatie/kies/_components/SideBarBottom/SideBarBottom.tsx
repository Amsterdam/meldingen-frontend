import type { PropsWithChildren } from 'react'

import { clsx } from 'clsx'

import styles from './SideBarBottom.module.css'

type Props = PropsWithChildren & {
  isHidden: boolean
}

export const SideBarBottom = ({ children, isHidden }: Props) => {
  return (
    <div className={clsx(styles.container, isHidden && styles.hide)}>
      <div className={styles.inner}>{children}</div>
    </div>
  )
}
