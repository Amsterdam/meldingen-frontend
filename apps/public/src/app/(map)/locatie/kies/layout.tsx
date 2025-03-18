import type { ReactNode } from 'react'

import { Screen } from '@meldingen/ui'

const MapLayout = ({ children }: { children: ReactNode }) => (
  <Screen maxWidth="x-wide">
    <main>{children}</main>
  </Screen>
)

export default MapLayout
