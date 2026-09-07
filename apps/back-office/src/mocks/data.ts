import type {
  AssetOutput,
  DateAnswerQuestionOutput,
  FormTextAreaComponentOutput,
  MeldingOutput,
  TextAnswerQuestionOutput,
  TimeAnswerQuestionOutput,
  ValueLabelAnswerQuestionOutput,
} from '@meldingen/api-client'

export const melding: MeldingOutput = {
  city: 'Amsterdam',
  classification: {
    created_at: '2025-02-18T10:34:29.103642Z',
    id: 1,
    name: 'Test classification',
    updated_at: '2025-02-18T10:34:40.730569Z',
  },
  created_at: '2025-02-18T10:34:29.103642Z',
  email: 'email@email.email',
  geo_location: null,
  house_number: 202,
  house_number_addition: 'A',
  id: 123,
  labels: [
    { created_at: '2025-02-18T10:34:29.103642Z', id: 0, name: 'Label 1', updated_at: '2025-02-18T10:34:40.730569Z' },
    { created_at: '2025-02-18T10:34:29.103642Z', id: 1, name: 'Label 2', updated_at: '2025-02-18T10:34:40.730569Z' },
  ],
  phone: '0612345678',
  postal_code: '1016BS',
  public_id: 'ABC',
  source: {
    created_at: '2025-02-18T10:34:29.103642Z',
    id: 2,
    name: 'E-mail',
    updated_at: '2025-02-18T10:34:40.730569Z',
  },
  state: 'questions_answered',
  street: 'Herengracht',
  text: 'Alles',
  updated_at: '2025-02-18T10:34:40.730569Z',
  urgency: 0,
}

export const meldingen: MeldingOutput[] = [
  melding,
  {
    city: 'Amsterdam',
    classification: null,
    created_at: '2025-02-18T10:34:29.103642Z',
    email: 'email@email.email',
    geo_location: null,
    house_number: null,
    house_number_addition: null,
    id: 2,
    phone: '0612345678',
    postal_code: null,
    public_id: 'ABC',
    state: 'questions_answered',
    street: null,
    text: 'Alles',
    updated_at: '2025-02-18T10:34:40.730569Z',
    urgency: 0,
  },
  {
    city: 'Amsterdam',
    classification: null,
    created_at: '2025-02-18T10:34:29.103642Z',
    email: 'email@email.email',
    geo_location: null,
    house_number: null,
    house_number_addition: null,
    id: 3,
    phone: '0612345678',
    postal_code: null,
    public_id: 'ABC',
    state: 'questions_answered',
    street: null,
    text: 'Alles',
    updated_at: '2025-02-18T10:34:40.730569Z',
    urgency: 0,
  },
]

export const textAreaComponent: FormTextAreaComponentOutput = {
  autoExpand: false,
  description: '',
  input: true,
  key: 'textArea1',
  label: 'First question',
  maxCharCount: 100,
  position: 1,
  question: 1,
  type: 'textarea',
}

export const additionalQuestions: TextAnswerQuestionOutput[] = [
  {
    created_at: '2025-02-18T10:34:32.181638Z',
    id: 123,
    original_question_text: 'Wat wilt u melden?',
    question: {
      created_at: '2025-02-17T11:06:22.137002Z',
      id: 35,
      text: 'Wat wilt u melden?',
      updated_at: '2025-02-17T11:06:22.137002Z',
    },
    text: 'q1',
    type: 'text',
    updated_at: '2025-02-18T10:34:32.181638Z',
  },
  {
    created_at: '2025-02-18T10:34:32.187573Z',
    id: 124,
    original_question_text: 'Text Field',
    question: {
      created_at: '2025-02-17T11:06:22.137002Z',
      id: 36,
      text: 'Text Field',
      updated_at: '2025-02-17T11:06:22.137002Z',
    },
    text: 'q2',
    type: 'text',
    updated_at: '2025-02-18T10:34:32.187573Z',
  },
]

export const additionalDateQuestion: DateAnswerQuestionOutput = {
  created_at: '2026-08-10T10:21:03Z',
  date: {
    converted_date: '2026-08-06',
    label: 'Donderdag 6 augustus',
    value: 'day - 4',
  },
  id: 12,
  original_question_text: 'Welke dag was het?',
  question: {
    created_at: '2026-08-10T10:13:05Z',
    id: 2,
    text: 'Welke dag was het?',
    updated_at: '2026-08-10T10:13:05Z',
  },
  type: 'date',
  updated_at: '2026-08-10T10:21:03Z',
}

export const additionalTimeQuestion: TimeAnswerQuestionOutput = {
  created_at: '2025-02-18T10:34:32.193123Z',
  id: 125,
  original_question_text: 'Tijd veld',
  question: {
    created_at: '2025-02-17T11:06:22.137002Z',
    id: 37,
    text: 'Tijd veld',
    updated_at: '2025-02-17T11:06:22.137002Z',
  },
  time: '14:30',
  type: 'time',
  updated_at: '2025-02-18T10:34:32.193123Z',
}

export const additionalValueLabelQuestion: ValueLabelAnswerQuestionOutput = {
  created_at: '2025-02-18T10:34:32.200456Z',
  id: 126,
  original_question_text: 'Keuze veld',
  question: {
    created_at: '2025-02-17T11:06:22.137002Z',
    id: 38,
    text: 'Keuze veld',
    updated_at: '2025-02-17T11:06:22.137002Z',
  },
  type: 'value_label',
  updated_at: '2025-02-18T10:34:32.200456Z',
  values_and_labels: [
    { label: 'Option 1', value: 'option_1' },
    { label: 'Option 2', value: 'option_2' },
    { label: 'Option 3', value: 'option_3' },
  ],
}

export const asset: AssetOutput = {
  created_at: '2025-02-18T10:34:29.103642Z',
  external_id: 'ext-1',
  id: 1,
  label: 'Asset 1',
  subtype: 'containers',
  updated_at: '2025-02-18T10:34:40.730569Z',
}
