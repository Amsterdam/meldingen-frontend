import {
  AnswerQuestionOutput,
  Feature,
  FormCheckboxComponentOutput,
  FormOutput,
  FormTextAreaComponentOutput,
  MeldingOutput,
} from '@meldingen/api-client'

// Form
export const textAreaComponent: FormTextAreaComponentOutput = {
  label: 'First question',
  description: '',
  key: 'textArea1',
  type: 'textarea',
  input: true,
  autoExpand: false,
  maxCharCount: 0,
  position: 1,
  question: 1,
}

export const checkboxComponent: FormCheckboxComponentOutput = {
  label: 'Select Boxes 1',
  description: '',
  key: 'selectBoxes',
  type: 'selectboxes',
  input: true,
  position: 1,
  validate: {
    json: null,
    required: true,
    required_error_message: 'Dit veld is verplicht',
  },
  values: [
    {
      label: 'One',
      value: 'one',
      position: 1,
    },
    {
      label: 'Two',
      value: 'two',
      position: 2,
    },
  ],
  question: 2,
}

export const form: FormOutput = {
  title: 'Wizard form mock',
  display: 'wizard',
  created_at: '2024-07-16T13:13:30.968809',
  updated_at: '2024-07-16T13:13:30.968809',
  id: 2,
  classification: 1,
  components: [
    {
      title: 'First page',
      label: 'Page 1',
      key: 'page1',
      type: 'panel',
      input: false,
      position: 1,
      components: [textAreaComponent],
    },
    {
      title: 'Second page',
      label: 'Page 2',
      key: 'page2',
      type: 'panel',
      input: false,
      position: 2,
      components: [
        {
          label: 'Second question',
          description: '',
          key: 'textArea2',
          type: 'textarea',
          input: true,
          autoExpand: false,
          maxCharCount: 0,
          position: 1,
          question: 2,
          values: undefined,
        },
      ],
    },
  ],
}

export const contact: FormTextAreaComponentOutput[] = [
  {
    type: 'textarea',
    label: 'Wat is uw e-mailadres?',
    description: 'Test 1',
    key: 'email',
    input: true,
    maxCharCount: 0,
    position: 0,
    autoExpand: false,
    question: 1,
  },
  {
    type: 'textarea',
    label: 'Wat is uw telefoonnummer?',
    description: 'Test 2',
    key: 'tel',
    input: true,
    maxCharCount: 0,
    position: 1,
    autoExpand: false,
    question: 2,
  },
]

// PDOK
export const PDOKFree = {
  response: {
    docs: [
      {
        weergavenaam: 'Amstel 1, Amsterdam',
        centroide_ll: 'POINT(4.895168 52.370216)',
      },
    ],
  },
}

export const PDOKReverse = {
  response: {
    numFound: 1,
    docs: [
      {
        type: 'adres',
        weergavenaam: 'Nieuwmarkt 15, 1011JR Amsterdam',
        id: 'adr-758e934b8651217819abcf0e60a45b39',
      },
    ],
  },
}

export const PDOKSuggest = {
  response: {
    docs: [
      {
        weergavenaam: 'Amsteldijk 152A-H, 1079LG Amsterdam',
        id: 'adr-bc581db7d4fc654e4ed35abce874ee11',
      },
      {
        weergavenaam: 'Amstelkade 166A-H, 1078AX Amsterdam',
        id: 'adr-8d27e7c75aef4349f37e1bebae62d45a',
      },
      {
        weergavenaam: 'Amstelkade 169A-H, 1078AZ Amsterdam',
        id: 'adr-6da11c41a94dad446b1ddcf3cdf927e6',
      },
      {
        weergavenaam: 'Amstelveenseweg 170B-H, 1075XP Amsterdam',
        id: 'adr-e15725abe37eb0e4dfeecad2f1055f83',
      },
      {
        weergavenaam: 'Amstel 312A-H, 1017AP Amsterdam',
        id: 'adr-1e36f861ba5cede46a2c8e1b53bd55a2',
      },
    ],
  },
}

// Melding
export const melding: MeldingOutput = {
  public_id: 'AB123',
  id: 123,
  created_at: '2025-02-18T10:34:29.103642',
  updated_at: '2025-02-18T10:34:40.730569',
  text: 'Alles',
  state: 'questions_answered',
  classification: {
    id: 2,
    created_at: '2025-07-15T09:43:46Z',
    updated_at: '2025-07-15T09:43:46Z',
    name: 'container',
  },
  geo_location: {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [52.370216, 4.895168] },
    properties: {},
  },
  email: 'email@email.email',
  phone: '0612345678',
  street: 'Oudezijds Voorburgwal',
  house_number: 300,
  house_number_addition: 'A',
  postal_code: '1012GL',
  city: 'Amsterdam',
}

export const additionalQuestions: AnswerQuestionOutput[] = [
  {
    id: 123,
    created_at: '2025-02-18T10:34:32.181638',
    updated_at: '2025-02-18T10:34:32.181638',
    text: 'q1',
    question: {
      id: 35,
      created_at: '2025-02-17T11:06:22.137002',
      updated_at: '2025-02-17T11:06:22.137002',
      text: 'Wat wilt u melden?',
    },
  },
  {
    id: 124,
    created_at: '2025-02-18T10:34:32.187573',
    updated_at: '2025-02-18T10:34:32.187573',
    text: 'q2',
    question: {
      id: 36,
      created_at: '2025-02-17T11:06:22.137002',
      updated_at: '2025-02-17T11:06:22.137002',
      text: 'Text Field',
    },
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
      name: 'Test Feature',
      id_nummer: 'Container-001',
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
      name: 'Test Feature',
      id_nummer: 'Container-002',
    },
    type: 'Feature',
  },
]
