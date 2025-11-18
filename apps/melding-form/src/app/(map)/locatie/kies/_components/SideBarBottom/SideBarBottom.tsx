import clsx from 'clsx'
import { PropsWithChildren } from 'react'

import styles from './SideBarBottom.module.css'

type Props = PropsWithChildren & {
  isHidden: boolean
}

export const SideBarBottom = ({ children, isHidden }: Props) => {
  return <div className={clsx(styles.container, isHidden && styles.hide)}>{children}</div>
}
