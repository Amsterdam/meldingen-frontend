import { render } from '@testing-library/react'
import React from 'react'
import { AdminContext, SimpleForm } from 'react-admin'

import { HiddenComponentsInput } from './HiddenComponentsInput'

describe('HiddenComponentsInput', () => {
  it.skip('should set the input value when value is passed', async () => {})
  it('should call setInitialValue when no value is passed and input has value', () => {
    const mockFn = jest.fn()
    const testValue = 'testValue'

    render(
      <AdminContext>
        <SimpleForm defaultValues={{ components: testValue }}>
          <HiddenComponentsInput setInitialValue={mockFn} />
        </SimpleForm>
      </AdminContext>,
    )
    expect(mockFn).toHaveBeenCalledWith(testValue)
  })
  it('should not call setInitialValue when value is passed and input has value', () => {
    const mockFn = jest.fn()
    const testValue = 'testValue'

    render(
      <AdminContext>
        <SimpleForm defaultValues={{ components: testValue }}>
          <HiddenComponentsInput value={[{ label: 'testValue' }]} setInitialValue={mockFn} />
        </SimpleForm>
      </AdminContext>,
    )
    expect(mockFn).not.toHaveBeenCalled()
  })
})
