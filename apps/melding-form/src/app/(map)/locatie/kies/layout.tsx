import type { ReactNode } from 'react'

import { TOP_ANCHOR_ID } from '~/constants'

import { Page } from '@meldingen/ui'

import styles from './layout.module.css'

const MapLayout = ({ children }: { children: ReactNode }) => (
  <Page className={styles.page} id={TOP_ANCHOR_ID}>
    <main>{children}</main>
  </Page>
)

export default MapLayout
