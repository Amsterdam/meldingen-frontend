import type { PropsWithChildren } from 'react'

import styles from './Loading.module.css'

export const Loading = ({ children }: PropsWithChildren) => (
  <div>
    <span className="ams-visually-hidden">{children}</span>
    <div className={styles.container}>
      <div className={styles.loading} />
    </div>
    <div className={styles.container}>
      <div className={styles.loading} />
    </div>
    <div className={styles.container}>
      <div className={styles.loading} />
    </div>
  </div>
)
