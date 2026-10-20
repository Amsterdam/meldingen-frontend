import { render } from '@testing-library/react'

import { OVERVIEW_FIELDS } from '../constants'
import { OverviewFieldLabel } from './OverviewFieldLabel'

describe('OverviewFieldLabel', () => {
  it('renders the translated label for a field', () => {
    const { container } = render(<OverviewFieldLabel field={OVERVIEW_FIELDS[0]} />)

    expect(container).toHaveTextContent(`overview.${OVERVIEW_FIELDS[0].labelKey}`)
  })
})
