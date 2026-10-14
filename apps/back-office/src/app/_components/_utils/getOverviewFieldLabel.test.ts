import { OVERVIEW_FIELDS } from '../../constants'
import { getOverviewFieldLabel } from './getOverviewFieldLabel'

describe('getOverviewFieldLabel', () => {
  it('builds the detail url using id and public_id', () => {
    expect(getOverviewFieldLabel(OVERVIEW_FIELDS[0])).toBe(`overview.${OVERVIEW_FIELDS[0].labelKey}`)
  })
})
