import type { ReactNode } from 'react'

import { Page } from '@meldingen/ui'

import { TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'

import styles from './layout.module.css'

const MapLayout = ({ children }: { children: ReactNode }) => (
  <Page className={styles.page} id={TOP_ANCHOR_ID}>
    <main>{children}</main>
  </Page>
)

export default MapLayout
