import type { Component } from '@formio/core'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BuilderInput } from './BuilderInput'

const watchedComponents: Component[] = [
  {
    key: 'page-1',
    type: 'panel',
  } as Component,
]

const updatedComponents: Component[] = [
  {
    key: 'page-2',
    type: 'panel',
  } as Component,
]

const mocks = vi.hoisted(() => ({
  formBuilder: vi.fn(
    ({ onChange }: { components?: Component[]; onChange: (schema: { components: Component[] }) => void }) => (
      <button onClick={() => onChange({ components: updatedComponents })} type="button">
        Trigger builder change
      </button>
    ),
  ),
  setValue: vi.fn(),
  textInput: vi.fn(({ source }: { source: string }) => <input aria-label={source} type="text" />),
  useWatch: vi.fn(),
}))

vi.mock('react-hook-form', async () => {
  const actual = await import('react-hook-form')

  return {
    ...actual,
    useFormContext: () => ({
      control: {},
      setValue: mocks.setValue,
    }),
    useWatch: (...args: unknown[]) => mocks.useWatch(...args),
  }
})

vi.mock('react-admin', async () => {
  const actual = await import('react-admin')

  return {
    ...actual,
    TextInput: (props: { source: string }) => mocks.textInput(props),
  }
})

vi.mock('@meldingen/form-builder', () => ({
  FormBuilder: (props: { components?: Component[]; onChange: (schema: { components: Component[] }) => void }) =>
    mocks.formBuilder(props),
}))

describe('BuilderInput', () => {
  beforeEach(() => {
    mocks.formBuilder.mockClear()
    mocks.setValue.mockClear()
    mocks.textInput.mockClear()
    mocks.useWatch.mockReset()
    mocks.useWatch.mockReturnValue(watchedComponents)
  })

  it('passes watched components to the form builder', () => {
    render(<BuilderInput />)

    expect(mocks.useWatch).toHaveBeenCalledWith({ control: {}, defaultValue: [], name: 'components' })
    expect(mocks.textInput).toHaveBeenCalledWith(expect.objectContaining({ source: 'components' }))
    expect(mocks.formBuilder).toHaveBeenCalledWith(
      expect.objectContaining({
        components: watchedComponents,
        onChange: expect.any(Function),
      }),
    )
  })

  it('writes builder changes back to form state', async () => {
    const user = userEvent.setup()

    render(<BuilderInput />)

    await user.click(screen.getByRole('button', { name: 'Trigger builder change' }))

    expect(mocks.setValue).toHaveBeenCalledWith('components', updatedComponents)
  })
})
