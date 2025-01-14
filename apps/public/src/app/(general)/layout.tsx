import { Footer, Header, Screen } from '@meldingen/ui'

import { MeldingContextProvider } from '../../context/MeldingContextProvider'

const GeneralLayout = ({ children }: { children: React.ReactNode }) => (
  <MeldingContextProvider>
    <Screen maxWidth="wide">
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </Screen>
  </MeldingContextProvider>
)

export default GeneralLayout
