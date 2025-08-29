import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

import { FileUpload } from './FileUpload'

class DataTransferItemMock {
  constructor(public file: File) {}
}

class DataTransferItemListMock {
  private _items: DataTransferItemMock[] = []

  add(file: File) {
    this._items.push(new DataTransferItemMock(file))
  }
}

class DataTransferMock {
  items: DataTransferItemListMock = new DataTransferItemListMock()
  constructor() {}
  add(file: File) {
    this.items.add(file)
  }
}

global.DataTransfer = DataTransferMock as unknown as { new (): DataTransfer }

describe('FileUpload', () => {
  it('renders button and texts', () => {
    render(<FileUpload onChange={vi.fn()} buttonText="Button text" dropAreaText="Drop area text" />)

    const button = screen.getByRole('button', { name: 'Drop area text Button text' })

    expect(button).toBeInTheDocument()
  })

  // it('calls onChange with files from file dialog', () => {
  //   const onChange = vi.fn()
  //   render(<FileUpload onChange={onChange} />)

  //   // Simulate click and file input
  //   const input = document.createElement('input')

  //   input.type = 'file'

  //   const file = new File(['file-content'], 'test.png', { type: 'image/png' })

  //   Object.defineProperty(input, 'files', {
  //     value: [file],
  //     writable: false,
  //   })

  //   // Simulate onchange
  //   input.onchange = () => {
  //     onChange(input.files)
  //   }

  //   input.onchange!(new Event('change'))

  //   expect(onChange).toHaveBeenCalledWith([file])
  // })\\

  // it('djd', async () => {
  //   const user = userEvent.setup()

  //   const onChange = vi.fn()
  //   const { getByRole } = render(<FileUpload onChange={onChange} />)

  //   const file = new File(['hello'], 'hello.png', { type: 'image/png' })
  //   const input = screen.getByRole('button')

  //   await user.upload(input, file)

  //   expect(input.files[0]).toBe(file)
  //   expect(input.files.item(0)).toBe(file)
  //   expect(input.files).toHaveLength(1)
  // })

  it('calls onChange with files from drop event', () => {
    const onChange = vi.fn()

    render(<FileUpload onChange={onChange} />)

    const button = screen.getByRole('button')

    fireEvent.drop(button, {
      dataTransfer: {
        files: [new File(['file-content'], 'test.png', { type: 'image/png' })],
      },
    })

    expect(onChange).toHaveBeenCalled()

    const files = onChange.mock.calls[0][0]

    expect(files.length).toBe(1)
    expect(files[0].name).toBe('test.png')
  })

  // TODO: this test does not check if onChange is called with the right files
  it('calls onChange after drop event if browser uses dataTransfer.items', () => {
    const onChange = vi.fn()

    render(<FileUpload onChange={onChange} />)

    const button = screen.getByRole('button')

    const file = new File(['file-content'], 'test.png', { type: 'image/png' })
    const dataTransferItem = {
      kind: 'file',
      getAsFile: () => file,
    }
    const dataTransfer = {
      items: [dataTransferItem],
      files: [],
    }

    fireEvent.drop(button, { dataTransfer })

    expect(onChange).toHaveBeenCalled()
  })

  it('prevents default on drag over', () => {
    const onChange = vi.fn()

    render(<FileUpload onChange={onChange} />)

    const button = screen.getByRole('button')

    // fireEvent.dragOver does not call onChange, so we must call the handler directly
    const event = new Event('dragover', { bubbles: true, cancelable: true })
    event.preventDefault = vi.fn()
    button.dispatchEvent(event)

    expect(event.preventDefault).toHaveBeenCalled()
  })
})
