import { AnswerQuestionOutput, MeldingOutput } from '../apiClientProxy'

export const melding: MeldingOutput = {
  city: 'Amsterdam',
  classification: {
    id: 1,
    created_at: '2025-02-18T10:34:29.103642',
    updated_at: '2025-02-18T10:34:40.730569',
    name: 'Test classification',
  },
  created_at: '2025-02-18T10:34:29.103642',
  email: 'email@email.email',
  geo_location: null,
  house_number: 202,
  house_number_addition: 'A',
  id: 123,
  phone: '0612345678',
  postal_code: '1016BS',
  public_id: 'ABC',
  state: 'questions_answered',
  street: 'Herengracht',
  text: 'Alles',
  updated_at: '2025-02-18T10:34:40.730569',
}

export const meldingen: MeldingOutput[] = [
  melding,
  {
    city: 'Amsterdam',
    classification: null,
    created_at: '2025-02-18T10:34:29.103642',
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
    updated_at: '2025-02-18T10:34:40.730569',
  },
  {
    city: 'Amsterdam',
    classification: null,
    created_at: '2025-02-18T10:34:29.103642',
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
    updated_at: '2025-02-18T10:34:40.730569',
  },
]

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
