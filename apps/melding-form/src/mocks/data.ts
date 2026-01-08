import {
  AssetOutput,
  Feature,
  FormCheckboxComponentOutput,
  FormOutput,
  FormTextAreaComponentOutput,
  MeldingOutput,
  TextAnswerQuestionOutput,
} from '@meldingen/api-client'

// Form
export const textAreaComponent: FormTextAreaComponentOutput = {
  autoExpand: false,
  description: '',
  input: true,
  key: 'textArea1',
  label: 'First question',
  maxCharCount: 0,
  position: 1,
  question: 1,
  type: 'textarea',
}

export const checkboxComponent: FormCheckboxComponentOutput = {
  description: '',
  input: true,
  key: 'selectBoxes',
  label: 'Select Boxes 1',
  position: 1,
  question: 2,
  type: 'selectboxes',
  validate: {
    json: null,
    required: true,
    required_error_message: 'Dit veld is verplicht',
  },
  values: [
    {
      label: 'One',
      position: 1,
      value: 'one',
    },
    {
      label: 'Two',
      position: 2,
      value: 'two',
    },
  ],
}

export const form: FormOutput = {
  classification: 1,
  components: [
    {
      components: [textAreaComponent],
      input: false,
      key: 'page1',
      label: 'Page 1',
      position: 1,
      title: 'First page',
      type: 'panel',
    },
    {
      components: [
        {
          autoExpand: false,
          description: '',
          input: true,
          key: 'textArea2',
          label: 'Second question',
          maxCharCount: 0,
          position: 1,
          question: 2,
          type: 'textarea',
          values: undefined,
        },
      ],
      input: false,
      key: 'page2',
      label: 'Page 2',
      position: 2,
      title: 'Second page',
      type: 'panel',
    },
  ],
  created_at: '2024-07-16T13:13:30.968809',
  display: 'wizard',
  id: 2,
  title: 'Wizard form mock',
  updated_at: '2024-07-16T13:13:30.968809',
}

export const contact: FormTextAreaComponentOutput[] = [
  {
    autoExpand: false,
    description: 'Test 1',
    input: true,
    key: 'email',
    label: 'Wat is uw e-mailadres?',
    maxCharCount: 0,
    position: 0,
    question: 1,
    type: 'textarea',
  },
  {
    autoExpand: false,
    description: 'Test 2',
    input: true,
    key: 'tel',
    label: 'Wat is uw telefoonnummer?',
    maxCharCount: 0,
    position: 1,
    question: 2,
    type: 'textarea',
  },
]

// PDOK
export const PDOKFree = {
  response: {
    docs: [
      {
        centroide_ll: 'POINT(4.895168 52.370216)',
        weergavenaam: 'Amstel 1, Amsterdam',
      },
    ],
  },
}

export const PDOKReverse = {
  response: {
    docs: [
      {
        id: 'adr-758e934b8651217819abcf0e60a45b39',
        type: 'adres',
        weergavenaam: 'Nieuwmarkt 15, 1011JR Amsterdam',
      },
    ],
    numFound: 1,
  },
}

export const PDOKSuggest = {
  response: {
    docs: [
      {
        id: 'adr-bc581db7d4fc654e4ed35abce874ee11',
        weergavenaam: 'Amsteldijk 152A-H, 1079LG Amsterdam',
      },
      {
        id: 'adr-8d27e7c75aef4349f37e1bebae62d45a',
        weergavenaam: 'Amstelkade 166A-H, 1078AX Amsterdam',
      },
      {
        id: 'adr-6da11c41a94dad446b1ddcf3cdf927e6',
        weergavenaam: 'Amstelkade 169A-H, 1078AZ Amsterdam',
      },
      {
        id: 'adr-e15725abe37eb0e4dfeecad2f1055f83',
        weergavenaam: 'Amstelveenseweg 170B-H, 1075XP Amsterdam',
      },
      {
        id: 'adr-1e36f861ba5cede46a2c8e1b53bd55a2',
        weergavenaam: 'Amstel 312A-H, 1017AP Amsterdam',
      },
    ],
  },
}

// Melding
export const melding: MeldingOutput = {
  city: 'Amsterdam',
  classification: {
    created_at: '2025-07-15T09:43:46Z',
    id: 2,
    name: 'container',
    updated_at: '2025-07-15T09:43:46Z',
  },
  created_at: '2025-02-18T10:34:29.103642',
  email: 'email@email.email',
  geo_location: {
    geometry: { coordinates: [52.370216, 4.895168], type: 'Point' },
    properties: {},
    type: 'Feature',
  },
  house_number: 300,
  house_number_addition: 'A',
  id: 123,
  phone: '0612345678',
  postal_code: '1012GL',
  public_id: 'AB123',
  state: 'questions_answered',
  street: 'Oudezijds Voorburgwal',
  text: 'Alles',
  updated_at: '2025-02-18T10:34:40.730569',
}

export const additionalQuestions: TextAnswerQuestionOutput[] = [
  {
    created_at: '2025-02-18T10:34:32.181638',
    id: 123,
    question: {
      created_at: '2025-02-17T11:06:22.137002',
      id: 35,
      text: 'Wat wilt u melden?',
      updated_at: '2025-02-17T11:06:22.137002',
    },
    text: 'q1',
    type: 'text',
    updated_at: '2025-02-18T10:34:32.181638',
  },
  {
    created_at: '2025-02-18T10:34:32.187573',
    id: 124,
    question: {
      created_at: '2025-02-17T11:06:22.137002',
      id: 36,
      text: 'Text Field',
      updated_at: '2025-02-17T11:06:22.137002',
    },
    text: 'q2',
    type: 'text',
    updated_at: '2025-02-18T10:34:32.187573',
  },
]

export const containerAssets: Feature[] = [
  {
    geometry: {
      coordinates: [4.9, 52.3],
      type: 'Point',
    },
    id: 'container.1',
    properties: {
      fractie_omschrijving: 'Restafval',
      id_nummer: 'Container-001',
      name: 'Test Feature',
    },
    type: 'Feature',
  },
  {
    geometry: {
      coordinates: [4.9, 52.4],
      type: 'Point',
    },
    id: 'container.2',
    properties: {
      fractie_omschrijving: 'Glas',
      id_nummer: 'Container-002',
      name: 'Test Feature',
    },
    type: 'Feature',
  },
]

export const containerAssetIds: AssetOutput[] = [
  {
    created_at: '2025-12-08T14:14:33Z',
    external_id: 'container.1',
    id: 69,
    updated_at: '2025-12-08T14:14:33Z',
  },
  {
    created_at: '2025-12-08T14:14:33Z',
    external_id: 'container.2',
    id: 70,
    updated_at: '2025-12-08T14:14:33Z',
  },
]
