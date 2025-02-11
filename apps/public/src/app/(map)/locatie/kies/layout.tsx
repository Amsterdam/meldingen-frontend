import { Screen } from '@meldingen/ui'
import type { ReactNode } from 'react'

const MapLayout = ({ children }: { children: ReactNode }) => (
  <Screen maxWidth="x-wide">
    <main>{children}</main>
  </Screen>
)

export default MapLayout
