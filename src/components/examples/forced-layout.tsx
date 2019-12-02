import React, { useCallback, useMemo } from 'react'
import { withReact } from 'slate-react'
import { Slate, Editable } from 'slate-react-next'
import { Editor, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import {
  withSchema,
  ChildInvalidError,
  NodeRule,
  ChildMaxInvalidError,
  ChildMinInvalidError,
} from 'slate-schema'
import { CustomElementProps } from 'slate-react/lib/components/custom'

const schema: NodeRule[] = [
  {
    for: 'node',
    match: 'editor',
    validate: {
      children: [
        { match: [{ type: 'title' }], min: 1, max: 1 },
        { match: [{ type: 'paragraph' }], min: 1 },
      ],
    },
    normalize: (editor, error) => {
      error = error as
        | ChildInvalidError
        | ChildMinInvalidError
        | ChildMaxInvalidError

      const { code, path, index } = error
      const type = index === 0 ? 'title' : 'paragraph'

      switch (code) {
        case 'child_invalid': {
          Editor.setNodes(editor, { type }, { at: path })
          break
        }
        case 'child_min_invalid': {
          const block = { type, children: [{ text: '', marks: [] }] }
          Editor.insertNodes(editor, block, { at: path.concat(index) })
          break
        }
        case 'child_max_invalid': {
          Editor.setNodes(editor, { type }, { at: path.concat(index) })
          break
        }
      }
    },
  },
]

const ForcedLayoutExample = () => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(
    () => withSchema(withHistory(withReact(createEditor())), schema),
    []
  )
  return (
    <Slate editor={editor} defaultValue={initialValue}>
      <Editable
        renderElement={renderElement}
        placeholder="Enter a title…"
        spellCheck
        autoFocus
      />
    </Slate>
  )
}

const Element = ({ attributes, children, element }: CustomElementProps) => {
  switch (element.type) {
    case 'title':
      return <h2 {...attributes}>{children}</h2>
    case 'paragraph':
      return <p {...attributes}>{children}</p>
    default:
      return <div {...attributes}>{children}</div>
  }
}

const initialValue = [
  {
    type: 'title',
    children: [
      {
        text: 'Enforce Your Layout!',
        marks: [],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows how to enforce your layout with schema-specific rules. This document will always have a title block at the top and at least one paragraph in the body. Try deleting them and see what happens!',
        marks: [],
      },
    ],
  },
]

export default ForcedLayoutExample
