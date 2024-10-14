import { TranslationMessages } from 'ra-core'
import polyglotI18nProvider from 'ra-i18n-polyglot'

const nl: TranslationMessages = {
  ra: {
    action: {
      add_filter: 'Voeg filter toe',
      add: 'Toevoegen',
      back: 'Ga terug',
      bulk_actions: '1 geselecteerd |||| %{smart_count} geselecteerd',
      cancel: 'Annuleren',
      clear_array_input: 'Lijst wissen',
      clear_input_value: 'Veld wissen',
      clone: 'Klonen',
      close_menu: 'Menu sluiten',
      close: 'Sluiten',
      confirm: 'Bevestigen',
      create_item: '%{item} toevoegen',
      create: 'Toevoegen',
      delete: 'Verwijderen',
      edit: 'Bewerken',
      expand: 'Uitklappen',
      export: 'Exporteer',
      list: 'Lijst',
      move_down: 'Omlaag verplaatsen',
      move_up: 'Omhoog verplaatsen',
      open_menu: 'Menu openen',
      open: 'Openen',
      refresh: 'Verversen',
      remove_all_filters: 'Alle filters verwijderen',
      remove_filter: 'Filter verwijderen',
      remove: 'Verwijderen',
      save: 'Opslaan',
      search: 'Zoeken',
      select_all: 'Alles selecteren',
      select_columns: 'Kolommen',
      select_row: 'Selecteer rij',
      show: 'Tonen',
      sort: 'Sorteren',
      toggle_theme: 'Thema wisselen',
      undo: 'Ongedaan maken',
      unselect: 'Deselecteer',
      update: 'Update',
      update_application: 'Update applicatie',
    },
    boolean: {
      true: 'Ja',
      false: 'Nee',
      null: '',
    },
    page: {
      create: '%{name} toevoegen',
      dashboard: 'Dashboard',
      edit: '%{name} #%{id}',
      error: 'Er is iets misgegaan',
      list: '%{name}',
      loading: 'Aan het laden',
      not_found: 'Niet gevonden',
      show: '%{name} #%{id}',
      empty: 'Nog geen %{name}.',
      invite: 'Wilt u er een toevoegen?',
    },
    input: {
      file: {
        upload_several: 'Drag en drop bestanden om te uploaden, of klik om bestanden te selecteren.',
        upload_single: 'Drag en drop een bestand om te uploaden, of klik om een bestand te selecteren.',
      },
      image: {
        upload_several: 'Drag en drop afbeeldingen om te uploaden, of klik om bestanden te selecteren.',
        upload_single: 'Drag en drop een afbeelding om te uploaden, of klik om een bestand te selecteren.',
      },
      references: {
        all_missing: 'De gerefereerde elementen konden niet gevonden worden.',
        many_missing: 'Een of meer van de gerefereerde elementen is niet meer beschikbaar.',
        single_missing: 'Een van de gerefereerde elementen is niet meer beschikbaar',
      },
      password: {
        toggle_visible: 'Wachtwoord verbergen',
        toggle_hidden: 'Wachtwoord tonen',
      },
    },
    message: {
      about: 'Over',
      are_you_sure: 'Weet u het zeker?',
      auth_error: 'auth_error',
      bulk_delete_content:
        'Weet u zeker dat u dit %{name} item wilt verwijderen? |||| Weet u zeker dat u deze %{smart_count} items wilt verwijderen?',
      bulk_delete_title: 'Verwijder %{name} |||| Verwijder %{smart_count} %{name}',
      bulk_update_content:
        'Weet u zeker dat u dit %{name} wilt updaten? |||| Weet u zeker dat u deze %{smart_count} items wilt updaten?',
      bulk_update_title: 'Update %{name} |||| Update %{smart_count} %{name}',
      clear_array_input: 'Weet u zeker dat u de lijst wilt wissen?',
      delete_content: 'Weet u zeker dat u dit item wilt verwijderen?',
      delete_title: '%{name} #%{id} verwijderen',
      details: 'Details',
      error: 'Er is een clientfout opgetreden en uw aanvraag kon niet worden voltooid.',
      invalid_form: 'Het formulier is ongeldig. Controleer a.u.b. de foutmeldingen',
      loading: 'De pagina is aan het laden, een moment a.u.b.',
      no: 'Nee',
      not_found: 'U heeft een verkeerde URL ingevoerd of een defecte link aangeklikt.',
      yes: 'Ja',
      unsaved_changes: 'Sommige van uw wijzigingen zijn niet opgeslagen. Weet u zeker dat u ze wilt negeren?',
    },
    sort: {
      sort_by: 'Sorteren op %{field} %{order}',
      ASC: 'oplopend',
      DESC: 'aflopend',
    },
    navigation: {
      no_results: 'Geen resultaten gevonden',
      no_more_results: 'Pagina %{page} ligt buiten het bereik. Probeer de vorige pagina.',
      page_out_of_boundaries: 'Paginanummer %{page} buiten bereik',
      page_out_from_end: 'Laatste pagina',
      page_out_from_begin: 'Eerste pagina',
      page_range_info: '%{offsetBegin}-%{offsetEnd} van %{total}',
      prev: 'Vorige',
      partial_page_range_info: '%{offsetBegin}-%{offsetEnd} van meer dan %{offsetEnd}',
      page_rows_per_page: 'Rijen per pagina:',
      current_page: 'Pagina %{page}',
      page: 'Ga naar pagina %{page}',
      first: 'Ga naar eerste pagina',
      last: 'Ga naar laatste pagina',
      next: 'Volgende',
      previous: 'Go to previous page',
      skip_nav: 'Doorgaan naar artikel',
      no_filtered_results: 'no_filtered_results',
      clear_filters: 'clear_filters',
    },
    auth: {
      auth_check_error: 'Log in om door te gaan',
      user_menu: 'Profiel',
      username: 'Gebruikersnaam',
      password: 'Wachtwoord',
      sign_in: 'Inloggen',
      sign_in_error: 'Authenticatie mislukt, probeer opnieuw a.u.b.',
      logout: 'Uitloggen',
    },
    notification: {
      updated: 'Element bijgewerkt |||| %{smart_count} elementen bijgewerkt',
      created: 'Element toegevoegd',
      deleted: 'Element verwijderd |||| %{smart_count} elementen verwijderd',
      bad_item: 'Incorrect element',
      item_doesnt_exist: 'Element bestaat niet',
      http_error: 'Server communicatie fout',
      data_provider_error: 'dataProvider fout. Open console voor meer details.',
      i18n_error: 'Kan de vertalingen voor de opgegeven taal niet laden',
      canceled: 'Actie geannuleerd',
      logged_out: 'Uw sessie is beëindigd, maak opnieuw verbinding.',
      not_authorized: 'U heeft geen toegang tot deze bron.',
      application_update_available: 'application_update_available',
    },
    validation: {
      required: 'Verplicht',
      minLength: 'Moet minimaal %{min} karakters bevatten',
      maxLength: 'Mag hooguit %{max} karakters bevatten',
      minValue: 'Moet groter of gelijk zijn aan %{min}',
      maxValue: 'Moet kleiner of gelijk zijn aan %{max}',
      number: 'Moet een getal zijn',
      email: 'Moet een geldig e-mailadres zijn',
      oneOf: 'Moet een zijn van: %{options}',
      regex: 'Moet overeenkomen met een specifiek format (regexp): %{pattern}',
    },
    saved_queries: {
      label: 'Opgeslagen zoekopdrachten',
      query_name: 'Naam zoekopdracht',
      new_label: 'Huidige zoekopdracht opslaan...',
      new_dialog_title: 'Huidige zoekopdracht opslaan als',
      remove_label: 'Opgeslagen zoekopdracht verwijderen',
      remove_label_with_name: 'Zoekopdracht "%{name}" verwijderen',
      remove_dialog_title: 'Opgeslagen zoekopdracht verwijderen?',
      remove_message: 'Weet u zeker dat u dit item uit uw lijst met opgeslagen zoekopdrachten wilt verwijderen?',
      help: 'Filter de lijst en sla deze zoekopdracht op voor later',
    },
    configurable: {
      customize: 'Aanpassen',
      configureMode: 'Pas deze pagina aan',
      inspector: {
        title: 'Inspecteren',
        content: 'Beweeg over de UI elementen om ze aan te passen',
        reset: 'Instellingen resetten',
        hideAll: 'Alles verbergen',
        showAll: 'Alles tonen',
      },
      Datagrid: {
        title: 'Datagrid',
        unlabeled: 'Labelloze rij #%{column}',
      },
      SimpleForm: {
        title: 'Formulier',
        unlabeled: 'Labelloos veld #%{input}',
      },
      SimpleList: {
        title: 'Lijst',
        primaryText: 'Primaire tekst',
        secondaryText: 'Secundaire tekst',
        tertiaryText: 'Tertiaire tekst',
      },
    },
  },
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
