import { getMeldingDetailHref } from './getMeldingDetailHref'
import { melding } from '~/mocks/data'

describe('getMeldingDetailHref', () => {
  it('builds the detail url using id and public_id', () => {
    expect(getMeldingDetailHref(melding)).toBe(`/melding/${melding.id}?id=${melding.public_id}`)
  })
})
