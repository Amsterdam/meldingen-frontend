import type { ReactNode } from 'react'

import { Page } from '@meldingen/ui'

import styles from './layout.module.css'

const MapLayout = ({ children }: { children: ReactNode }) => (
  <Page className={styles.page}>
    <main>{children}</main>
  </Page>
)

export default MapLayout
