import { Column, Heading, Icon, Paragraph } from '@amsterdam/design-system-react'
import { ChevronLeftIcon } from '@amsterdam/design-system-react-icons'
import Link from 'next/link'

type Props = {
  address: string | null
}

export const AddressMenu = ({ address }: Props) => (
  <Column>
    <Link href="/locatie">
      <Icon svg={ChevronLeftIcon} size="level-4" />
      {/* TODO: Icon becomes red when clicking it.  */}
    </Link>
    <span>
      <Heading level={1} size="level-4">
        Selecteer de locatie
      </Heading>
      <Paragraph size="small">
        Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik &quot;Mijn locatie&quot;
      </Paragraph>
    </span>
    <span>
      <Heading level={2} size="level-4">
        Zoek op adres
      </Heading>
      {address && <span>{address}</span>}
    </span>
  </Column>
)
