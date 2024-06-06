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
        content:
          'Hier haal je de gekoppelde vragenlijst offline en zet je de huidige vragenlijst online. Is dat wat je wilt?',
        title: 'Ontkoppel bestaande vragenlijst',
      },
    },
  },
}

export const i18nProvider = polyglotI18nProvider(() => nl, 'nl')
