'use client'

import dynamic from 'next/dynamic'

export const QuillTextEditorClientOnly = dynamic(
  () => import('@/components/QuillTextEditor/QuillTextEditor'),
  { ssr: false },
)
