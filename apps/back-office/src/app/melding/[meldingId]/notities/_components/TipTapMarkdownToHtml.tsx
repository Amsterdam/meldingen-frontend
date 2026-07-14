import type { JSONContent } from '@tiptap/core'
import type { ReactNode } from 'react'

import { Fragment } from 'react'

import { Paragraph, UnorderedList } from '@meldingen/ui'

import { markdownManager } from '~/app/_utils/parseNoteDocument'

import styles from './TipTapMarkdownToHtml.module.css'

const renderMarks = (text: string, marks: JSONContent['marks'] = []) =>
  marks.reduce<ReactNode>((rendered, mark) => {
    if (mark.type === 'bold') return <strong>{rendered}</strong>
    if (mark.type === 'italic') return <em>{rendered}</em>
    if (mark.type === 'underline') return <u>{rendered}</u>

    return rendered
  }, text)

const renderNodes = (nodes: JSONContent[] = []): ReactNode =>
  nodes.map((node, index) => {
    switch (node.type) {
      case 'bulletList':
        return <UnorderedList key={index}>{renderNodes(node.content)}</UnorderedList>
      case 'listItem':
        return <UnorderedList.Item key={index}>{renderNodes(node.content)}</UnorderedList.Item>
      case 'paragraph':
        // Render empty paragraphs as `<br>`
        if (!node.content || node.content.length === 0) return <br key={index} />

        return <Paragraph key={index}>{renderNodes(node.content)}</Paragraph>
      case 'text':
        return <Fragment key={index}>{renderMarks(node.text ?? '', node.marks)}</Fragment>
      default:
        return null
    }
  })

// Renders a note's markdown as React elements without going through generateHTML, which needs a
// browser DOM and can't run during Next's server render.
export const TipTapMarkdownToHtml = ({ markdown }: { markdown: string }) => (
  <div className={styles.content}>{renderNodes(markdownManager.parse(markdown).content)}</div>
)
