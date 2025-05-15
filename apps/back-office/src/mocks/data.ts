import { MeldingOutput } from '../apiClientProxy'

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
