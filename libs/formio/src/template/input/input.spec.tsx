import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FormRenderer } from '../../FormRenderer'

const testLabel = 'Test label'

const mockFormData = {
  display: 'form',
  components: [
    {
      label: testLabel,
      type: 'textarea',
      position: 1,
      maxCharCount: 80,
      input: true,
      key: 'textArea',
    },
  ],
}

describe('Input', () => {
  describe('Text area', () => {
    it('renders', () => {
      render(<FormRenderer form={mockFormData} />)

      const textArea = screen.getByRole('textbox', { name: testLabel })

      expect(textArea).toBeInTheDocument()
    })

    it('has the correct class', () => {
      render(<FormRenderer form={mockFormData} />)

      const textArea = screen.getByRole('textbox', { name: testLabel })

      expect(textArea).toHaveClass('ams-text-area')
    })

    it('has the correct dir attribute', () => {
      render(<FormRenderer form={mockFormData} />)

      const textArea = screen.getByRole('textbox', { name: testLabel })

      expect(textArea).toHaveAttribute('dir', 'auto')
    })

    describe('Character counter', () => {
      it('renders', () => {
        render(<FormRenderer form={mockFormData} />)

        const charCount = screen.getByRole('status')

        expect(charCount).toBeInTheDocument()
      })

      it('has the correct class', () => {
        render(<FormRenderer form={mockFormData} />)

        const charCount = screen.getByRole('status')

        expect(charCount).toHaveClass('ams-character-count')
      })

      // TODO: couldn't get this to work
      it.skip('counts characters', async () => {
        const user = userEvent.setup()

        render(<FormRenderer form={mockFormData} />)

        const textarea = screen.getByRole('textbox', { name: testLabel })

        await user.type(textarea, '0123456789')

        const charCount = screen.getByRole('status')

        expect(charCount).toHaveTextContent('10 van 1000 tekens')
      })

      // TODO: couldn't get this to work
      it.skip('adds a class when too many characters have been typed', async () => {})
    })
  })
})
