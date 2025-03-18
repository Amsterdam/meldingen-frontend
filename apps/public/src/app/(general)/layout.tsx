import { ReactNode } from 'react'

import { Footer, Header, Screen } from '@meldingen/ui'

const GeneralLayout = ({ children }: { children: ReactNode }) => (
  <Screen maxWidth="wide">
    <Header />
    <main>{children}</main>
    <Footer />
  </Screen>
)

export default GeneralLayout
