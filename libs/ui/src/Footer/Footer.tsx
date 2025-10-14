import { Column } from '@amsterdam/design-system-react/dist/Column'
import { Grid } from '@amsterdam/design-system-react/dist/Grid'
import { Heading } from '@amsterdam/design-system-react/dist/Heading'
import { Link } from '@amsterdam/design-system-react/dist/Link'
import { PageFooter } from '@amsterdam/design-system-react/dist/PageFooter'
import { Paragraph } from '@amsterdam/design-system-react/dist/Paragraph'

export const Footer = () => (
  <PageFooter>
    <PageFooter.Spotlight>
      <Grid paddingVertical="x-large">
        <Grid.Cell span={4}>
          <Column gap="small">
            <Heading level={2} size="level-3" color="inverse">
              Contact
            </Heading>
            <Paragraph color="inverse">Lukt het niet om een melding te doen?</Paragraph>
            <Paragraph color="inverse">
              Bel het telefoonnummer{' '}
              <Link href="tel:14020" color="inverse">
                14 020
              </Link>
              .
            </Paragraph>
            <Paragraph color="inverse">Maandag tot en met vrijdag van 08.00 tot 18.00 uur.</Paragraph>
          </Column>
        </Grid.Cell>
      </Grid>
    </PageFooter.Spotlight>
    <Heading className="ams-visually-hidden" level={2}>
      Over deze website
    </Heading>
    <PageFooter.Menu>
      <PageFooter.MenuLink href="#">Over deze site</PageFooter.MenuLink>
      <PageFooter.MenuLink href="#">Privacy</PageFooter.MenuLink>
      <PageFooter.MenuLink href="#">Toegankelijkheid</PageFooter.MenuLink>
    </PageFooter.Menu>
  </PageFooter>
)
