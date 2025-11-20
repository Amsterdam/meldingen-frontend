import { AnswerQuestionOutput, MeldingOutput } from '../apiClientProxy'

export const melding: MeldingOutput = {
  city: 'Amsterdam',
  classification: {
    created_at: '2025-02-18T10:34:29.103642',
    id: 1,
    name: 'Test classification',
    updated_at: '2025-02-18T10:34:40.730569',
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
    created_at: '2025-02-18T10:34:32.181638',
    id: 123,
    question: {
      created_at: '2025-02-17T11:06:22.137002',
      id: 35,
      text: 'Wat wilt u melden?',
      updated_at: '2025-02-17T11:06:22.137002',
    },
    text: 'q1',
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
    updated_at: '2025-02-18T10:34:32.187573',
  },
]
