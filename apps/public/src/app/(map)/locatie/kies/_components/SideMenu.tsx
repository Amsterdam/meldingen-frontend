import { Heading, Paragraph } from '@amsterdam/design-system-react'

export const SideMenu = ({ address }: any) => (
  <>
    <Heading level={1} size="level-4">
      Selecteer de locatie
    </Heading>
    <Paragraph size="small">
      Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik &quot;Mijn locatie&quot;
    </Paragraph>
    <Heading level={2} size="level-4">
      Zoek op adres
    </Heading>
    <span>{address}</span>
  </>
)
