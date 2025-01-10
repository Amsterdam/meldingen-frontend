import { Column, Heading, Icon, Paragraph, Link } from '@amsterdam/design-system-react'
import { ChevronLeftIcon } from '@amsterdam/design-system-react-icons'
import NextLink from 'next/link'

type Props = {
  address: string | null
}

export const SideBar = ({ address }: Props) => (
  <Column>
    <NextLink href="/locatie" legacyBehavior passHref>
      <Link href="dummy-href">
        <Icon svg={ChevronLeftIcon} size="level-4" />
      </Link>
    </NextLink>

    <div>
      <Heading level={1} size="level-4">
        Selecteer de locatie
      </Heading>
      <Paragraph size="small">
        Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik &quot;Mijn locatie&quot;
      </Paragraph>
    </div>
    <div>
      <Heading level={2} size="level-4">
        Zoek op adres
      </Heading>
      {address && <div>{address}</div>}
    </div>
  </Column>
)
