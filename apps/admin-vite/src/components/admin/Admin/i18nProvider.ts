import polyglotI18nProvider from 'ra-i18n-polyglot'
import dutchMessages from 'ra-language-dutch'

const nl = {
  ...dutchMessages,
  resources: {
    classification: {
      name: 'Categorie |||| Categorieën',
      fields: {
        form: 'Vragenlijst',
        name: 'Naam',
      },
    },
    form: {
      name: 'Vragenlijst |||| Vragenlijsten',
      fields: {
        classification: 'Categorie',
        title: 'Naam',
      },
    },
  },
  ma: {
    dialog: {
      overwriteClassification: {
        content: 'De oude koppeling wordt hiermee verbroken.',
        title: 'Let op, deze categorie was al gekoppeld aan een vragenlijst.',
      },
    },
  },
}

export const i18nProvider = polyglotI18nProvider(() => nl, 'nl')
