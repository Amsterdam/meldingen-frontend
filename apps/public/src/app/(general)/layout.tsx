import { Footer, Header, Screen } from '@meldingen/ui'

const GeneralLayout = ({ children }: { children: React.ReactNode }) => (
  <Screen maxWidth="wide">
    <Header />
    <main>{children}</main>
    <Footer />
  </Screen>
)

export default GeneralLayout
