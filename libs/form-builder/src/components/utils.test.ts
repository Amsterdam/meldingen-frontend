import {
  getJsonLogicValue,
  getMaxLengthErrorMessageValue,
  getMaxLengthValue,
  getMinLengthErrorMessageValue,
  getMinLengthValue,
} from './utils'

describe('getMaxLengthValue', () => {
  it('returns maxLength rule when maxLength is set', () => {
    const context = {
      data: { validate: { maxLength: 50 } },
      self: { pristine: false },
    }
    const result = getMaxLengthValue(context)
    expect(result).toBe(50)
  })

  it('returns maxLength from json logic on first load', () => {
    const context = {
      data: {
        validate: {
          json: {
            if: [{ '<=': [{ length: [{ var: 'text' }] }, 100] }, true, 'Max length exceeded'],
          },
        },
      },
      self: { pristine: true },
    }
    const result = getMaxLengthValue(context)
    expect(result).toBe(100)
  })

  it('returns empty string when maxLength is not set', () => {
    const context = {
      data: { validate: { maxLength: undefined } },
      self: { pristine: false },
    }
    const result = getMaxLengthValue(context)
    expect(result).toBe('')
  })

  it('returns empty string when json logic is not set', () => {
    const context = {
      data: {
        validate: {
          json: {},
        },
      },
      self: { pristine: true },
    }
    const result = getMaxLengthValue(context)
    expect(result).toBe('')
  })
})

describe('getMaxLengthErrorMessageValue', () => {
  it('returns maxLengthErrorMessage when set', () => {
    const context = {
      data: { validate: { maxLengthErrorMessage: 'Too long!' } },
      self: { pristine: false },
    }
    const result = getMaxLengthErrorMessageValue(context, 50)
    expect(result).toBe('Too long!')
  })

  it('returns maxLengthErrorMessage from json logic on first load', () => {
    const context = {
      data: {
        validate: {
          json: {
            if: [{ '<=': [{ length: [{ var: 'text' }] }, 100] }, true, 'Max length exceeded'],
          },
        },
      },
      self: { pristine: true },
    }
    const result = getMaxLengthErrorMessageValue(context, 100)
    expect(result).toBe('Max length exceeded')
  })

  it('returns empty string when maxLengthErrorMessage is not set', () => {
    const context = {
      data: { validate: { maxLengthErrorMessage: undefined } },
      self: { pristine: false },
    }
    const result = getMaxLengthErrorMessageValue(context, 50)
    expect(result).toBe('')
  })

  it('returns empty string when json logic is not set', () => {
    const context = {
      data: {
        validate: {
          json: {},
        },
      },
      self: { pristine: true },
    }
    const result = getMaxLengthErrorMessageValue(context, 100)
    expect(result).toBe('')
  })
})

describe('getMinLengthValue', () => {
  it('returns minLength rule when minLength is set', () => {
    const context = {
      data: { validate: { minLength: 10 } },
      self: { pristine: false },
    }
    const result = getMinLengthValue(context)
    expect(result).toBe(10)
  })

  it('returns minLength from non-nested json logic on first load', () => {
    const context = {
      data: {
        validate: {
          json: {
            if: [{ '>=': [{ length: [{ var: 'text' }] }, 5] }, true, 'Min length not met'],
          },
        },
      },
      self: { pristine: true },
    }
    const result = getMinLengthValue(context)
    expect(result).toBe(5)
  })

  it('returns minLength from nested json logic on first load', () => {
    const context = {
      data: {
        validate: {
          json: {
            if: [
              { '<=': [{ length: [{ var: 'text' }] }, 100] },
              {
                if: [{ '>=': [{ length: [{ var: 'text' }] }, 5] }, true, 'Min length not met'],
              },
              'Max length exceeded',
            ],
          },
        },
      },
      self: { pristine: true },
    }
    const result = getMinLengthValue(context)
    expect(result).toBe(5)
  })

  it('returns empty string when minLength is not set', () => {
    const context = {
      data: { validate: { minLength: undefined } },
      self: { pristine: false },
    }
    const result = getMinLengthValue(context)
    expect(result).toBe('')
  })

  it('returns empty string when json logic is not set', () => {
    const context = {
      data: {
        validate: {
          json: {},
        },
      },
      self: { pristine: true },
    }
    const result = getMinLengthValue(context)
    expect(result).toBe('')
  })
})

describe('getMinLengthErrorMessageValue', () => {
  it('returns minLengthErrorMessage when set', () => {
    const context = {
      data: { validate: { minLengthErrorMessage: 'Too short!' } },
      self: { pristine: false },
    }
    const result = getMinLengthErrorMessageValue(context, 10)
    expect(result).toBe('Too short!')
  })

  it('returns minLengthErrorMessage from non-nested json logic on first load', () => {
    const context = {
      data: {
        validate: {
          json: {
            if: [{ '>=': [{ length: [{ var: 'text' }] }, 5] }, true, 'Min length not met'],
          },
        },
      },
      self: { pristine: true },
    }
    const result = getMinLengthErrorMessageValue(context, 5)
    expect(result).toBe('Min length not met')
  })

  it('returns minLengthErrorMessage from nested json logic on first load', () => {
    const context = {
      data: {
        validate: {
          json: {
            if: [
              { '<=': [{ length: [{ var: 'text' }] }, 100] },
              {
                if: [{ '>=': [{ length: [{ var: 'text' }] }, 5] }, true, 'Min length not met'],
              },
              'Max length exceeded',
            ],
          },
        },
      },
      self: { pristine: true },
    }
    const result = getMinLengthErrorMessageValue(context, 5)
    expect(result).toBe('Min length not met')
  })

  it('returns empty string when json logic is not set', () => {
    const context = {
      data: {
        validate: {
          json: {},
        },
      },
      self: { pristine: true },
    }
    const result = getMinLengthErrorMessageValue(context, 5)
    expect(result).toBe('')
  })

  it('returns minLengthErrorMessage when pristine but minLengthValue is empty', () => {
    const context = {
      data: { validate: { minLengthErrorMessage: undefined } },
      self: { pristine: true },
    }
    const result = getMinLengthErrorMessageValue(context, '')
    expect(result).toBe('')
  })
})

describe('getJsonLogicValue', () => {
  it('returns correct json logic for both minLength and maxLength set', () => {
    const context = {
      data: {
        validate: {
          maxLength: 10,
          maxLengthErrorMessage: 'Too long!',
          minLength: 5,
          minLengthErrorMessage: 'Too short!',
        },
      },
      self: { pristine: false },
    }
    const result = getJsonLogicValue(context)
    expect(result).toEqual({
      if: [
        { '<=': [{ length: [{ var: 'text' }] }, 10] },
        {
          if: [{ '>=': [{ length: [{ var: 'text' }] }, 5] }, true, 'Too short!'],
        },
        'Too long!',
      ],
    })
  })

  it('returns correct json logic for only minLength set', () => {
    const context = {
      data: {
        validate: {
          maxLength: '' as const,
          minLength: 5,
          minLengthErrorMessage: 'Too short!',
        },
      },
      self: { pristine: false },
    }
    const result = getJsonLogicValue(context)
    expect(result).toEqual({
      if: [{ '>=': [{ length: [{ var: 'text' }] }, 5] }, true, 'Too short!'],
    })
  })

  it('returns correct json logic for only maxLength set', () => {
    const context = {
      data: {
        validate: {
          maxLength: 10,
          maxLengthErrorMessage: 'Too long!',
          minLength: '' as const,
        },
      },
      self: { pristine: false },
    }
    const result = getJsonLogicValue(context)
    expect(result).toEqual({
      if: [{ '<=': [{ length: [{ var: 'text' }] }, 10] }, true, 'Too long!'],
    })
  })

  it('returns empty string when neither minLength nor maxLength are set', () => {
    const context = {
      data: {
        validate: {
          maxLength: '' as const,
          minLength: '' as const,
        },
      },
      self: { pristine: false },
    }
    const result = getJsonLogicValue(context)
    expect(result).toBe('')
  })

  it('uses empty string as maxLengthMessage when not provided', () => {
    const context = {
      data: { validate: { maxLength: 5, minLength: '' as const } },
      self: { pristine: false },
    }
    const result = getJsonLogicValue(context)
    expect(result).toEqual({
      if: [{ '<=': [{ length: [{ var: 'text' }] }, 5] }, true, ''],
    })
  })
})
