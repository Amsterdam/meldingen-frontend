import { render, screen } from '@testing-library/react'

import { TipTapMarkdownToHtml } from './TipTapMarkdownToHtml'
import { markdownManager } from '~/app/_utils/parseNoteDocument'

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
  })

  it('renders bold text wrapped in a <strong>', () => {
    render(<TipTapMarkdownToHtml markdown="**Bold**" />)

    const strongText = screen.getByRole('strong')

    expect(strongText).toHaveTextContent('Bold')
  })

  it('renders italic text wrapped in an <em>', () => {
    render(<TipTapMarkdownToHtml markdown="*Italic*" />)

    const emphasizedText = screen.getByRole('emphasis')

    expect(emphasizedText).toHaveTextContent('Italic')
  })

  it('renders underlined text wrapped in a <u>', () => {
    render(<TipTapMarkdownToHtml markdown="++Underline++" />)

    expect(screen.getByText('Underline').tagName).toBe('U')
  })

  it('ignores unsupported marks and keeps the text content', () => {
    vi.spyOn(markdownManager, 'parse').mockReturnValueOnce({
      content: [
        {
          content: [{ marks: [{ type: 'strike' }], text: 'Unsupported mark', type: 'text' }],
          type: 'paragraph',
        },
      ],
      type: 'doc',
    })

    render(<TipTapMarkdownToHtml markdown="ignored by mock" />)

    const paragraph = screen.getByRole('paragraph')

    expect(paragraph).toHaveTextContent('Unsupported mark')
    expect(paragraph.querySelector('strong, em, u')).toBeNull()
  })

  it('nests multiple marks on the same text', () => {
    render(<TipTapMarkdownToHtml markdown="***Both***" />)

    const emphasizedText = screen.getByRole('emphasis')

    const strongText = emphasizedText.querySelector('strong')

    expect(strongText).toHaveTextContent('Both')
    expect(strongText?.parentElement).toBe(emphasizedText)
  })

  it('renders a bullet list as <ul> with <li> items', () => {
    render(<TipTapMarkdownToHtml markdown={'- One\n- Two'} />)

    const list = screen.getByRole('list')
    const items = screen.getAllByRole('listitem')

    expect(list).toBeInTheDocument()
    expect(items[0]).toHaveTextContent('One')
    expect(items[1]).toHaveTextContent('Two')
  })

  it('renders multiple paragraphs separately', () => {
    render(<TipTapMarkdownToHtml markdown={'First\n\nSecond'} />)

    const paragraphs = screen.getAllByRole('paragraph')

    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0]).toHaveTextContent('First')
    expect(paragraphs[1]).toHaveTextContent('Second')
  })

  it('renders an empty paragraph node as a line break', () => {
    const { container } = render(<TipTapMarkdownToHtml markdown={'\n\n'} />)

    expect(container.querySelector('br')).toBeInTheDocument()
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('renders an empty string when a text node has no text value', () => {
    vi.spyOn(markdownManager, 'parse').mockReturnValueOnce({
      content: [{ content: [{ type: 'text' }], type: 'paragraph' }],
      type: 'doc',
    })

    render(<TipTapMarkdownToHtml markdown="ignored by mock" />)

    expect(screen.getByRole('paragraph')).toBeEmptyDOMElement()
  })

  it('ignores unsupported node types', () => {
    vi.spyOn(markdownManager, 'parse').mockReturnValueOnce({
      content: [{ attrs: { level: 1 }, content: [{ text: 'Ignored heading', type: 'text' }], type: 'heading' }],
      type: 'doc',
    })

    const { container } = render(<TipTapMarkdownToHtml markdown="ignored by mock" />)

    expect(container.firstChild).toBeEmptyDOMElement()
    expect(screen.queryByText('Ignored heading')).not.toBeInTheDocument()
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
