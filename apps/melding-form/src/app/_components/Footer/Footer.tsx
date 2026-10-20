import { useTranslations } from 'next-intl'

import { Column, Grid, Heading, LinkList, PageFooter } from '@meldingen/ui'

export const Footer = () => {
  const t = useTranslations('global.page-footer')
  const phoneNumber = t('phone').replaceAll(' ', '')

  return (
    <PageFooter>
      <PageFooter.Spotlight>
        <Grid paddingVertical="x-large">
          <Grid.Cell span={{ narrow: 4, medium: 5, wide: 6 }}>
            <Column gap="small">
              <Heading color="inverse" level={2} size="level-3">
                {t('title')}
              </Heading>

              <LinkList>
                <LinkList.Link color="inverse" href="https://www.amsterdam.nl/leefomgeving/een-melding-doen/">
                  {t('about-meldingen')}
                </LinkList.Link>
                <LinkList.Link color="inverse" href={`tel:${phoneNumber.replaceAll(' ', '')}}`}>
                  {t('call', { phoneNumber })}
                </LinkList.Link>
                <LinkList.Link color="inverse" href="https://www.amsterdam.nl/contact/">
                  {t('contact')}
                </LinkList.Link>
              </LinkList>
            </Column>
          </Grid.Cell>
        </Grid>
      </PageFooter.Spotlight>

      <PageFooter.Menu>
        <PageFooter.MenuLink href="https://www.amsterdam.nl/overdezesite/?pk_vid=f2d9fee8ef03552e1791968177bd306b">
          {t('about')}
        </PageFooter.MenuLink>
        <PageFooter.MenuLink href="https://www.amsterdam.nl/privacy/specifieke/privacyverklaringen-wonen/meldingen-overlast-privacy/?pk_vid=f2d9fee8ef03552e1791968196bd306b">
          {t('privacy')}
        </PageFooter.MenuLink>
        <PageFooter.MenuLink href="https://meldingen.amsterdam.nl/toegankelijkheidsverklaring">
          {t('accessibility')}
        </PageFooter.MenuLink>
      </PageFooter.Menu>
    </PageFooter>
  )
}
