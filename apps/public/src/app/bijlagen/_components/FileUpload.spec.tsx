import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { MeldingContext } from '../../../context/MeldingContextProvider'
import { NextRouterContextProviderMock } from '../../../mocks/NextRouterContextProviderMock'

import { FileUpload } from './FileUpload'

const mockResponseData = {
  id: 1,
  original_filename: 'example.png',
  filename: 'example.png',
  created_at: '2021-10-14T14:05:41.000000Z',
}

let callCount = 0

const server = setupServer(
  http.post('http://localhost:8000/melding/2/attachment', () => {
    callCount += 1
    if (callCount === 1) {
      return HttpResponse.json(mockResponseData)
    }
    return HttpResponse.json({ ...mockResponseData, id: callCount })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const push = jest.fn()

const mockContextValue = {
  data: {
    id: 2,
    token: 'test',
    classification: 1,
  },
  setData: () => {},
}

const renderComponent = () => {
  render(
    <MeldingContext.Provider value={mockContextValue}>
      <NextRouterContextProviderMock router={{ push }}>
        <FileUpload />
      </NextRouterContextProviderMock>
    </MeldingContext.Provider>,
  )
}

describe('FileUpload Component', () => {
  it('renders the drop area text', () => {
    renderComponent()

    const buttonText = screen.getByText('Selecteer bestanden')
    const dropAreaText = screen.getByText('Of sleep de bestanden in dit vak.')

    expect(buttonText).toBeInTheDocument()
    expect(dropAreaText).toBeInTheDocument()
  })

  it('uploads multiple files', async () => {
    renderComponent()

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

    await userEvent.upload(fileInput, [file, file2])

    expect(fileInput.files).toHaveLength(2)
  })

  it('uploads a file and displays name', async () => {
    renderComponent()

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })

    await userEvent.upload(fileInput, file)

    expect(fileInput.files).toHaveLength(1)

    expect(screen.getByText('example.png')).toBeInTheDocument()
  })
})
