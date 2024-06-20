import React from 'react'
import Frame from './Frame'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Frame>{children}</Frame>
}
