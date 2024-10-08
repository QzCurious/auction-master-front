'use client'

import Quill, { Delta, type EmitterSource, type Range } from 'quill/core'

import 'quill/dist/quill.snow.css'

import { BackgroundStyle } from 'quill/formats/background'
import Bold from 'quill/formats/bold'
import { ColorStyle } from 'quill/formats/color'
import Header from 'quill/formats/header'
import Image from 'quill/formats/image'
import IndentClass from 'quill/formats/indent'
import Italic from 'quill/formats/italic'
import Link from 'quill/formats/link'
import ListItem from 'quill/formats/list'
import Underline from 'quill/formats/underline'
import Toolbar from 'quill/modules/toolbar'
import SnowTheme from 'quill/themes/snow'
import type React from 'react'
import { useEffect, useLayoutEffect, useRef } from 'react'

import './QuillTextEditor.css'

Quill.register('modules/toolbar', Toolbar)
Quill.register('themes/snow', SnowTheme)
Quill.register('formats/bold', Bold)
Quill.register('formats/italic', Italic)
Quill.register('formats/underline', Underline)
Quill.register('formats/header', Header)
Quill.register('formats/color', ColorStyle)
Quill.register('formats/background', BackgroundStyle)
Quill.register('formats/indent', IndentClass)
Quill.register('formats/link', Link)
Quill.register('formats/list', ListItem)
Quill.register('formats/image', Image)

interface EditorProps {
  readOnly?: boolean
  hideToolbar?: boolean
  defaultValue?: Delta | string
  onTextChange?: (delta: Delta, oldContent: Delta, source: EmitterSource) => void
  onSelectionChange?: (range: Range, oldRange: Range, source: EmitterSource) => void
  quillRef?: React.ForwardedRef<Quill>
}

// Editor is an uncontrolled React component
function QuillTextEditor({
  quillRef,
  readOnly,
  hideToolbar,
  defaultValue,
  onTextChange,
  onSelectionChange,
}: EditorProps) {
  const _quillRef = useRef<Quill>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideToolbarRef = useRef(hideToolbar)
  const defaultValueRef = useRef(defaultValue)
  const onTextChangeRef = useRef(onTextChange)
  const onSelectionChangeRef = useRef(onSelectionChange)

  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange
    onSelectionChangeRef.current = onSelectionChange
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    )
    const quill = new Quill(editorContainer, {
      modules: {
        toolbar: hideToolbarRef.current
          ? false
          : {
              container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'], // toggled buttons
                ['link'],
                // ['link', 'image'],

                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

                [{ color: [] }, { background: [] }], // dropdown with defaults from theme

                ['clean'], // remove formatting button
              ],
              // handlers: {
              //   image: () => {
              //     const input = document.createElement('input');
              //     input.setAttribute('type', 'file');
              //     input.setAttribute('accept', 'image/*');
              //     input.click();

              //     input.onchange = async () => {
              //       const file = input.files ? input.files[0] : null;
              //       if (file) {
              //         const formData = new FormData();
              //         formData.append('image', file);

              //         const res = await fetch('http://172.234.95.57:3001/upload', {
              //           method: 'POST',
              //           body: formData,
              //         });

              //         const url = await res.text();

              //         const range = quill.getSelection();
              //         if (range) {
              //           quill.insertEmbed(range.index, 'image', url);
              //         }
              //       }
              //     };
              //   },
              // },
            },
      },
      theme: 'snow',
    })

    ;(_quillRef.current as any) = quill
    if (typeof quillRef === 'function') quillRef(quill)
    if (quillRef && typeof quillRef === 'object') quillRef.current = quill

    if (defaultValueRef.current) {
      quill.setContents(
        typeof defaultValueRef.current === 'string'
          ? new Delta({ ops: JSON.parse(defaultValueRef.current) })
          : defaultValueRef.current,
      )
    }

    quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      onTextChangeRef.current?.(...args)
    })

    quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      onSelectionChangeRef.current?.(...args)
    })

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ;(_quillRef.current as any) = null
      if (typeof quillRef === 'function') quillRef(null)
      if (quillRef && typeof quillRef === 'object') quillRef.current = null
      container.innerHTML = ''
    }
  }, [quillRef])

  useEffect(() => {
    if (_quillRef) _quillRef?.current?.enable(!readOnly)
  }, [readOnly])

  return <div ref={containerRef}></div>
}

export default QuillTextEditor
