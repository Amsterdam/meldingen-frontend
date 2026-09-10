import { render, waitFor } from '@testing-library/react'

import { FormBuilder } from './FormBuilder'

type MockFormSchema = {
  components: unknown[]
  display: 'wizard'
}

type MockBuilder = {
  form: MockFormSchema
  instance: {
    destroy: ReturnType<typeof vi.fn>
    form: MockFormSchema
    on: ReturnType<typeof vi.fn>
  }
  ready: Promise<unknown>
  setForm: ReturnType<typeof vi.fn>
}

const mocks = vi.hoisted(() => {
  let nextReady: Promise<unknown> | null = null

  class MockFormioComponent {
    component = { label: '' }

    static schema(schema: unknown) {
      return schema
    }

    render(content: string) {
      return content
    }

    renderTemplate() {
      return ''
    }
  }

  const builders: MockBuilder[] = []

  return {
    builders,
    componentTypes: {
      component: MockFormioComponent,
      panel: MockFormioComponent,
      radio: MockFormioComponent,
      select: MockFormioComponent,
      selectboxes: MockFormioComponent,
      textarea: MockFormioComponent,
      textfield: MockFormioComponent,
      time: MockFormioComponent,
    },
    formBuilder: vi.fn(
      class MockFormBuilder {
        constructor() {
          const builder: MockBuilder = {
            form: { components: [], display: 'wizard' as const },
            instance: {
              destroy: vi.fn(),
              form: { components: [], display: 'wizard' as const },
              on: vi.fn(),
            },
            ready: nextReady ?? Promise.resolve(),
            setForm: vi.fn(async (nextForm: MockFormSchema) => {
              builder.form = nextForm
              builder.instance.form = nextForm

              return builder.instance
            }),
          }

          nextReady = null

          builders.push(builder)

          return builder
        }
      },
    ),
    getNextReady: () => nextReady,
    setComponents: vi.fn(),
    setNextReady: (promise: Promise<unknown>) => {
      nextReady = promise
    },
  }
})

vi.mock('@formio/js', () => ({
  Components: {
    components: mocks.componentTypes,
    setComponents: mocks.setComponents,
  },
  FormBuilder: mocks.formBuilder,
}))

const initialComponents = [
  {
    input: false,
    key: 'page1',
    type: 'panel',
  },
]

const updatedComponents = [
  {
    input: false,
    key: 'page2',
    type: 'panel',
  },
]

describe('FormBuilder', () => {
  beforeEach(() => {
    mocks.builders.length = 0
    mocks.formBuilder.mockClear()
    if (mocks.getNextReady()) {
      mocks.setNextReady(Promise.resolve())
    }
  })

  it('keeps one builder instance and syncs components through setForm', async () => {
    const { rerender, unmount } = render(<FormBuilder components={initialComponents} onChange={vi.fn()} />)

    await waitFor(() => {
      expect(mocks.formBuilder).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(mocks.builders[0].setForm).toHaveBeenCalledWith({
        components: initialComponents,
        display: 'wizard',
      })
    })

    rerender(<FormBuilder components={updatedComponents} onChange={vi.fn()} />)

    expect(mocks.formBuilder).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(mocks.builders[0].setForm).toHaveBeenLastCalledWith({
        components: updatedComponents,
        display: 'wizard',
      })
    })

    unmount()

    expect(mocks.builders[0].instance.destroy).toHaveBeenCalledWith(true)
  })

  it('uses the latest onChange handler for builder events', async () => {
    const firstOnChange = vi.fn()
    const secondOnChange = vi.fn()
    const { rerender } = render(<FormBuilder components={initialComponents} onChange={firstOnChange} />)

    await waitFor(() => {
      expect(mocks.builders[0].instance.on).toHaveBeenCalled()
    })

    rerender(<FormBuilder components={updatedComponents} onChange={secondOnChange} />)

    const saveComponentHandler = mocks.builders[0].instance.on.mock.calls.find(
      ([eventName]) => eventName === 'saveComponent',
    )?.[1]

    mocks.builders[0].instance.form = {
      components: updatedComponents,
      display: 'wizard',
    }

    saveComponentHandler()

    expect(firstOnChange).not.toHaveBeenCalled()
    expect(secondOnChange).toHaveBeenCalledWith({
      components: updatedComponents,
      display: 'wizard',
    })
  })

  it('does not re-sync when the next schema matches the current builder form', async () => {
    const { rerender } = render(<FormBuilder components={initialComponents} onChange={vi.fn()} />)

    await waitFor(() => {
      expect(mocks.builders[0].setForm).toHaveBeenCalledTimes(1)
    })

    rerender(<FormBuilder components={[{ ...initialComponents[0] }]} onChange={vi.fn()} />)

    await waitFor(() => {
      expect(mocks.builders[0].setForm).toHaveBeenCalledTimes(1)
    })
  })

  it('skips attaching handlers when the builder resolves after unmount', async () => {
    let resolveReady: (() => void) | undefined
    const ready = new Promise<void>((resolve) => {
      resolveReady = resolve
    })

    mocks.setNextReady(ready)

    const { unmount } = render(<FormBuilder components={initialComponents} onChange={vi.fn()} />)

    expect(mocks.builders[0].instance.on).not.toHaveBeenCalled()

    unmount()
    resolveReady?.()
    await ready

    expect(mocks.builders[0].instance.on).not.toHaveBeenCalled()
  })

  it('ignores saved builder handlers after unmount', async () => {
    const onChange = vi.fn()
    const { unmount } = render(<FormBuilder components={initialComponents} onChange={onChange} />)

    await waitFor(() => {
      expect(mocks.builders[0].instance.on).toHaveBeenCalled()
    })

    const saveComponentHandler = mocks.builders[0].instance.on.mock.calls.find(
      ([eventName]) => eventName === 'saveComponent',
    )?.[1]

    unmount()
    saveComponentHandler()

    expect(onChange).not.toHaveBeenCalled()
  })
})
