const VALIDATION_ERROR_MESSAGES_TRANSLATION_KEYS: Record<string, string> = {
  'Allowed content size exceeded': 'validation-errors.file-too-large',
  'Attachment not allowed': 'validation-errors.invalid-file-type',
  'Media type of data does not match provided media type': 'validation-errors.invalid-file-extension',
}

export const getValidationErrorMessageTranslationKey = (error?: string): string =>
  (error && VALIDATION_ERROR_MESSAGES_TRANSLATION_KEYS[error]) || 'validation-errors.failed-upload'
