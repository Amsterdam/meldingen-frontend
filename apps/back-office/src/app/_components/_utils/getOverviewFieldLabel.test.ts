import { OVERVIEW_FIELDS } from '../../constants'
import { getOverviewFieldLabel } from './getOverviewFieldLabel'

const t = (key: string) => key

describe('getOverviewFieldLabel', () => {
  it('builds the detail url using id and public_id', () => {
    expect(getOverviewFieldLabel(OVERVIEW_FIELDS[0], t)).toBe(`overview.${OVERVIEW_FIELDS[0].labelKey}`)
  })
})
