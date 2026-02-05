import { Context } from './types'

export const getMaxLengthValue = (context: Context) => {
  const validateObj = context.data?.validate
  // Form.io uses this 'pristine' value to determine if this input has been modified since load.
  if (context.self.pristine) {
    return validateObj?.json?.if?.[0]?.['<=']?.[1] ?? ''
  }
  return validateObj?.maxLength ?? ''
}

export const getMaxLengthErrorMessageValue = (context: Context, maxLengthValue: number | '') => {
  const validateObj = context.data?.validate
  if (context.self.pristine && maxLengthValue !== '') {
    return validateObj?.json?.if?.[2] ?? ''
  }
  return validateObj?.maxLengthErrorMessage ?? ''
}

export const getMinLengthValue = (context: Context) => {
  const validateObj = context.data?.validate
  if (context.self.pristine) {
    const nestedRule = validateObj?.json?.if?.[1]?.if?.[0]?.['>=']?.[1]
    const nonNestedRule = validateObj?.json?.if?.[0]?.['>=']?.[1]
    return nestedRule ?? nonNestedRule ?? ''
  }
  return validateObj?.minLength ?? ''
}

export const getMinLengthErrorMessageValue = (context: Context, minLengthValue: number | '') => {
  const validateObj = context.data?.validate
  if (context.self.pristine && minLengthValue !== '') {
    const nestedRule = validateObj?.json?.if?.[1]?.if?.[2]
    const nonNestedRule = validateObj?.json?.if?.[2]
    return nestedRule ?? nonNestedRule ?? ''
  }
  return validateObj?.minLengthErrorMessage ?? ''
}

export const getJsonLogicValue = (context: Context) => {
  const validateObj = context.data?.validate
  const maxLength = validateObj?.maxLength as number | ''
  const maxLengthMessage = validateObj?.maxLengthErrorMessage as string | undefined
  const minLength = validateObj?.minLength as number | ''
  const minLengthMessage = validateObj?.minLengthErrorMessage as string | undefined

  const minLengthRule = {
    if: [{ '>=': [{ length: [{ var: 'text' }] }, minLength] }, true, minLengthMessage || ''],
  }

  const getMaxLengthRule = (nestedRule: { if: unknown[] } | null) => ({
    if: [{ '<=': [{ length: [{ var: 'text' }] }, maxLength] }, nestedRule ?? true, maxLengthMessage || ''],
  })

  if (minLength !== '' && maxLength !== '') {
    return getMaxLengthRule(minLengthRule)
  }
  if (minLength !== '') {
    return minLengthRule
  }
  if (maxLength !== '') {
    return getMaxLengthRule(null)
  }
  return ''
}
