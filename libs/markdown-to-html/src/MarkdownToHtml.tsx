import { Column, Heading, Link, OrderedList, Paragraph, UnorderedList } from '@amsterdam/design-system-react'
import { Children, isValidElement } from 'react'
import type { PropsWithChildren } from 'react'
import ReactMarkdown from 'react-markdown'

const richTextMarkdownToHtmlMap = {
  a: ({ children, href }: PropsWithChildren<{ href?: string }>) => {
    const isExternal = href?.startsWith('http')

    return (
      <Link {...(href ? { href } : {})} rel={isExternal ? 'external' : undefined} variant="inline">
        {children}
      </Link>
    )
  },
  h2: ({ children }: PropsWithChildren) => (
    <Heading level={2} size="level-3">
      {children}
    </Heading>
  ),
  h3: ({ children }: PropsWithChildren) => (
    <Heading level={3} size="level-4">
      {children}
    </Heading>
  ),
  h4: ({ children }: PropsWithChildren) => (
    <Heading level={4} size="level-5">
      {children}
    </Heading>
  ),
  ol: ({ children }: PropsWithChildren) => {
    const replacedChildren = Children.map(children, (child) => {
      if (isValidElement(child) && child.type === 'li') {
        return <OrderedList.Item {...child.props} />
      }

      return undefined
    })

    return <OrderedList>{replacedChildren}</OrderedList>
  },
  p: ({ children }: PropsWithChildren) => <Paragraph>{children}</Paragraph>,
  ul: ({ children }: PropsWithChildren) => {
    const replacedChildren = Children.map(children, (child) => {
      if (isValidElement(child) && child.type === 'li') {
        return <UnorderedList.Item {...child.props} />
      }

      return undefined
    })

    return <UnorderedList>{replacedChildren}</UnorderedList>
  },
}

const descriptionMarkdownToHtmlMap = {
  p: ({ children }: PropsWithChildren) => <Paragraph size="small">{children}</Paragraph>,
}

const richTextAllowedElements = ['a', 'br', 'em', 'h2', 'h3', 'h4', 'li', 'ol', 'p', 'strong', 'ul']
// Some screen readers do not read rich text content in input descriptions.
// For this reason, we only allow paragraphs.
const descriptionAllowedElements = ['p']

export const MarkdownToHtml = ({
  children,
  className,
  id,
  type = 'rich-text',
}: {
  children: string
  className?: string
  id?: string
  type?: 'description' | 'rich-text'
}) => (
  <Column className={className ?? ''} id={id}>
    <ReactMarkdown
      allowedElements={type === 'description' ? descriptionAllowedElements : richTextAllowedElements}
      components={type === 'description' ? descriptionMarkdownToHtmlMap : richTextMarkdownToHtmlMap}
      skipHtml
      urlTransform={(url) => url} // Force ReactMarkdown to pass urls as-is
    >
      {children}
    </ReactMarkdown>
  </Column>
)
