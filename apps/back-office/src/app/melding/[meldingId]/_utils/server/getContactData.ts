import type { MeldingOutput } from '@meldingen/api-client'

export const getContactData = (data: MeldingOutput, t: (key: string) => string) => {
  const { email, phone } = data

  return [
    {
      description: email ?? t('detail.contact.no-data'),
      key: 'email',
      term: t('detail.contact.email'),
    },
    {
      description: phone ?? t('detail.contact.no-data'),
      key: 'phone',
      term: t('detail.contact.phone'),
    },
  ]
}
