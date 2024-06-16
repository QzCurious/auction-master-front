import React from 'react'
import Frame from './Frame'
import WithConfigContext from './WithConfigContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WithConfigContext>
      <Frame>{children}</Frame>
    </WithConfigContext>
  )
}
