import { Column, Heading, Link, OrderedList, Paragraph, UnorderedList } from '@amsterdam/design-system-react'
import { Children, isValidElement } from 'react'
import type { PropsWithChildren } from 'react'
import ReactMarkdown from 'react-markdown'

const markdownToHtmlMap = {
  a: ({ children, href }: PropsWithChildren<{ href?: string }>) => {
    const isExternal = href?.startsWith('http')

    return (
      <Link {...(href ? { href } : {})} rel={isExternal ? 'external' : undefined} variant="inline">
        {children}
      </Link>
    )
  },
  h2: ({ children }: PropsWithChildren) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }: PropsWithChildren) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }: PropsWithChildren) => <Heading level={4}>{children}</Heading>,
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

const disallowedElements = ['blockquote', 'code', 'h1', 'h5', 'h6', 'hr', 'img']

export const MarkdownToHtml = ({ children }: { children: string }) => (
  <Column>
    <ReactMarkdown components={markdownToHtmlMap} disallowedElements={disallowedElements} skipHtml>
      {children}
    </ReactMarkdown>
  </Column>
)
