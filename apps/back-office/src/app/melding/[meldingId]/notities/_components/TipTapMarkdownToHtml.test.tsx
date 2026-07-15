import { render, screen } from '@testing-library/react'

import { TipTapMarkdownToHtml } from './TipTapMarkdownToHtml'

import styles from './TipTapMarkdownToHtml.module.css'

describe('TipTapMarkdownToHtml', () => {
  it('renders the parsed content in a wrapper with the content class', () => {
    const { container } = render(<TipTapMarkdownToHtml markdown="Hello world" />)

    expect(container.firstElementChild).toHaveClass(styles.content)
  })

  it('renders plain text within a paragraph', () => {
    render(<TipTapMarkdownToHtml markdown="Hello world" />)

    const paragraph = screen.getByRole('paragraph')

    expect(paragraph).toHaveTextContent('Hello world')
    expect(paragraph).toHaveClass('ams-paragraph')
  })

  it('renders bold, italic, and underlined text with their respective tags', () => {
    render(<TipTapMarkdownToHtml markdown={'**Bold** *Italic* ++Underline++'} />)

    expect(screen.getByRole('strong')).toHaveTextContent('Bold')
    expect(screen.getByRole('emphasis')).toHaveTextContent('Italic')
    expect(screen.getByText('Underline').tagName).toBe('U')
  })

  it('renders a bullet list as <ul> with <li> items', () => {
    render(<TipTapMarkdownToHtml markdown={'- One\n- Two'} />)

    const list = screen.getByRole('list')
    const items = screen.getAllByRole('listitem')

    expect(list).toBeInTheDocument()
    expect(list).toHaveClass('ams-unordered-list')
    expect(items[0]).toHaveTextContent('One')
    expect(items[0]).toHaveClass('ams-unordered-list__item')
    expect(items[1]).toHaveTextContent('Two')
  })

  it('renders an empty paragraph node as a line break', () => {
    const { container } = render(<TipTapMarkdownToHtml markdown={'\n\n'} />)

    expect(container.querySelector('br')).toBeInTheDocument()
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('renders an empty div for markdown with no content', () => {
    const { container } = render(<TipTapMarkdownToHtml markdown="" />)

    expect(container.firstChild).toBeEmptyDOMElement()
  })

  it('renders nothing for markdown that is only whitespace', () => {
    const { container } = render(<TipTapMarkdownToHtml markdown="   " />)

    expect(container.firstChild).toBeEmptyDOMElement()
  })
})
