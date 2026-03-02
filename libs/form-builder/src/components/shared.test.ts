import { getContextComponents } from '@formio/js/utils'

import { conditionalTab } from './shared'

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
