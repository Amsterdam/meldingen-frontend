import { render, screen } from '@testing-library/react'

import { MarkdownToHtml } from './MarkdownToHtml'

describe('MarkdownToHtml', () => {
  it('renders a link', () => {
    render(<MarkdownToHtml>[Link](http://example.com)</MarkdownToHtml>)

    const link = screen.getByRole('link', { name: 'Link' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'http://example.com')
    expect(link).toHaveClass('ams-link ams-link--inline')
  })

  it('renders an external link', () => {
    render(<MarkdownToHtml>[Link](http://example.com)</MarkdownToHtml>)

    const link = screen.getByRole('link', { name: 'Link' })

    expect(link).toHaveAttribute('rel', 'external')
  })

  it('renders an internal link', () => {
    render(<MarkdownToHtml>[Link](mailto:email@email.email)</MarkdownToHtml>)

    const link = screen.getByRole('link', { name: 'Link' })

    expect(link).not.toHaveAttribute('rel')
  })

  it('renders a link without href', () => {
    render(<MarkdownToHtml>[Link]()</MarkdownToHtml>)

    const link = screen.getByText('Link')

    expect(link).not.toHaveAttribute('href')
  })

  it('renders a heading level 2', () => {
    render(<MarkdownToHtml>## Heading 2</MarkdownToHtml>)

    const heading = screen.getByRole('heading', { level: 2 })

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveClass('ams-heading ams-heading--level-3')
  })

  it('renders a heading level 3', () => {
    render(<MarkdownToHtml>### Heading 3</MarkdownToHtml>)

    const heading = screen.getByRole('heading', { level: 3 })

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveClass('ams-heading ams-heading--level-4')
  })

  it('renders a heading level 4', () => {
    render(<MarkdownToHtml>#### Heading 4</MarkdownToHtml>)

    const heading = screen.getByRole('heading', { level: 4 })

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveClass('ams-heading ams-heading--level-5')
  })

  it('renders an ordered list', () => {
    render(<MarkdownToHtml>{'1. Item 1\n2. Item 2'}</MarkdownToHtml>)

    const list = screen.getByRole('list')

    expect(list).toBeInTheDocument()
    expect(list).toHaveClass('ams-ordered-list')

    const items = screen.getAllByRole('listitem')

    expect(items).toHaveLength(2)
    expect(items[0]).toHaveClass('ams-ordered-list__item')
  })

  it('renders an unordered list', () => {
    render(<MarkdownToHtml>{'- Item 1\n- Item 2'}</MarkdownToHtml>)

    const list = screen.getByRole('list')

    expect(list).toBeInTheDocument()
    expect(list).toHaveClass('ams-unordered-list')

    const items = screen.getAllByRole('listitem')

    expect(items).toHaveLength(2)
    expect(items[0]).toHaveClass('ams-unordered-list__item')
  })

  it('renders a paragraph', () => {
    render(<MarkdownToHtml>This is a paragraph.</MarkdownToHtml>)

    const paragraph = screen.getByText('This is a paragraph.')

    expect(paragraph).toBeInTheDocument()
    expect(paragraph).toHaveClass('ams-paragraph')
  })

  it('does not render disallowed elements', () => {
    render(
      <MarkdownToHtml>
        {'# Heading 1\n> Blockquote\n`nano`\n___\n![Image](http://example.com/image.png)'}
      </MarkdownToHtml>,
    )

    const blockquote = screen.queryByText('Blockquote')
    const code = screen.queryByRole('code')
    const heading = screen.queryByRole('heading', { level: 1 })
    const separator = screen.queryByRole('separator')
    const image = screen.queryByRole('img')

    expect(blockquote).not.toBeInTheDocument()
    expect(code).not.toBeInTheDocument()
    expect(heading).not.toBeInTheDocument()
    expect(separator).not.toBeInTheDocument()
    expect(image).not.toBeInTheDocument()
  })
})
