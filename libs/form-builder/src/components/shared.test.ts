import { getContextComponents } from '@formio/js/utils'

import { conditionalTab, convertEmptyStringToNull } from './shared'
import { Context } from './types'

vi.mock('@formio/js/utils', () => ({
  getContextComponents: vi.fn(),
}))

describe('conditionalTab', () => {
  it("calls getContextComponents with context and false for 'When' field", () => {
    const whenField = conditionalTab.components.find((c) => c.key === 'conditional.when')

    const context = { instance: {} }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(whenField as any)?.data?.custom(context)

    expect(getContextComponents).toHaveBeenCalledWith(context, false)
  })
})

describe('convertEmptyStringToNull', () => {
  it('sets conditional.show to null if it is an empty string', () => {
    const context = { data: { conditional: { show: '' } } } as Context

    const result = convertEmptyStringToNull(context)

    expect(result).toBe(true)
    expect(context.data?.conditional?.show).toBeNull()
  })

  it('does not modify conditional.show if it is not an empty string', () => {
    const context = { data: { conditional: { show: 'true' } } } as Context

    const result = convertEmptyStringToNull(context)

    expect(result).toBe(true)
    expect(context.data?.conditional?.show).toBe('true')
  })
})
