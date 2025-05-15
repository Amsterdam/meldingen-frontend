import { AnswerQuestionOutput, MeldingOutput } from '../apiClientProxy'

export const melding: MeldingOutput = {
  id: 123,
  created_at: '2025-02-18T10:34:29.103642',
  updated_at: '2025-02-18T10:34:40.730569',
  text: 'Alles',
  state: 'questions_answered',
  classification: null,
  geo_location: null,
  email: 'email@email.email',
  phone: '0612345678',
  public_id: 'ABC',
}

export const meldingen: MeldingOutput[] = [
  melding,
  {
    id: 2,
    created_at: '2025-02-18T10:34:29.103642',
    updated_at: '2025-02-18T10:34:40.730569',
    text: 'Alles',
    state: 'questions_answered',
    classification: null,
    geo_location: null,
    email: 'email@email.email',
    phone: '0612345678',
    public_id: 'ABC',
  },
  {
    id: 3,
    created_at: '2025-02-18T10:34:29.103642',
    updated_at: '2025-02-18T10:34:40.730569',
    text: 'Alles',
    state: 'questions_answered',
    classification: null,
    geo_location: null,
    email: 'email@email.email',
    phone: '0612345678',
    public_id: 'ABC',
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
