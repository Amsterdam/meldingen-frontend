import { Column } from '@amsterdam/design-system-react/dist/Column'
import { Footer as ADSFooter } from '@amsterdam/design-system-react/dist/Footer'
import { Grid } from '@amsterdam/design-system-react/dist/Grid'
import { Heading } from '@amsterdam/design-system-react/dist/Heading'
import { Link } from '@amsterdam/design-system-react/dist/Link'
import { Paragraph } from '@amsterdam/design-system-react/dist/Paragraph'

export const Footer = () => (
  <ADSFooter>
    <ADSFooter.Spotlight>
      <Grid paddingVertical="medium">
        <Grid.Cell span={4}>
          <Column gap="small">
            <Heading level={2} size="level-4" color="inverse">
              Contact
            </Heading>
            <Paragraph size="small" color="inverse">
              Lukt het niet om een melding te doen?
            </Paragraph>
            <Paragraph size="small" color="inverse">
              Bel het telefoonnummer{' '}
              <Link href="tel:14020" color="inverse" variant="inline">
                14 020
              </Link>
              .
            </Paragraph>
            <Paragraph size="small" color="inverse">
              Maandag tot en met vrijdag van 08.00 tot 18.00 uur.
            </Paragraph>
          </Column>
        </Grid.Cell>
      </Grid>
    </ADSFooter.Spotlight>
    <Heading className="ams-visually-hidden" level={2}>
      Over deze website
    </Heading>
    <ADSFooter.Menu>
      <ADSFooter.MenuLink href="#">Over deze site</ADSFooter.MenuLink>
      <ADSFooter.MenuLink href="#">Privacy</ADSFooter.MenuLink>
      <ADSFooter.MenuLink href="#">Toegankelijkheid</ADSFooter.MenuLink>
    </ADSFooter.Menu>
  </ADSFooter>
)
